from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database import get_session
from app.services.instagram_service import process_instagram_webhook_payload

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/instagram", tags=["instagram"])


@router.get(
    "/webhook",
    summary="Meta Instagram webhook verification",
    response_class=PlainTextResponse,
)
async def verify_instagram_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
) -> PlainTextResponse:
    """
    Respond to Meta's subscription verification challenge.

    Meta sends ``hub.verify_token``; we echo ``hub.challenge`` when it matches
    ``settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN``.
    """
    if hub_mode != "subscribe":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid hub.mode.",
        )

    if hub_verify_token != settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Webhook verify token mismatch.",
        )

    return PlainTextResponse(content=hub_challenge)


@router.post(
    "/webhook",
    summary="Receive Instagram messaging events",
    status_code=status.HTTP_200_OK,
)
async def receive_instagram_webhook(
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    """
    Ingest live Instagram DM events, append chat history, extract orders via Gemini,
    and temporarily reserve inventory for matched products.
    """
    try:
        payload = await request.json()
    except Exception as exc:
        logger.warning("Invalid Instagram webhook JSON payload: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload.",
        ) from exc

    try:
        await process_instagram_webhook_payload(session, payload)
    except Exception:
        logger.exception("Instagram webhook processing failed.")
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed.",
        ) from None

    return {"status": "ok"}
