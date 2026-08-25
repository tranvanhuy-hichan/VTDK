import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { AdminOrderDetailView } from "@/components/admin/orders/AdminOrderDetailView";
import type { OrderDetail } from "@/types/order";

export const revalidate = 0; // Disable caching for admin order detail

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  // Find order and company info in parallel
  const [rawOrder, company] = await Promise.all([
    prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderCode: id },
        ],
      },
      include: {
        items: true,
      },
    }),
    getCompanyInfo(),
  ]);

  if (!rawOrder) {
    notFound();
  }

  const order: OrderDetail = {
    ...rawOrder,
    createdAt: rawOrder.createdAt.toISOString(),
    updatedAt: rawOrder.updatedAt.toISOString(),
  };

  return <AdminOrderDetailView initialOrder={order} company={company} />;
}
