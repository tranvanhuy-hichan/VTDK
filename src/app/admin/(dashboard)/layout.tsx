import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../actions";
import { getCompanyInfo } from "../../../lib/company";
import { getCurrentUser } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/dang-nhap?redirect=/admin");
  }


  const company = await getCompanyInfo();
  const user = await getCurrentUser();
  const adminUser = user || {
    id: "admin-default",
    name: "Quản trị viên",
    email: "vattudongkha@gmail.com",
    role: "ADMIN" as const,
    phone: company.hotlineRaw,
    address: company.address,
    avatar: null,
  };

  return (
    <AdminShell companyName={company.name} adminUser={adminUser}>
      {children}
    </AdminShell>
  );
}

