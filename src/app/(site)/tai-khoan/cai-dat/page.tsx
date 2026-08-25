import React from "react";
import type { Metadata } from "next";
import { UserSettingsView } from "@/components/account/UserSettingsView";

export const metadata: Metadata = {
  title: "Cài Đặt Hệ Thống - Tài Khoản",
  robots: { index: false, follow: false },
};

export default function UserSettingsPage() {
  return <UserSettingsView />;
}
