import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Global In-Memory Fallback Cache to survive transient DB connection pool disconnects & serverless cold-starts.
 */
interface GlobalMemoryCache {
  categories?: any[];
  products?: any[];
  services?: any[];
  galleryImages?: any[];
}

const globalForCache = globalThis as unknown as {
  __appMemoryBackup?: GlobalMemoryCache;
};

if (!globalForCache.__appMemoryBackup) {
  globalForCache.__appMemoryBackup = {};
}

export const memoryBackup = globalForCache.__appMemoryBackup;

export function invalidateMemoryCache(tags?: string[]) {
  if (!tags || tags.length === 0) {
    globalForCache.__appMemoryBackup = {};
    return;
  }
  for (const tag of tags) {
    if (tag === "categories") delete memoryBackup.categories;
    if (tag === "products") delete memoryBackup.products;
    if (tag === "services") delete memoryBackup.services;
    if (tag === "gallery") delete memoryBackup.galleryImages;
  }
}

/**
 * Helper to retry transient DB errors (e.g. pool wakeup, SSL handshake timeout) before failing
 */
async function retryQuery<T>(fn: () => Promise<T>, retries = 2, delayMs = 200): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Cached database queries with ISR tags & multi-layer memory resilience.
 * Serves in 0-5ms from server cache instead of performing remote DB round-trips.
 */

export const getCachedCategories = unstable_cache(
  async () => {
    try {
      const data = await retryQuery(() =>
        prisma.category.findMany({
          orderBy: { name: "asc" },
        })
      );
      if (Array.isArray(data) && data.length > 0) {
        memoryBackup.categories = data;
      }
      return data;
    } catch (e) {
      console.warn("getCachedCategories DB error:", e);
      if (memoryBackup.categories && memoryBackup.categories.length > 0) {
        console.info("Serving categories from memory backup fallback.");
        return memoryBackup.categories;
      }
      // Re-throw so unstable_cache retains previous valid stale cache instead of caching []
      throw e;
    }
  },
  ["all-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedActiveProducts = unstable_cache(
  async () => {
    try {
      const data = await retryQuery(() =>
        prisma.product.findMany({
          where: { active: true },
          include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
          orderBy: { createdAt: "desc" },
        })
      );
      if (Array.isArray(data) && data.length > 0) {
        memoryBackup.products = data;
      }
      return data;
    } catch (e) {
      console.warn("getCachedActiveProducts DB error:", e);
      if (memoryBackup.products && memoryBackup.products.length > 0) {
        console.info("Serving products from memory backup fallback.");
        return memoryBackup.products;
      }
      // Re-throw so unstable_cache retains previous valid stale cache instead of caching []
      throw e;
    }
  },
  ["all-active-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedServices = unstable_cache(
  async () => {
    try {
      const data = await retryQuery(() =>
        prisma.service.findMany({
          orderBy: { sortOrder: "asc" },
        })
      );
      if (Array.isArray(data) && data.length > 0) {
        memoryBackup.services = data;
      }
      return data;
    } catch (e) {
      console.warn("getCachedServices DB error:", e);
      if (memoryBackup.services && memoryBackup.services.length > 0) {
        console.info("Serving services from memory backup fallback.");
        return memoryBackup.services;
      }
      throw e;
    }
  },
  ["all-services"],
  { revalidate: 3600, tags: ["services"] }
);

export const getCachedGalleryImages = unstable_cache(
  async () => {
    try {
      const data = await retryQuery(() =>
        prisma.galleryImage.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        })
      );
      if (Array.isArray(data) && data.length > 0) {
        memoryBackup.galleryImages = data;
      }
      return data;
    } catch (e) {
      console.warn("getCachedGalleryImages DB error:", e);
      if (memoryBackup.galleryImages && memoryBackup.galleryImages.length > 0) {
        console.info("Serving gallery images from memory backup fallback.");
        return memoryBackup.galleryImages;
      }
      throw e;
    }
  },
  ["all-gallery-images"],
  { revalidate: 3600, tags: ["gallery"] }
);
