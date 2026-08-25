import { MetadataRoute } from "next";
import { COMPANY_DATA } from "@/data/company";
import {
  getCachedActiveProducts,
  getCachedCategories,
} from "@/lib/cachedData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    COMPANY_DATA.siteUrl ||
    "https://vattudongkha.io.vn";

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getCachedActiveProducts(),
      getCachedCategories(),
    ]);
    products = fetchedProducts;
    categories = fetchedCategories;
  } catch (error) {
    console.warn("sitemap generation: Database unavailable during build, falling back to static routes:", error);
  }

  // Static core routes
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/giai-phap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Product detail pages
  const productPages: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/san-pham/${prod.slug}`,
    lastModified: prod.updatedAt || prod.createdAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
