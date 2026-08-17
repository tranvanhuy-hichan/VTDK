import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../actions";
import { getCompanyInfo } from "../../../lib/company";
import { CompanyInfoManager } from "../../../components/admin/CompanyInfoManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminCompanyPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin/login");
  }

  const company = await getCompanyInfo();

  return <CompanyInfoManager initialCompany={company} />;
}
