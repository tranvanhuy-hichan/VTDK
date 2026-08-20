import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "@/lib/company";
import { CheckoutPageView } from "@/components/CheckoutPageView";

export const metadata: Metadata = {
  title: "Thanh Toán",
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const company = await getCompanyInfo();
  return <CheckoutPageView zaloUrl={company.zaloUrl} />;
}
