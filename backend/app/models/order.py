from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, ForeignKey, Text
from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import OrderStatus

if TYPE_CHECKING:
    from app.models.order_item import OrderItem
    from app.models.shop import Shop


class Order(SQLModel, table=True):
    """Customer order captured from Instagram or OpenSooq chat flows."""

    __tablename__ = "orders"

    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    shop_id: UUID = Field(
        sa_column=Column(
            ForeignKey("shops.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    customer_name: str = Field(max_length=255, nullable=False)
    shipping_address: str = Field(max_length=1000, nullable=False)
    status: OrderStatus = Field(
        default=OrderStatus.PENDING,
        nullable=False,
        index=True,
    )
    raw_chat_log: str = Field(
        default="",
        sa_column=Column(Text, nullable=False),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    shop: Shop = Relationship(back_populates="orders")
    items: list[OrderItem] = Relationship(
        back_populates="order",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
