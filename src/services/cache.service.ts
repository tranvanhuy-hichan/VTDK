import { revalidatePath, revalidateTag } from "next/cache";
import { invalidateMemoryCache } from "../lib/cachedData";

export type CacheDomain =
  | "products"
  | "categories"
  | "services"
  | "gallery"
  | "company-info"
  | "theme"
  | "orders";

export function revalidateDomain(domains: CacheDomain[]): void {
  // 1. Invalidate Next.js static paths
  revalidatePath("/", "layout");
  if (domains.includes("products") || domains.includes("categories")) {
    revalidatePath("/san-pham");
    revalidatePath("/admin/products");
  }
  if (domains.includes("services")) {
    revalidatePath("/giai-phap");
    revalidatePath("/admin/services");
  }
  if (domains.includes("gallery")) {
    revalidatePath("/admin/gallery");
  }
  if (domains.includes("company-info") || domains.includes("theme")) {
    revalidatePath("/admin/settings");
  }
  if (domains.includes("orders")) {
    revalidatePath("/admin/orders");
    revalidatePath("/tai-khoan/don-hang");
  }

  // 2. Invalidate in-memory server cache
  invalidateMemoryCache(domains);

  // 3. Invalidate Next.js cache tags
  for (const tag of domains) {
    try {
      revalidateTag(tag);
    } catch {}
  }
}
