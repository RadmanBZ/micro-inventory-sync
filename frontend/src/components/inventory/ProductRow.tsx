"use client";

import { Minus, Plus } from "lucide-react";

import { formatOMR, getStockLevel } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductRowProps {
  product: Product;
  onAdjustStock: (productId: string, delta: number) => void;
}

const STOCK_BAR_COLORS = {
  healthy: "bg-accent",
  low: "bg-amber-500",
  critical: "bg-red-500",
} as const;

export function ProductRow({ product, onAdjustStock }: ProductRowProps) {
  const stockLevel = getStockLevel(product.stock, product.lowStockThreshold);
  const maxDisplayStock = Math.max(product.lowStockThreshold * 4, 20);
  const fillPercent = Math.min((product.stock / maxDisplayStock) * 100, 100);

  return (
    <article className="rounded-3xl border border-border bg-surface-raised p-4 shadow-card transition-all duration-300 hover:shadow-elevated">
      <div className="flex gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${product.imageGradient} shadow-inner`}
          aria-hidden="true"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
            {product.category.slice(0, 3)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink">
                {product.title}
              </h3>
              <p className="mt-0.5 text-xs text-ink-subtle">
                SKU · {product.sku}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
              {formatOMR(product.price)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                  Stock
                </span>
                {stockLevel !== "healthy" && (
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      stockLevel === "critical"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {stockLevel === "critical" ? "Out of stock" : "Low stock"}
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${STOCK_BAR_COLORS[stockLevel]}`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-2xl border border-border bg-surface p-1">
              <button
                type="button"
                aria-label={`Decrease stock for ${product.title}`}
                disabled={product.stock === 0}
                onClick={() => onAdjustStock(product.id, -1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted transition-all duration-300 hover:bg-white hover:text-ink active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums text-ink">
                {product.stock}
              </span>
              <button
                type="button"
                aria-label={`Increase stock for ${product.title}`}
                onClick={() => onAdjustStock(product.id, 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white transition-all duration-300 hover:bg-black active:scale-95"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
