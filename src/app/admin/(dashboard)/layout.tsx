import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../actions";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
