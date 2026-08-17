import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { isAdminAuthenticated } from "./actions";
import { ProductManager } from "../../components/admin/ProductManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  
  if (!isAuth) {
    redirect("/admin/login");
  }

  // Load categories and all products
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductManager initialCategories={categories} initialProducts={products} />;
}
