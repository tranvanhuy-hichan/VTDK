import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminQuotationBuilder } from "@/components/admin/quote/AdminQuotationBuilder";

import { getFreshCompanyInfo } from "@/lib/company";

export const revalidate = 0; // Disable caching on admin quote page

export const metadata: Metadata = {
  title: "Báo Giá B2B | Admin Studio",
  description: "Hệ thống tạo và xuất bản in báo giá B2B chuyên nghiệp",
};

export default async function AdminQuotePage() {
  const [categories, products, company] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    getFreshCompanyInfo(),
  ]);

  return (
    <AdminQuotationBuilder
      categories={categories}
      products={products}
      company={company}
    />
  );
}
