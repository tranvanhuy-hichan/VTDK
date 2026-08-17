import React from "react";
import { prisma } from "../../../lib/prisma";
import { ProductManager } from "../../../components/admin/ProductManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminDashboardPage() {
  // Load categories and all products
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return <ProductManager initialCategories={categories} initialProducts={products} />;
}
