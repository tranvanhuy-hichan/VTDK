import { prisma } from "../lib/prisma";
import { deductInventory } from "./inventory.service";
import { revalidatePath } from "next/cache";

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
  cartItemId?: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantLabel?: string | null;
  productSlug: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
  barcode?: string | null;
  sku?: string | null;
}

export interface CreatePosOrderPayload {
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: "CASH" | "VIETQR" | "CARD" | "OTHER" | "BANK_TRANSFER" | "QR_CODE";
  cashReceived?: number;
  cashChange?: number;
  discountAmount?: number;
  items: PosCartItem[];
  totalAmount?: number;
  note?: string;
}

export async function searchPosProducts(query?: string): Promise<{
  exactBarcodeMatch?: PosProductItem;
  products?: PosProductItem[];
}> {
  const q = query?.trim();

  // 1. Exact Barcode Match
  if (q) {
    const exactBarcode = await prisma.product.findFirst({
      where: { barcode: q, active: true },
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true, label: true, price: true } },
      },
    });

    if (exactBarcode) {
      return {
        exactBarcodeMatch: {
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
        },
      };
    }

    // Check variant exact barcode
    try {
      const exactVariant = await prisma.productVariant.findFirst({
        where: { barcode: q },
        include: {
          product: {
            include: {
              category: { select: { name: true } },
            },
          },
        },
      });

      if (exactVariant && exactVariant.product && exactVariant.product.active) {
        const p = exactVariant.product;
        return {
          exactBarcodeMatch: {
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
          },
        };
      }
    } catch {}
  }

  // 2. Search by Name, SKU, or Barcode contains
  const products = await prisma.product.findMany({
    where: q
      ? {
          active: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { barcode: { contains: q } },
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

  const formatted: PosProductItem[] = products.map((p) => ({
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
}

export async function createPosOrder(payload: CreatePosOrderPayload) {
  if (!payload.items || payload.items.length === 0) {
    throw new Error("Giỏ hàng tại quầy trống! Vui lòng chọn ít nhất 1 sản phẩm.");
  }

  const calculatedItemsTotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = payload.discountAmount || 0;
  const totalAmount = Math.max(0, (payload.totalAmount || calculatedItemsTotal) - discount);

  // Generate unique POS order code (e.g. POS-2603-A89F)
  const dateSegment = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderCode = `POS-${dateSegment}-${randomSuffix}`;

  const orderData = {
    orderCode,
    customerName: payload.customerName?.trim() || "Khách mua tại quầy",
    customerPhone: payload.customerPhone?.trim() || "0900000000",
    customerEmail: null,
    shippingMethod: "STORE_PICKUP" as const,
    shippingFee: 0,
    address: "Mua & thanh toán trực tiếp tại quầy",
    note: payload.note ? `[POS Đơn Quầy] ${payload.note.trim()}` : "[POS Đơn Quầy]",
    totalAmount,
    status: "COMPLETED" as const,
    orderSource: "POS",
    paymentMethod: payload.paymentMethod || "CASH",
    cashReceived: payload.cashReceived || totalAmount,
    cashChange: payload.cashChange || 0,
    items: {
      create: payload.items.map((item) => ({
        productId: item.productId || null,
        productSlug: item.productSlug,
        productName: item.productName,
        variantLabel: item.variantLabel || null,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    },
  };

  let createdOrder: any;
  try {
    createdOrder = await (prisma.order as any).create({
      data: orderData,
      include: { items: true },
    });
  } catch {
    const { orderSource, paymentMethod, cashReceived, cashChange, ...restOrderData } = orderData;
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

  // Deduct inventory via centralized service
  await deductInventory(
    payload.items.map((item) => ({
      productId: item.productId,
      variantLabel: item.variantLabel,
      quantity: item.quantity,
    }))
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");

  return {
    order: {
      ...createdOrder,
      shippingFee: createdOrder.shippingFee ?? 0,
      createdAt: createdOrder.createdAt.toISOString(),
      updatedAt: createdOrder.updatedAt.toISOString(),
    },
    orderCode: createdOrder.orderCode,
    orderId: createdOrder.id,
    totalAmount: createdOrder.totalAmount,
    createdAt: createdOrder.createdAt.toISOString(),
  };
}
