import React from "react";
import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { getCompanyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const company = await getCompanyInfo();
  return <CartPageView company={company} />;
}
