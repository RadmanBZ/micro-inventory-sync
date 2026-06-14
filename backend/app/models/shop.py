from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product import Product


class Shop(SQLModel, table=True):
    """
    Tenant root entity for logical multi-tenancy.

    Each shop represents an independent merchant workspace within the shared database.
    """

    __tablename__ = "shops"

    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255, index=True, nullable=False)
    instagram_page_id: str | None = Field(
        default=None,
        max_length=255,
        index=True,
        nullable=True,
    )
    opensooq_credentials: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    products: list[Product] = Relationship(
        back_populates="shop",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    orders: list[Order] = Relationship(
        back_populates="shop",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
