import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { ProductForm } from "../../../../../components/admin/ProductForm";

export const revalidate = 0; // Disable caching on the admin dashboard

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product) {
    notFound();
  }

  return <ProductForm categories={categories} initialProduct={product} />;
}
