import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Cached database queries with ISR tags.
 * Serves in 0-5ms from server memory/cache instead of performing remote DB round-trips.
 */

export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["all-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedActiveProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { active: true },
      include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  },
  ["all-active-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
  },
  ["all-services"],
  { revalidate: 3600, tags: ["services"] }
);

export const getCachedGalleryImages = unstable_cache(
  async () => {
    return prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["all-gallery-images"],
  { revalidate: 3600, tags: ["gallery"] }
);
