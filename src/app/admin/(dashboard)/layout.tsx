import React from "react";
import { redirect } from "next/navigation";
import { getCompanyInfo } from "../../../lib/company";
import { getCurrentAdmin } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await getCurrentAdmin();

  if (!adminUser) {
    redirect("/dang-nhap?redirect=/admin");
  }

  const company = await getCompanyInfo();

  return (
    <AdminShell companyName={company.name} adminUser={adminUser}>
      {children}
    </AdminShell>
  );
}

