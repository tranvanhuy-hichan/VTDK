import React from "react";
import { prisma } from "../../../lib/prisma";
import { getCompanyInfo } from "../../../lib/company";
import { AdminDashboardHome } from "../../../components/admin/AdminDashboardHome";
import type { OrderStatus } from "../../../types/order";

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
    rawRecentOrders,
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
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
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

  const recentOrders = rawRecentOrders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    totalAmount: o.totalAmount,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.reduce((s, it) => s + it.quantity, 0),
  }));

  return (
    <AdminDashboardHome
      stats={stats}
      company={company}
      recentProducts={recentProducts}
      recentOrders={recentOrders}
    />
  );
}
