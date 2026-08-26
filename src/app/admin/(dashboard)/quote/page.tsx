import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminQuotationBuilder } from "@/components/admin/quote/AdminQuotationBuilder";

export const revalidate = 0; // Disable caching on admin quote page

export const metadata: Metadata = {
  title: "Tạo Báo Giá B2B | Admin Studio",
  description: "Lập bảng báo giá chuyên nghiệp cho đối tác và khách hàng B2B",
};

export default async function AdminQuotePage() {
  const [categories, products] = await Promise.all([
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
  ]);

  return <AdminQuotationBuilder categories={categories} products={products} />;
}
