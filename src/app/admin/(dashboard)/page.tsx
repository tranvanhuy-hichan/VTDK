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
    prisma.product.count().catch(() => 0),
    prisma.product.count({ where: { active: true } }).catch(() => 0),
    prisma.product.count({ where: { active: false } }).catch(() => 0),
    prisma.category.count().catch(() => 0),
    prisma.service.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }).catch(() => ({ _sum: { totalAmount: 0 } })),
    getCompanyInfo(),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }).catch(() => []),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }).catch(() => []),
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
