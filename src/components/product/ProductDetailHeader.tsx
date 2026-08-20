"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

interface ProductDetailHeaderProps {
  productName: string;
  categoryName?: string;
  categorySlug?: string;
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  productName,
  categoryName,
  categorySlug,
}) => {
  const router = useRouter();
  const catHref = categorySlug ? `/${categorySlug}` : "/san-pham";

  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 my-0 leading-none max-w-full">
      {/* Back button - icon only on mobile */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Quay lại trang trước"
        className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer !min-h-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
        <span className="hidden sm:inline">Quay lại</span>
      </button>

      <span className="text-slate-300 dark:text-slate-700 font-normal shrink-0">|</span>

      {/* Breadcrumb line: Trang chủ > [Category Landing Page] > [Product Name] */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 leading-none shrink-0 min-w-0">
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Trang chủ</span>
        </Link>

        {categoryName && (
          <>
            <ChevronRight className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href={catHref}
              className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400 font-medium transition-colors shrink-0"
            >
              <span>{categoryName}</span>
            </Link>
          </>
        )}

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <span className="inline-flex items-center font-extrabold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-xs">
          {productName}
        </span>
      </nav>
    </div>
  );
};
