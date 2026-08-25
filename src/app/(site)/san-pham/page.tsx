import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "../../../lib/company";
import { getCachedCategories, getCachedActiveProducts } from "../../../lib/cachedData";
import { SITE_URL } from "../../../lib/site";
import { AllProductsCatalog } from "../../../components/product/AllProductsCatalog";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = "Tất Cả Sản Phẩm Vật Tư Điện Lạnh Chính Hãng Đà Nẵng";
  const description = `Danh mục sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt chính hãng giá tốt tại ${company.name}. Hotline/Zalo: ${company.hotline}.`;

  const rawImage = company.image || "/images/storefront.png";
  const shareImage = rawImage.startsWith("http")
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    title,
    description,
    keywords: [
      "danh mục vật tư điện lạnh",
      "ống đồng điều hòa Đà Nẵng",
      "gas lạnh R32 R410A giá sỉ",
      "linh kiện điều hòa tủ lạnh máy giặt",
      "đại lý vật tư điện lạnh Đông Kha",
    ],
    alternates: {
      canonical: `${SITE_URL}/san-pham`,
    },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: `${SITE_URL}/san-pham`,
      siteName: company.name,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${company.name}`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${company.name}`,
      description,
      images: [shareImage],
    },
  };
}

export default async function ProductsCatalogPage() {
  const [categories, products, company] = await Promise.all([
    getCachedCategories(),
    getCachedActiveProducts(),
    getCompanyInfo(),
  ]);

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tất Cả Sản Phẩm Vật Tư Điện Lạnh Chính Hãng Đà Nẵng",
    description: `Danh mục sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt chính hãng giá tốt tại ${company.name}.`,
    url: `${SITE_URL}/san-pham`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 30).map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/san-pham/${prod.slug}`,
        name: prod.name,
        image: prod.image,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${SITE_URL}/san-pham` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AllProductsCatalog
        categories={categories}
        products={products}
        company={company}
      />
    </>
  );
}
