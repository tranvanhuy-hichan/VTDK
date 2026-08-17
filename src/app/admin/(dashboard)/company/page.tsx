import React from "react";
import { getCompanyInfo } from "../../../../lib/company";
import { CompanyInfoManager } from "../../../../components/admin/CompanyInfoManager";

export const revalidate = 0; // Disable caching on the admin dashboard

export default async function AdminCompanyPage() {
  const company = await getCompanyInfo();

  return <CompanyInfoManager initialCompany={company} />;
}
