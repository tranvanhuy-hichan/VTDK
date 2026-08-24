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
    if (currentUser && currentUser.role === "CUSTOMER") {
      try {
        const updateData: { phone?: string; address?: string } = {};
        if (!currentUser.phone && customerPhone) {
          updateData.phone = customerPhone;
        }
        if (!currentUser.address && address && shippingMethod === "DELIVERY") {
          updateData.address = address;
        }
        if (Object.keys(updateData).length > 0) {
          await prisma.user.update({
            where: { id: currentUser.id },
            data: updateData,
          });
        }
      } catch (err) {
        console.warn("Could not auto-update user profile info:", err);
      }
    }

    // Calculate total
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );

    const orderCode = generateOrderCode();

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        shippingMethod,
        address: shippingMethod === "DELIVERY" ? address : null,
        note: note || null,
        totalAmount,
        status: "PENDING",
        userId: currentUser?.id || null,
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
    if (currentUser) {
      revalidatePath("/tai-khoan/don-hang");
    }

    return {
      success: true,
      orderCode: order.orderCode,
      orderId: order.id,
    };
  } catch (err) {
    console.error("createOrderAction error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.",
    };
  }
}

// User / Guest: Get order by code
export async function getOrderByCodeAction(orderCode: string): Promise<OrderDetail | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { items: true },
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

// Customer: Get my orders
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

// Admin: Get all orders with filter
export async function adminGetOrdersAction(statusFilter?: string): Promise<OrderDetail[]> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return [];

    const whereClause: { status?: OrderStatus } = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter as OrderStatus;
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

// Admin: Check new orders & pending count for real-time notification center
export async function adminCheckNewOrdersAction(): Promise<{
  success: boolean;
  pendingCount: number;
  totalCount: number;
  latestOrder?: {
    id: string;
    orderCode: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    createdAt: string;
  } | null;
  recentOrders?: Array<{
    id: string;
    orderCode: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
  }>;
}> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, pendingCount: 0, totalCount: 0, recentOrders: [] };
    }

    const [pendingCount, totalCount, recentList] = await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderCode: true,
          customerName: true,
          customerPhone: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const formattedRecent = recentList.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    }));

    return {
      success: true,
      pendingCount,
      totalCount,
      latestOrder: formattedRecent[0] || null,
      recentOrders: formattedRecent,
    };
  } catch (err) {
    console.error("adminCheckNewOrdersAction error:", err);
    return { success: false, pendingCount: 0, totalCount: 0, recentOrders: [] };
  }
}
