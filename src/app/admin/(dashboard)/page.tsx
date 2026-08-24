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
    totalOrders,
    pendingOrders,
    revenueResult,
    company,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { active: false } }),
    prisma.category.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    getCompanyInfo(),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const stats = {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    totalServices,
    totalOrders,
    pendingOrders,
    totalRevenue,
  };

  return (
    <AdminDashboardHome
      stats={stats}
      company={company}
      recentProducts={recentProducts}
    />
  );
}
