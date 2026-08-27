import { prisma } from "../lib/prisma";
import { revalidateTag } from "next/cache";
import { invalidateMemoryCache } from "../lib/cachedData";

export interface InventoryItem {
  productId?: string | null;
  variantLabel?: string | null;
  quantity: number;
}

/**
 * Deducts stock from Product and ProductVariant (ensuring stock does not drop below 0).
 */
export async function deductInventory(items: InventoryItem[]): Promise<void> {
  for (const item of items) {
    if (!item.productId || item.quantity <= 0) continue;

    try {
      // 1. Deduct from main Product stock
      await prisma.$executeRawUnsafe(
        `UPDATE "Product" SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
        item.quantity,
        item.productId
      );

      // 2. Deduct from ProductVariant stock if a variant was selected
      if (item.variantLabel) {
        await prisma.$executeRawUnsafe(
          `UPDATE "ProductVariant" SET stock = GREATEST(0, COALESCE(stock, 100) - $1) WHERE "productId" = $2 AND label = $3`,
          item.quantity,
          item.productId,
          item.variantLabel
        );
      }
    } catch (err) {
      console.warn(`[InventoryService] Error deducting stock for product ${item.productId}:`, err);
    }
  }

  // Invalidate product caches
  invalidateMemoryCache(["products"]);
  try {
    revalidateTag("products");
  } catch {}
}

/**
 * Restores stock back to Product and ProductVariant (e.g. when an order is cancelled).
 */
export async function restoreInventory(items: InventoryItem[]): Promise<void> {
  for (const item of items) {
    if (!item.productId || item.quantity <= 0) continue;

    try {
      // 1. Restore main Product stock
      await prisma.$executeRawUnsafe(
        `UPDATE "Product" SET stock = stock + $1 WHERE id = $2`,
        item.quantity,
        item.productId
      );

      // 2. Restore ProductVariant stock if a variant was selected
      if (item.variantLabel) {
        await prisma.$executeRawUnsafe(
          `UPDATE "ProductVariant" SET stock = COALESCE(stock, 100) + $1 WHERE "productId" = $2 AND label = $3`,
          item.quantity,
          item.productId,
          item.variantLabel
        );
      }
    } catch (err) {
      console.warn(`[InventoryService] Error restoring stock for product ${item.productId}:`, err);
    }
  }

  // Invalidate product caches
  invalidateMemoryCache(["products"]);
  try {
    revalidateTag("products");
  } catch {}
}

/**
 * Retrieves products and variants that have low stock (<= threshold, default 5).
 */
export async function getLowStockProducts(threshold = 5) {
  return prisma.product.findMany({
    where: {
      stock: { lte: threshold },
      active: true,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { select: { id: true, label: true, stock: true, sku: true, barcode: true } },
    },
    orderBy: { stock: "asc" },
  });
}
