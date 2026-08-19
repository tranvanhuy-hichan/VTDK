import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { ProductDetailView } from "@/components/ProductDetailView";
import { ProductDetailHeader } from "@/components/ProductDetailHeader";
import { ProductCard } from "@/components/ProductCard";
import { SITE_URL } from "@/lib/site";

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  const company = await getCompanyInfo();
  const description =
    product.shortDesc ?? `Xem thông tin chi tiết và giá sỉ & lẻ ${product.name} tại Vật Tư Điện Lạnh ${company.name} (${company.address}). Hotline: ${company.hotline}.`;

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

  // Fetch max 4 related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    take: 4,
  });

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc ?? `Sản phẩm ${product.name} chính hãng tại ${company.name}`,
    image: [product.image, ...product.images],
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: company.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price > 0 ? product.price : undefined,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/san-pham/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: company.name,
      },
    },
  };

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-8 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1.5 sm:space-y-2">
        
        {/* Pure Text Breadcrumb Line with Back Button */}
        <ProductDetailHeader
          productName={product.name}
          categoryName={product.category.name}
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
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
    </section>
  );
}
