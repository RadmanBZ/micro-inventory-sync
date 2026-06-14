"use client";

import { useCallback, useMemo, useState } from "react";
import { Bot, Inbox } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderList } from "@/components/orders/OrderList";
import { MOCK_ORDERS } from "@/lib/mock-data";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending"),
    [orders],
  );

  const handleConfirm = useCallback((orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: "confirmed" } : order,
      ),
    );
  }, []);

  const handleReject = useCallback((orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));
  }, []);

  return (
    <AppShell
      header={
        <PageHeader
          badge="AI Queue Active"
          title="Live Orders"
          subtitle="Review incoming orders from Instagram Direct and OpenSooq. Confirm to deduct stock instantly."
        />
      }
    >
      <div className="space-y-5 px-5">
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card transition-all duration-300">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
              <Inbox className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-ink">
              {pendingOrders.length}
            </p>
            <p className="text-xs font-medium text-ink-muted">Pending review</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card transition-all duration-300">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <Bot className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-ink">
              {orders.length - pendingOrders.length}
            </p>
            <p className="text-xs font-medium text-ink-muted">Processed today</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
              AI-Extracted Queue
            </h2>
            <span className="rounded-full bg-accent-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
              Muscat &amp; Seeb
            </span>
          </div>
          <OrderList
            orders={pendingOrders}
            onConfirm={handleConfirm}
            onReject={handleReject}
          />
        </section>
      </div>
    </AppShell>
  );
}
