"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "../lib/prisma";
import { isAdminAuthenticated } from "./adminActions";
import { getCompanyInfo } from "../lib/company";

export interface PosProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  sku: string | null;
  barcode: string | null;
  stock: number;
  image: string;
  categoryName: string;
  variants: {
    id: string;
    label: string;
    price: number;
  }[];
}

export interface PosCartItem {
  productId: string;
  productSlug: string;
  productName: string;
  variantLabel?: string | null;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  sku?: string | null;
  barcode?: string | null;
}

export interface CreatePosOrderPayload {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod: "CASH" | "VIETQR" | "CARD" | "OTHER";
  cashReceived?: number;
  cashChange?: number;
  discountAmount?: number;
  note?: string;
  items: PosCartItem[];
}

/**
 * Search Products for POS Terminal (By Barcode, SKU, Name)
 */
export async function searchPosProductsAction(query: string = ""): Promise<{
  products?: PosProductItem[];
  exactBarcodeMatch?: PosProductItem;
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập quyền quản trị!" };

  try {
    const q = query.trim();

    // 1. If searching by exact Barcode (Product or Variant)
    if (q) {
      const exactBarcode: any = await (prisma.product as any).findFirst({
        where: {
          barcode: q,
          active: true,
        },
        include: {
          category: { select: { name: true } },
          variants: { select: { id: true, label: true, price: true, sku: true, barcode: true, stock: true } },
        },
      });

      if (exactBarcode) {
        const item: PosProductItem = {
          id: exactBarcode.id,
          name: exactBarcode.name,
          slug: exactBarcode.slug,
          price: exactBarcode.price,
          sku: exactBarcode.sku || null,
          barcode: exactBarcode.barcode || null,
          stock: exactBarcode.stock ?? 100,
          image: exactBarcode.image || "/images/placeholder.svg",
          categoryName: exactBarcode.category?.name || "Khác",
          variants: exactBarcode.variants || [],
        };
        return { exactBarcodeMatch: item };
      }

      // Check variant exact barcode
      try {
        const exactVariant: any = await (prisma.productVariant as any).findFirst({
          where: { barcode: q },
          include: {
            product: {
              include: {
                category: { select: { name: true } },
                variants: { select: { id: true, label: true, price: true, sku: true, barcode: true, stock: true } },
              },
            },
          },
        });

        if (exactVariant && exactVariant.product && exactVariant.product.active) {
          const p = exactVariant.product;
          const item: PosProductItem = {
            id: p.id,
            name: `${p.name} - ${exactVariant.label}`,
            slug: p.slug,
            price: exactVariant.price,
            sku: exactVariant.sku || p.sku || null,
            barcode: exactVariant.barcode || p.barcode || null,
            stock: exactVariant.stock ?? p.stock ?? 100,
            image: p.image || "/images/placeholder.svg",
            categoryName: p.category?.name || "Khác",
            variants: [
              {
                id: exactVariant.id,
                label: exactVariant.label,
                price: exactVariant.price,
              },
            ],
          };
          return { exactBarcodeMatch: item };
        }
      } catch {}
    }

    // 2. Search by Name, SKU, or Barcode contains
    const products: any[] = await (prisma.product as any).findMany({
      where: q
        ? {
            active: true,
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { barcode: { contains: q, mode: "insensitive" } },
            ],
          }
        : { active: true },
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true, label: true, price: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 40,
    });

    const formatted: PosProductItem[] = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      sku: p.sku || null,
      barcode: p.barcode || null,
      stock: p.stock ?? 100,
      image: p.image || "/images/placeholder.svg",
      categoryName: p.category?.name || "Khác",
      variants: p.variants || [],
    }));

    return { products: formatted };
  } catch (err: any) {
    return { error: err.message || "Lỗi tra cứu sản phẩm POS!" };
  }
}

/**
 * Create a POS Counter Order (Bán Hàng Tại Quầy)
 */
