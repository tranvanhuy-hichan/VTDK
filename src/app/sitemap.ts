import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { COMPANY_DATA } from "@/data/company";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}/san-pham`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      ...uniqueCategoryRoutes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
      ...products.map((product) => ({
        url: `${SITE_URL}/san-pham/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    console.warn("sitemap generation db query fallback:", err);
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}/san-pham`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];
  }
}
