from __future__ import annotations

import logging
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.shop import Shop
from app.services.gemini_service import extract_order_from_chat

logger = logging.getLogger(__name__)


def _append_chat_entry(chat_log: str, sender_id: str, message_text: str) -> str:
    timestamp = datetime.now(timezone.utc).isoformat()
    entry = f"[{timestamp}] {sender_id}: {message_text.strip()}\n"
    if not chat_log:
        return entry
    return f"{chat_log.rstrip()}\n{entry}"


async def _resolve_shop(
    session: AsyncSession,
    recipient_page_id: str,
) -> Shop | None:
    statement = select(Shop).where(Shop.instagram_page_id == recipient_page_id)
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def _get_or_create_pending_order(
    session: AsyncSession,
    shop_id: UUID,
    sender_id: str,
) -> Order:
    """
    Fetch the pending order for a sender or create one under row-level lock.

    ``SELECT ... FOR UPDATE`` serializes concurrent webhook deliveries for the
    same conversation and prevents duplicate pending orders.
    """
    statement = (
        select(Order)
        .where(
            Order.shop_id == shop_id,
            Order.instagram_sender_id == sender_id,
            Order.status == OrderStatus.PENDING,
        )
        .with_for_update()
        .limit(1)
    )
    result = await session.execute(statement)
    order = result.scalar_one_or_none()

    if order is not None:
        return order

    order = Order(
        shop_id=shop_id,
        instagram_sender_id=sender_id,
        customer_name="",
        shipping_address="",
        status=OrderStatus.PENDING,
        raw_chat_log="",
    )
    session.add(order)
    await session.flush()
    return order


async def _get_pending_order_for_update(
    session: AsyncSession,
    order_id: UUID,
) -> Order | None:
    statement = (
        select(Order)
        .where(
            Order.id == order_id,
            Order.status == OrderStatus.PENDING,
        )
        .with_for_update()
        .limit(1)
    )
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def _release_order_reservations(
    session: AsyncSession,
    order_id: UUID,
) -> None:
    statement = (
        select(OrderItem, Product)
        .join(Product, OrderItem.product_id == Product.id)
        .where(OrderItem.order_id == order_id)
        .with_for_update()
    )
    result = await session.execute(statement)

    for order_item, product in result.all():
        product.reserved_stock = max(0, product.reserved_stock - order_item.quantity)
        await session.delete(order_item)

    await session.flush()


async def _find_product_for_name(
    session: AsyncSession,
    shop_id: UUID,
    product_name: str,
) -> Product | None:
    normalized_name = product_name.strip()
    if not normalized_name:
        return None

    exact_match = (
        select(Product)
        .where(
            Product.shop_id == shop_id,
            func.lower(Product.title) == func.lower(normalized_name),
        )
        .with_for_update()
        .limit(1)
    )
    result = await session.execute(exact_match)
    product = result.scalar_one_or_none()
    if product is not None:
        return product

    partial_match = (
        select(Product)
        .where(
            Product.shop_id == shop_id,
            Product.title.ilike(f"%{normalized_name}%"),
        )
        .with_for_update()
        .limit(1)
    )
    result = await session.execute(partial_match)
    return result.scalar_one_or_none()


async def _apply_extracted_order(
    session: AsyncSession,
    order: Order,
    extracted: dict,
) -> None:
    order.customer_name = (extracted.get("customer_name") or "")[:255]
    order.shipping_address = (extracted.get("shipping_address") or "")[:1000]

    await _release_order_reservations(session, order.id)

    for item in extracted.get("items") or []:
        product_name = (item.get("product_name") or "").strip()
        quantity = int(item.get("quantity") or 0)
        if not product_name or quantity < 1:
            continue

        product = await _find_product_for_name(session, order.shop_id, product_name)
        if product is None:
            logger.info(
                "No inventory match for product '%s' in shop %s.",
                product_name,
                order.shop_id,
            )
            continue

        available = product.stock - product.reserved_stock
        if available < quantity:
            logger.warning(
                "Insufficient available stock for product %s (requested=%s, available=%s).",
                product.id,
                quantity,
                available,
            )
            continue

        product.reserved_stock += quantity
        session.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
            ),
        )

    await session.flush()


async def process_text_message(
    session: AsyncSession,
    *,
    recipient_page_id: str,
    sender_id: str,
    message_text: str,
) -> None:
    """Persist chat activity, run Gemini extraction, and reserve matched stock."""
    shop = await _resolve_shop(session, recipient_page_id)
    if shop is None:
        logger.warning(
            "No shop mapped to Instagram page id '%s'; ignoring message.",
            recipient_page_id,
        )
        return

    try:
        order = await _get_or_create_pending_order(session, shop.id, sender_id)
        order.raw_chat_log = _append_chat_entry(order.raw_chat_log, sender_id, message_text)
        chat_log = order.raw_chat_log
        order_id = order.id
        await session.commit()
    except Exception:
        await session.rollback()
        raise

    extracted = await extract_order_from_chat(chat_log)

    try:
        order = await _get_pending_order_for_update(session, order_id)
        if order is None:
            logger.warning("Pending order %s no longer exists; skipping extraction apply.", order_id)
            return

        await _apply_extracted_order(session, order, extracted)
        await session.commit()
    except Exception:
        await session.rollback()
        raise


async def process_instagram_webhook_payload(
    session: AsyncSession,
    payload: dict,
) -> None:
    """Parse a Meta Instagram messaging webhook payload and process text messages."""
    if payload.get("object") != "instagram":
        logger.debug("Ignoring non-Instagram webhook object: %s", payload.get("object"))
        return

    for entry in payload.get("entry") or []:
        for messaging_event in entry.get("messaging") or []:
            message = messaging_event.get("message") or {}
            if message.get("is_echo"):
                continue

            message_text = message.get("text")
            if not message_text:
                continue

            sender = messaging_event.get("sender") or {}
            recipient = messaging_event.get("recipient") or {}
            sender_id = sender.get("id")
            recipient_page_id = recipient.get("id")

            if not sender_id or not recipient_page_id:
                logger.warning("Skipping messaging event with missing sender or recipient id.")
                continue

            await process_text_message(
                session,
                recipient_page_id=recipient_page_id,
                sender_id=sender_id,
                message_text=message_text,
            )
