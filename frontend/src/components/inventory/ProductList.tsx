"use client";

import { ProductRow } from "@/components/inventory/ProductRow";
import type { Product } from "@/lib/types";

interface ProductListProps {
  products: Product[];
  onAdjustStock: (productId: string, delta: number) => void;
}

export function ProductList({ products, onAdjustStock }: ProductListProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onAdjustStock={onAdjustStock}
        />
      ))}
    </div>
  );
}
