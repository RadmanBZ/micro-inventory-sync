"use client";

import { Check, MapPin, Package, X } from "lucide-react";

import { SourceBadge } from "@/components/orders/SourceBadge";
import { formatRelativeTime } from "@/lib/format";
import type { Order } from "@/lib/types";

interface OrderCardProps {
  order: Order;
  onConfirm: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export function OrderCard({ order, onConfirm, onReject }: OrderCardProps) {
  const isPending = order.status === "pending";

  return (
    <article
      className="animate-slide-up overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card transition-all duration-300 hover:shadow-elevated"
    >
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-widest text-ink-subtle">
              {formatRelativeTime(order.createdAt)} · {order.shopLocation}
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-ink">
              {order.customerName}
            </h3>
          </div>
          <SourceBadge source={order.source} />
        </div>

        <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-surface px-3.5 py-3">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
            strokeWidth={2}
          />
          <p className="text-sm leading-relaxed text-ink-muted">
            {order.shippingAddress}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            <Package className="h-3.5 w-3.5" strokeWidth={2} />
            Items
          </div>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm transition-all duration-300"
              >
                <span className="font-medium text-ink">{item.label}</span>
                <span className="rounded-lg bg-surface px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  {item.quantity}x
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2 border-t border-border bg-surface/60 p-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onConfirm(order.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all duration-300 hover:bg-black active:scale-[0.98]"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Confirm &amp; Deduct Stock
          </button>
          <button
            type="button"
            onClick={() => onReject(order.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-ink-muted transition-all duration-300 hover:border-border-strong hover:bg-surface hover:text-ink active:scale-[0.98]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            Reject
          </button>
        </div>
      ) : (
        <div className="border-t border-border bg-accent-muted px-5 py-3.5">
          <p className="text-center text-sm font-medium text-accent">
            Order confirmed — stock deducted
          </p>
        </div>
      )}
    </article>
  );
}
