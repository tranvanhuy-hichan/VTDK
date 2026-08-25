import React from "react";
import type { Metadata } from "next";
import { AdminSettingsManager } from "../../../../components/admin/AdminSettingsManager";

export const metadata: Metadata = {
  title: "Cài Đặt Hệ Thống - Admin",
  robots: { index: false, follow: false },
};

export const revalidate = 0; // Disable caching on the admin dashboard

export default function AdminSettingsPage() {
  return <AdminSettingsManager />;
}
