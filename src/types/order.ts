export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED";

export type ShippingMethod = "STORE_PICKUP" | "DELIVERY";

export interface OrderItemDTO {
  productId?: string;
  productSlug: string;
  productName: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingMethod: ShippingMethod;
  shippingFee?: number;
  address?: string;
  note?: string;
  items: OrderItemDTO[];
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  address?: string | null;
  note?: string | null;
  totalAmount: number;
  status: OrderStatus;
  items: {
    id: string;
    productId?: string | null;
    productSlug: string;
    productName: string;
    variantLabel?: string | null;
    price: number;
    quantity: number;
    image: string;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
