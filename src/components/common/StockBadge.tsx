"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export interface StockBadgeProps {
  stock?: number | null;
  lowStockThreshold?: number;
  showIcon?: boolean;
  showCount?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stock = 0,
  lowStockThreshold = 5,
  showIcon = true,
  showCount = true,
  className = "",
  size = "sm",
}) => {
  const count = typeof stock === "number" ? stock : 0;
  const isOutOfStock = count <= 0;
  const isLowStock = !isOutOfStock && count <= lowStockThreshold;

  const sizeClasses =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-[10.5px] px-2 py-0.5 gap-1";

  if (isOutOfStock) {
    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 rounded-md font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 ${sizeClasses} ${className}`}
      >
        {showIcon && <XCircle className="w-3 h-3 text-red-500 shrink-0" />}
        <span className="whitespace-nowrap">Hết hàng</span>
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 rounded-md font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${sizeClasses} ${className}`}
      >
        {showIcon && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
        <span className="whitespace-nowrap">
          Sắp hết {showCount ? `(${count})` : ""}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 rounded-md font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${sizeClasses} ${className}`}
    >
      {showIcon && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
      <span className="whitespace-nowrap">
        Còn hàng {showCount ? `(${count})` : ""}
      </span>
    </span>
  );
};
