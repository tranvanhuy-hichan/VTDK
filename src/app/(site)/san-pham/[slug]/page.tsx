import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductDetailHeader } from "@/components/product/ProductDetailHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // 1 hour ISR, revalidated on-demand via Server Actions

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

const getProduct = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
});

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  const company = await getCompanyInfo();
  const description =
    product.shortDesc ?? `Giá sỉ & lẻ ${product.name} chính hãng tại ${company.name}. Hàng sẵn kho, hotline ${company.hotline}.`.slice(0, 160);

  return {
    title: `${product.name} | Giá Sỉ & Lẻ`,
    description,
    keywords: [
      product.name,
      `${product.name} Đà Nẵng`,
      product.category.name,
      `giá ${product.name}`,
      "vật tư điện lạnh Đà Nẵng",
    ],
    alternates: {
      canonical: `/san-pham/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - ${company.name}`,
      description,
      url: `${SITE_URL}/san-pham/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${company.name}`,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const company = await getCompanyInfo();

  // Fetch max 5 related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    take: 5,
  });

  // Calculate variant prices for schema
  const variantPrices = product.variants.map((v) => v.price).filter((p) => p > 0);
  const allPrices = variantPrices.length > 0 ? variantPrices : (product.price > 0 ? [product.price] : []);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  const offersSchema =
    allPrices.length > 1
      ? {
          "@type": "AggregateOffer",
          lowPrice: minPrice,
          highPrice: maxPrice,
          priceCurrency: "VND",
          offerCount: allPrices.length,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: "2027-12-31",
          url: `${SITE_URL}/san-pham/${product.slug}`,
          seller: {
            "@type": "Organization",
            name: company.name,
          },
        }
      : minPrice > 0
      ? {
          "@type": "Offer",
          price: minPrice,
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: "2027-12-31",
          url: `${SITE_URL}/san-pham/${product.slug}`,
          seller: {
            "@type": "Organization",
            name: company.name,
          },
        }
      : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc ?? `Sản phẩm ${product.name} chính hãng tại ${company.name}`,
    image: [product.image, ...product.images],
    category: product.category.name,
    sku: product.id,
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: "Đông Kha",
    },
    ...(offersSchema && { offers: offersSchema }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${SITE_URL}/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/san-pham/${product.slug}`,
      },
    ],
  };

  return (
    <section className="pt-0 pb-8 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pure Text Breadcrumb Line with Back Button */}
        <ProductDetailHeader
          productName={product.name}
          categoryName={product.category.name}
          categorySlug={product.category.slug}
        />

        {/* Main Product Showcase Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md p-4 sm:p-8 lg:p-10">
          <ProductDetailView product={product} company={company} />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-4 sm:pt-6 text-left">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Sản Phẩm Cùng Danh Mục ({product.category.name})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} company={company} />
              ))}
            </div>
          </div>
        )}

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </section>
  );
}
