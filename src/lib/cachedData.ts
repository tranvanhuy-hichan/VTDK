import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Cached database queries with ISR tags.
 * Serves in 0-5ms from server memory/cache instead of performing remote DB round-trips.
 */

export const getCachedCategories = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    } catch (e) {
      console.warn("getCachedCategories DB error, fallback to empty array:", e);
      return [];
    }
  },
  ["all-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedActiveProducts = unstable_cache(
  async () => {
    try {
      return await prisma.product.findMany({
        where: { active: true },
        include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("getCachedActiveProducts DB error, fallback to empty array:", e);
      return [];
    }
  },
  ["all-active-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedServices = unstable_cache(
  async () => {
    try {
      return await prisma.service.findMany({
        orderBy: { sortOrder: "asc" },
      });
    } catch (e) {
      console.warn("getCachedServices DB error, fallback to empty array:", e);
      return [];
    }
  },
  ["all-services"],
  { revalidate: 3600, tags: ["services"] }
);

export const getCachedGalleryImages = unstable_cache(
  async () => {
    try {
      return await prisma.galleryImage.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    } catch (e) {
      console.warn("getCachedGalleryImages DB error, fallback to empty array:", e);
      return [];
    }
  },
  ["all-gallery-images"],
  { revalidate: 3600, tags: ["gallery"] }
);
