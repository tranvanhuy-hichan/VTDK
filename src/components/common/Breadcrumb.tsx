"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  variant?: "light" | "banner";
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showBackButton = true,
  variant = "light",
  className = "",
}) => {
  const router = useRouter();

  const isBanner = variant === "banner";

  const textColor = isBanner
    ? "text-blue-200 hover:text-white"
    : "text-slate-500 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400";

  const activeColor = isBanner
    ? "text-white font-extrabold"
    : "text-slate-900 dark:text-white font-extrabold";

  const separatorColor = isBanner
    ? "text-blue-300/60"
    : "text-slate-300 dark:text-slate-700";

  const backColor = isBanner
    ? "text-blue-100 hover:text-white"
    : "text-slate-700 dark:text-slate-200 hover:text-[#075FA8] dark:hover:text-blue-400";

  const iconColor = isBanner
    ? "text-blue-300"
    : "text-[#075FA8] dark:text-blue-400";

  const homeIconColor = isBanner
    ? "text-blue-300"
    : "text-slate-400";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs leading-none py-1 my-0 whitespace-nowrap overflow-x-auto no-scrollbar max-w-full ${className}`}
    >
      {/* Back button */}
      {showBackButton && (
        <>
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Quay lại trang trước"
            className={`inline-flex items-center gap-1 font-bold ${backColor} transition-colors shrink-0 cursor-pointer !min-h-0`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${iconColor} shrink-0`} />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <span className={`${separatorColor} font-normal shrink-0 text-[10px]`}>|</span>
        </>
      )}

      {/* Home link */}
      <Link
        href="/"
        className={`inline-flex items-center gap-1 ${textColor} font-medium transition-colors shrink-0`}
      >
        <Home className={`w-3 h-3 ${homeIconColor} shrink-0`} />
        <span>Trang chủ</span>
      </Link>

      {/* Trailing Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className={`w-3 h-3 ${separatorColor} shrink-0`} />
            {isLast || !item.href ? (
              <span
                className={`inline-flex items-center ${activeColor} truncate max-w-[170px] sm:max-w-md shrink-0`}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={`inline-flex items-center ${textColor} font-medium transition-colors shrink-0`}
              >
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
