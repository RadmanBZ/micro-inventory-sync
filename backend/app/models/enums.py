from enum import Enum


class OrderStatus(str, Enum):
    """Lifecycle states for customer orders."""

    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
