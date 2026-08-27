import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "@/lib/company";
import { OrderLookupView } from "@/components/order/OrderLookupView";

export const metadata: Metadata = {
  title: "Tra Cứu Đơn Hàng | Vật Tư Điện Lạnh Đông Kha Đà Nẵng",
  description: "Tra cứu tình trạng vận chuyển và chi tiết đơn hàng vật tư điện lạnh tại Đông Kha Đà Nẵng bằng Mã đơn hàng hoặc Số điện thoại.",
};

export default async function OrderLookupPage() {
  const company = await getCompanyInfo();
  return <OrderLookupView company={company} />;
}
