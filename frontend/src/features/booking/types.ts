export type OrderStatus = "DRAFT" | "PENDING_PAYMENT" | "DELEGATED" | "PAID" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface OrderItem {
  billboardId: string;
  unitPrice: number;
  startDate: string;
  endDate: string;
}

export interface Order {
  id: string;
  annonceurId: string;
  delegatedToMediaBuyerId?: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
}

export interface CartLine {
  billboardId: string;
  title: string;
  monthlyPrice: number;
  currency: string;
  startDate: string;
  endDate: string;
}
