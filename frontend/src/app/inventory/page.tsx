"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, PackageCheck } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductList } from "@/components/inventory/ProductList";
import { getStockLevel } from "@/lib/format";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const lowStockCount = useMemo(
    () =>
      products.filter(
        (product) =>
          getStockLevel(product.stock, product.lowStockThreshold) !== "healthy",
      ).length,
    [products],
  );

  const totalUnits = useMemo(
    () => products.reduce((sum, product) => sum + product.stock, 0),
    [products],
  );

  const handleAdjustStock = useCallback((productId: string, delta: number) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock + delta) }
          : product,
      ),
    );
  }, []);

  return (
    <AppShell
      header={
        <PageHeader
          title="Inventory"
          subtitle="Real-time stock across your Muscat and Seeb catalog. Tap +/- for emergency adjustments."
        />
      }
    >
      <div className="space-y-5 px-5">
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card transition-all duration-300">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
              <PackageCheck className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-ink">
              {totalUnits}
            </p>
            <p className="text-xs font-medium text-ink-muted">Total units</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card transition-all duration-300">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-ink">
              {lowStockCount}
            </p>
            <p className="text-xs font-medium text-ink-muted">Low / out items</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
              Product Catalog
            </h2>
            <span className="text-xs font-medium text-ink-subtle">
              {products.length} SKUs
            </span>
          </div>
          <ProductList
            products={products}
            onAdjustStock={handleAdjustStock}
          />
        </section>
      </div>
    </AppShell>
  );
}
