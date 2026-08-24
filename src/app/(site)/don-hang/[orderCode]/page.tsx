import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByCodeAction } from "@/actions/orderActions";
import { getCompanyInfo } from "@/lib/company";
import { OrderSuccessView } from "@/components/order/OrderSuccessView";

interface OrderDetailPageProps {
  params: Promise<{ orderCode: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Xác Nhận Đơn Hàng",
  robots: { index: false, follow: false },
};


export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderCode } = await params;
  const order = await getOrderByCodeAction(orderCode);

  if (!order) {
    notFound();
  }

  const company = await getCompanyInfo();
  return <OrderSuccessView order={order} company={company} />;
}
