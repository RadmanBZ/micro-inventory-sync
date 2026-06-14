from __future__ import annotations

import uuid
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, ForeignKey
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product import Product


class OrderItem(SQLModel, table=True):
    """Line item linking an order to a product and quantity."""

    __tablename__ = "order_items"

    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: UUID = Field(
        sa_column=Column(
            ForeignKey("orders.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    product_id: UUID = Field(
        sa_column=Column(
            ForeignKey("products.id", ondelete="RESTRICT"),
            nullable=False,
            index=True,
        ),
    )
    quantity: int = Field(default=1, ge=1, nullable=False)

    order: Order = Relationship(back_populates="items")
    product: Product = Relationship(back_populates="order_items")
