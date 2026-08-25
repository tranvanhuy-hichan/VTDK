import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  // Find order by ID or fallback to orderCode
  const rawOrder = await prisma.order.findFirst({
    where: {
      OR: [
        { id },
        { orderCode: id },
      ],
    },
    include: {
      items: true,
    },
  });

  if (!rawOrder) {
    notFound();
  }

  const order: OrderDetail = {
    ...rawOrder,
    createdAt: rawOrder.createdAt.toISOString(),
    updatedAt: rawOrder.updatedAt.toISOString(),
  };

  return <AdminOrderDetailView initialOrder={order} />;
}
