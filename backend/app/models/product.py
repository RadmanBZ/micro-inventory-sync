from __future__ import annotations

import uuid
from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, ForeignKey, Numeric
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order_item import OrderItem
    from app.models.shop import Shop


class Product(SQLModel, table=True):
    """Inventory item scoped to a single shop tenant."""

    __tablename__ = "products"

    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    shop_id: UUID = Field(
        sa_column=Column(
            ForeignKey("shops.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    title: str = Field(max_length=500, nullable=False)
    sku: str = Field(max_length=128, index=True, nullable=False)
    price: Decimal = Field(
        default=Decimal("0.00"),
        sa_column=Column(Numeric(12, 2), nullable=False),
    )
    stock: int = Field(default=0, ge=0, nullable=False)
    reserved_stock: int = Field(default=0, ge=0, nullable=False)

    shop: Shop = Relationship(back_populates="products")
    order_items: list[OrderItem] = Relationship(back_populates="product")
