import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    const categoryRoutes = [
      "/vat-tu-dien-lanh",
      ...categories.map((c) => `/${c.slug}`),
    ];

    const uniqueCategoryRoutes = Array.from(new Set(categoryRoutes));

    return [
      {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}/san-pham`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/giai-phap`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/lien-he`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      ...uniqueCategoryRoutes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
      ...products.map((product) => ({
        url: `${SITE_URL}/san-pham/${product.slug}`,
        lastModified: product.updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    console.warn("sitemap generation db query fallback:", err);
    return [
      {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}/san-pham`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/giai-phap`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/lien-he`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ];
  }
}
