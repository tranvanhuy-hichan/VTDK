import React from "react";
import type { Metadata } from "next";
import { UserProfileView } from "@/components/account/UserProfileView";

export const metadata: Metadata = {
  title: "Thông Tin Tài Khoản",
  robots: { index: false, follow: false },
};

export default function UserProfilePage() {
  return <UserProfileView />;
}
