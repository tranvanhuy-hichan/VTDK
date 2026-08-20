import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { FloatingContact } from "../../components/FloatingContact";
import { getCompanyInfo } from "../../lib/company";
import { prisma } from "../../lib/prisma";
import { CartProvider } from "../../context/CartContext";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyInfo();
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F6F8FA] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
        <Header company={company} />
        <main className="flex-1">{children}</main>
        <FloatingContact company={company} />
        <Footer company={company} categories={categories} />
      </div>
    </CartProvider>
  );
}
