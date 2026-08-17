import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { FloatingContact } from "../../components/FloatingContact";
import { getCompanyInfo } from "../../lib/company";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyInfo();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-slate-800 antialiased font-sans">
      <Header company={company} />
      <main className="flex-1">{children}</main>
      <FloatingContact company={company} />
      <Footer company={company} />
    </div>
  );
}
