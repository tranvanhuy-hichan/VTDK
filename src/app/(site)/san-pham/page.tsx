import React from "react";
import type { Metadata } from "next";
import { prisma } from "../../../lib/prisma";
import { getCompanyInfo } from "../../../lib/company";
import { AllProductsCatalog } from "../../../components/AllProductsCatalog";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = "Tất Cả Sản Phẩm Vật Tư Điện Lạnh Chính Hãng Đà Nẵng";
  const description = `Danh mục sỉ & lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt giá sỉ tốt nhất tại ${company.name} (${company.address}). Hotline/Zalo: ${company.hotline}.`;

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
      canonical: "/san-pham",
    },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: "/san-pham",
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function ProductsCatalogPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const company = await getCompanyInfo();

  return (
    <AllProductsCatalog
      categories={categories}
      products={products}
      company={company}
    />
  );
}
