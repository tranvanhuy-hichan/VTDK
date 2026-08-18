import React from "react";
import { prisma } from "../../../../../lib/prisma";
import { ProductForm } from "../../../../../components/admin/ProductForm";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <ProductForm categories={categories} />;
}
