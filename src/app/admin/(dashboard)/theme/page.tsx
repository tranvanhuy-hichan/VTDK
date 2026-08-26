import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompanyInfo } from "../../../../lib/company";
import { ThemeCustomizer } from "../../../../components/admin/ThemeCustomizer";
import { FEATURES } from "../../../../lib/features";

export const metadata: Metadata = {
  title: "Tùy Biến Theme & Giao Diện | Admin Studio",
  description: "Cấu hình nhận diện thương hiệu, màu sắc, font chữ và phong cách giao diện doanh nghiệp",
};

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminThemePage() {
  if (!FEATURES.themeCustomizer) {
    notFound();
  }
  const company = await getCompanyInfo();

  return <ThemeCustomizer initialCompany={company} />;
}
