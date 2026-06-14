export type OrderSource = "instagram" | "opensooq";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderLineItem {
  id: string;
  label: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  shippingAddress: string;
  source: OrderSource;
  status: OrderStatus;
  items: OrderLineItem[];
  createdAt: string;
  shopLocation: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  imageGradient: string;
}
