import { prisma } from "../lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { deductInventory, restoreInventory } from "./inventory.service";
import { revalidatePath } from "next/cache";

export interface CreateOrderItemInput {
  productId?: string | null;
  productSlug: string;
  productName: string;
  variantLabel?: string | null;
  price: number;
  quantity: number;
  image: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingMethod: "DELIVERY" | "STORE_PICKUP";
  shippingFee: number;
  address?: string | null;
  note?: string | null;
  totalAmount: number;
  items: CreateOrderItemInput[];
  userId?: string | null;
}

export function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DK-${timestamp}-${random}`;
}

export async function createOrder(dto: CreateOrderInput) {
  const customerName = dto.customerName?.trim();
  const customerPhone = dto.customerPhone?.trim();

  if (!customerName) throw new Error("Vui lòng nhập họ và tên người nhận hàng.");
  if (!customerPhone) throw new Error("Vui lòng nhập số điện thoại người nhận hàng.");
  if (!dto.items || dto.items.length === 0) throw new Error("Giỏ hàng của bạn đang trống.");

  const shippingMethod = dto.shippingMethod || "STORE_PICKUP";
  const address = dto.address?.trim() || "";
  if (shippingMethod === "DELIVERY" && !address) {
    throw new Error("Vui lòng cung cấp địa chỉ nhận hàng.");
  }

  const calculatedItemsTotal = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === "DELIVERY" ? (Number(dto.shippingFee) || 0) : 0;
  const totalAmount = Math.max(0, calculatedItemsTotal + shippingFee);
  const orderCode = generateOrderCode();

  const order = await (prisma.order.create as any)({
    data: {
      orderCode,
      customerName,
      customerPhone,
      customerEmail: dto.customerEmail?.trim() || null,
      shippingMethod,
      shippingFee,
      address: shippingMethod === "DELIVERY" ? address : null,
      note: dto.note?.trim() || null,
      totalAmount,
      status: "PENDING" as OrderStatus,
      userId: dto.userId || null,
      items: {
        create: dto.items.map((item) => ({
          productId: item.productId || null,
          productSlug: item.productSlug,
          productName: item.productName,
          variantLabel: item.variantLabel || null,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  if (dto.userId) {
    revalidatePath("/tai-khoan/don-hang");
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const currentOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!currentOrder) throw new Error("Không tìm thấy đơn hàng.");

  const allowedNextStatuses: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["COMPLETED", "CANCELLED"],
  };

  if (!allowedNextStatuses[currentOrder.status]?.includes(status)) {
    throw new Error("Chỉ có thể chuyển đơn hàng sang trạng thái tiếp theo hợp lệ.");
  }

  const updated = await prisma.order.updateMany({
    where: { id: orderId, status: currentOrder.status },
    data: { status },
  });

  if (updated.count !== 1) {
    throw new Error("Trạng thái đơn hàng vừa thay đổi. Vui lòng tải lại trang.");
  }

  // 1. If transitioning from PENDING -> CONFIRMED / SHIPPING / COMPLETED: Deduct stock
  if (
    currentOrder.status === "PENDING" &&
    (status === "CONFIRMED" || status === "SHIPPING" || status === "COMPLETED")
  ) {
    await deductInventory(
      currentOrder.items.map((i) => ({
        productId: i.productId,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
      }))
    );
  }

  // 2. If transitioning from CONFIRMED / SHIPPING / COMPLETED -> CANCELLED: Restore stock
  if (
    (currentOrder.status === "CONFIRMED" ||
      currentOrder.status === "SHIPPING" ||
      currentOrder.status === "COMPLETED") &&
    status === "CANCELLED"
  ) {
    await restoreInventory(
      currentOrder.items.map((i) => ({
        productId: i.productId,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
      }))
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  if (currentOrder.userId) {
    revalidatePath("/tai-khoan/don-hang");
  }

  return true;
}

export async function getOrderByCode(orderCode: string) {
  const order = await prisma.order.findUnique({
    where: { orderCode: orderCode.trim().toUpperCase() },
    include: { items: true },
  });

  if (!order) return null;

  return {
    ...order,
    shippingFee: (order as any).shippingFee ?? 0,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    ...o,
    shippingFee: (o as any).shippingFee ?? 0,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));
}