export async function createPosOrderAction(payload: CreatePosOrderPayload) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập quyền quản trị!" };

  try {
    if (!payload.items || payload.items.length === 0) {
      return { error: "Giỏ hàng tại quầy trống! Vui lòng chọn ít nhất 1 sản phẩm." };
    }

    const subtotal = payload.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discount = Math.max(0, payload.discountAmount || 0);
    const totalAmount = Math.max(0, subtotal - discount);

    // Generate Order Code: POS-YYMMDD-XXXX
    const now = new Date();
    const datePart = now
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, ""); // e.g. 260826
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `POS-${datePart}-${randomSuffix}`;

    const customerName = payload.customerName?.trim() || "Khách mua lẻ tại quầy";
    const customerPhone = payload.customerPhone?.trim() || "0900000000";
    const customerEmail = payload.customerEmail?.trim() || null;

    const company = await getCompanyInfo();

    // 1. Create Order record with status COMPLETED and orderSource POS
    const orderData: any = {
      orderCode,
      orderSource: "POS",
      paymentMethod: payload.paymentMethod || "CASH",
      cashReceived: payload.cashReceived || totalAmount,
      cashChange: payload.cashChange || 0,
      customerName,
      customerPhone,
      customerEmail,
      shippingMethod: "STORE_PICKUP",
      shippingFee: 0,
      address: company.address || "Mua trực tiếp tại cửa hàng",
      note: payload.note ? `[BÁN TẠI QUẦY] ${payload.note}` : "[BÁN TẠI QUẦY] Khách mua trực tiếp",
      totalAmount,
      status: "COMPLETED",
      items: {
        create: payload.items.map((item) => ({
          productId: item.productId || null,
          productSlug: item.productSlug,
          productName: item.productName,
          variantLabel: item.variantLabel || null,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/images/placeholder.svg",
        })),
      },
    };

    let createdOrder: any;
    try {
      createdOrder = await (prisma.order as any).create({
        data: orderData,
        include: { items: true },
      });
    } catch (orderErr: any) {
      // Fallback if in-memory Prisma client schema validator doesn't recognize orderSource yet
      const { orderSource: os, paymentMethod: pm, cashReceived: cr, cashChange: cc, ...restOrderData } = orderData;
      createdOrder = await prisma.order.create({
        data: restOrderData,
        include: { items: true },
      });
      await prisma.$executeRawUnsafe(
        `UPDATE "Order" SET "orderSource" = 'POS', "paymentMethod" = $1, "cashReceived" = $2, "cashChange" = $3 WHERE id = $4`,
        payload.paymentMethod || "CASH",
        payload.cashReceived || totalAmount,
        payload.cashChange || 0,
        createdOrder.id
      );
    }

    // 2. Auto-subtract inventory stock
    for (const item of payload.items) {
      if (item.productId) {
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE "Product" SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
            item.quantity,
            item.productId
          );
        } catch (stockErr) {
          console.warn(`Failed to subtract stock for product ${item.productId}:`, stockErr);
        }
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/pos");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
    revalidatePath("/san-pham");
    try {
      revalidateTag("products");
      revalidateTag("orders");
      revalidateTag("company-info");
    } catch {}

    return {
      success: true,
      order: {
        id: createdOrder.id,
        orderCode,
        createdAt: now.toISOString(),
        customerName,
        customerPhone,
        totalAmount,
        subtotal,
        discountAmount: discount,
        paymentMethod: payload.paymentMethod,
        cashReceived: payload.cashReceived || totalAmount,
        cashChange: payload.cashChange || 0,
        items: payload.items,
        company: {
          brandName: company.brandName,
          fullName: company.fullName,
          address: company.address,
          hotline: company.hotline,
          taxCode: company.taxCode,
          logoUrl: company.logoUrl,
        },
      },
    };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi tạo đơn hàng POS tại quầy!" };
  }
}
