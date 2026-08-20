import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "@/lib/company";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const company = await getCompanyInfo();
  return <CartPageView zaloUrl={company.zaloUrl} hasDelivery={company.hasDelivery} />;
}
