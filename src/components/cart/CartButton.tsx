"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface CartButtonProps {
  variant?: "icon" | "row";
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ variant = "icon", className }) => {
  const { items } = useCart();
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  if (variant === "row") {
    return (
      <Link
        href="/gio-hang"
        className={
          className ||
          "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-750"
        }
      >
        <span className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 text-[#075FA8] dark:text-blue-400" />
          Giỏ hàng
        </span>
        <span className="text-xs font-semibold text-slate-400">{totalQty} sản phẩm</span>
      </Link>
    );
  }

  return (
    <Link
      href="/gio-hang"
      aria-label="Giỏ hàng"
      className={
        className ||
        "relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !min-h-0"
      }
    >
      <ShoppingCart className="w-5 h-5" />
      {totalQty > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#F47A20] text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
          {totalQty}
        </span>
      )}
    </Link>
  );
};
