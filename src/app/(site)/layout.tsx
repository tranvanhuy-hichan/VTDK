import React from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { FloatingContact } from "../../components/layout/FloatingContact";
import { MobileBottomBar } from "../../components/layout/MobileBottomBar";
import { getCompanyInfo } from "../../lib/company";
import { prisma } from "../../lib/prisma";
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from "../../context/AuthContext";
import { AuthModal } from "../../components/auth/AuthModal";

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
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#F6F8FA] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-300 pb-14 sm:pb-0">
          <Header company={company} />
          <main className="flex-1">{children}</main>
          <FloatingContact company={company} />
          <Footer company={company} categories={categories} />
          <MobileBottomBar />
          <AuthModal />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

