"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { getCurrentUser, getCurrentAdmin } from "../lib/auth";
import type { CreateOrderDTO, OrderDetail, OrderStatus } from "../types/order";

function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DK-${timestamp}-${random}`;
}

export async function createOrderAction(dto: CreateOrderDTO): Promise<{
  success: boolean;
  orderCode?: string;
  orderId?: string;
  error?: string;
}> {
  try {
    const customerName = dto.customerName?.trim();
    const customerPhone = dto.customerPhone?.trim();
    const shippingMethod = dto.shippingMethod || "DELIVERY";
    const address = dto.address?.trim();
    const note = dto.note?.trim();

    if (!customerName || !customerPhone) {
      return { success: false, error: "Vui lòng nhập họ tên và số điện thoại nhận hàng." };
    }

    if (shippingMethod === "DELIVERY" && !address) {
      return { success: false, error: "Vui lòng nhập địa chỉ nhận hàng đối với hình thức giao hàng tận nơi." };
    }

    if (!dto.items || dto.items.length === 0) {
      return { success: false, error: "Giỏ hàng của bạn đang trống." };
    }

    // Check logged in user
    const currentUser = await getCurrentUser();

    // Admin cannot place orders
    if (currentUser && currentUser.role === "ADMIN") {
      return {
        success: false,
        error: "Tài khoản Quản trị viên (Admin) chỉ có quyền xem và quản trị hệ thống, không thể thực hiện đặt hàng.",
      };
    }

    // Auto save/update address and phone to user profile if logged in and shipping is DELIVERY

    if (currentUser) {
      try {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: {
            phone: customerPhone,
            ...(shippingMethod === "DELIVERY" && address ? { address } : {}),
          },
        });
      } catch {}
    }

    const totalAmount = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderCode = generateOrderCode();

    const order = await prisma.order.create({
      data: {
        orderCode,
        userId: currentUser?.id || null,
        customerName,
        customerPhone,
        customerEmail: dto.customerEmail?.trim() || currentUser?.email || null,
        shippingMethod,
        address: shippingMethod === "DELIVERY" ? address : null,
        note: note || null,
        totalAmount,
        status: "PENDING",
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
      include: {
        items: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/tai-khoan/don-hang");

    return {
      success: true,
      orderCode: order.orderCode,
      orderId: order.id,
    };
  } catch (err: unknown) {
    console.error("createOrderAction error:", err);
    return { success: false, error: "Không thể tạo đơn hàng. Vui lòng thử lại." };
  }
}

export async function getOrderByCodeAction(orderCode: string): Promise<OrderDetail | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: true,
      },
    });

    if (!order) return null;

    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  } catch (err) {
    console.error("getOrderByCodeAction error:", err);
    return null;
  }
}

export async function getMyOrdersAction(): Promise<OrderDetail[]> {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("getMyOrdersAction error:", err);
    return [];
  }
}

// Admin: Get all orders with filtering
export async function adminGetOrdersAction(params?: {
  status?: string;
  query?: string;
}): Promise<OrderDetail[]> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    const whereClause: Record<string, unknown> = {};

    if (params?.status && params.status !== "ALL") {
      whereClause.status = params.status as OrderStatus;
    }

    if (params?.query?.trim()) {
      const q = params.query.trim();
      whereClause.OR = [
        { orderCode: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("adminGetOrdersAction error:", err);
    return [];
  }
}

// Admin: Update order status
export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Bạn không có quyền quản trị viên." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin");
    revalidatePath("/tai-khoan/don-hang");
    return { success: true };
  } catch (err) {
    console.error("adminUpdateOrderStatusAction error:", err);
    return { success: false, error: "Không thể cập nhật trạng thái đơn hàng." };
  }
}
