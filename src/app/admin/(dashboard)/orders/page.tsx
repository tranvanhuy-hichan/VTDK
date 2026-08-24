import React from "react";
import { prisma } from "../../../../lib/prisma";
import { AdminOrderList } from "../../../../components/admin/orders/AdminOrderList";
import type { OrderDetail } from "../../../../types/order";

export const revalidate = 0; // Disable caching on admin

export default async function AdminOrdersPage() {
  const rawOrders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const orders: OrderDetail[] = rawOrders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return (
    <div>
      <AdminOrderList initialOrders={orders} />
    </div>
  );

}
