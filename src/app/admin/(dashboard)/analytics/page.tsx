import React from "react";
import type { Metadata } from "next";
import { getAdminAnalyticsAction } from "../../../../actions/analyticsActions";
import { AdminAnalyticsView } from "../../../../components/admin/AdminAnalyticsView";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Báo Cáo & Thống Kê Doanh Thu - Admin",
  description: "Theo dõi doanh số, mặt hàng bán chạy và hiệu quả kinh doanh.",
};

export const revalidate = 0; // Fresh dynamic data

export default async function AdminAnalyticsPage() {
  const result = await getAdminAnalyticsAction("30d");

  if (!result.success || !result.data) {
    redirect("/admin/login");
  }

  return <AdminAnalyticsView initialData={result.data} />;
}
