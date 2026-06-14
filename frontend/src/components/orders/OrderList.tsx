"use client";

import { OrderCard } from "@/components/orders/OrderCard";
import type { Order } from "@/lib/types";

interface OrderListProps {
  orders: Order[];
  onConfirm: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export function OrderList({ orders, onConfirm, onReject }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface-raised px-6 py-16 text-center">
        <p className="text-base font-semibold text-ink">All caught up</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
          New orders from Instagram Direct and OpenSooq will appear here
          instantly for AI-assisted review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onConfirm={onConfirm}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
