import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { ProductDetailView } from "@/components/ProductDetailView";

const SITE_URL = "https://vattudongkha.tranvanhuy.io.vn";

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

  const description =
    product.shortDesc ?? `Xem thông tin và giá ${product.name} tại Vật Tư Điện Lạnh Đông Kha.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/san-pham/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      url: `${SITE_URL}/san-pham/${product.slug}`,
      images: [product.image],
      type: "website",
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc ?? undefined,
    image: [product.image, ...product.images],
    category: product.category.name,
    offers: {
      "@type": "Offer",
      price: product.price > 0 ? product.price : undefined,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/san-pham/${product.slug}`,
    },
  };

  return (
    <section className="py-10 sm:py-16 bg-[#F6F8FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-6">
          <Link href="/" className="hover:text-[#075FA8] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#san-pham" className="hover:text-[#075FA8] transition-colors">
            Sản phẩm
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-bold truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8">
          <ProductDetailView product={product} company={company} />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </section>
  );
}
