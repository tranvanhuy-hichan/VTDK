import React from "react";
import type { Metadata } from "next";
import { OrderHistoryView } from "@/components/order/OrderHistoryView";

export const metadata: Metadata = {
  title: "Đơn Hàng Của Tôi",
  robots: { index: false, follow: false },
};

export default function MyOrdersPage() {
  return <OrderHistoryView />;
}
