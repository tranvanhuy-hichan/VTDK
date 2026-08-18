import React from "react";
import type { Metadata } from "next";
import { prisma } from "../../../lib/prisma";
import { getCompanyInfo } from "../../../lib/company";
import { AllProductsCatalog } from "../../../components/AllProductsCatalog";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  return {
    title: "Tất Cả Sản Phẩm Vật Tư Điện Lạnh",
    description: `Danh mục sỉ & lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt giá sỉ tốt nhất Đà Nẵng tại ${company.name}. Hotline: ${company.hotline}.`,
    alternates: {
      canonical: "/san-pham",
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
