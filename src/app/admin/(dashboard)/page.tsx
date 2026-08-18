import React from "react";
import { prisma } from "../../../lib/prisma";
import { getCompanyInfo } from "../../../lib/company";
import { AdminDashboardHome } from "../../../components/admin/AdminDashboardHome";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    totalServices,
    totalGalleryImages,
    company,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { active: false } }),
    prisma.category.count(),
    prisma.service.count(),
    prisma.galleryImage.count(),
    getCompanyInfo(),
    prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  const stats = {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    totalServices,
    totalGalleryImages,
  };

  return (
    <AdminDashboardHome
      stats={stats}
      company={company}
      recentProducts={recentProducts}
    />
  );
}
