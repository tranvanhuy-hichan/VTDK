import React from "react";
import { getFreshCompanyInfo } from "../../../../lib/company";
import { CompanyInfoManager } from "../../../../components/admin/CompanyInfoManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminCompanyPage() {
  const company = await getFreshCompanyInfo();

  return <CompanyInfoManager initialCompany={company} />;
}
