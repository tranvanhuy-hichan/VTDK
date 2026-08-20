"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../context/CartContext";

export const OrderRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 sm:p-4 animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
      <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-1/3" />
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-14" />
      <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
  </div>
);

export const OrderTotalSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
      <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
    </div>
    <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
    <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-32 mx-auto" />
  </div>
);

interface OrderItemsCardProps {
  items: CartItem[];
  editable?: boolean;
  onRemove?: (key: string) => void;
  onUpdateQty?: (key: string, qty: number) => void;
  className?: string;
}

export const OrderItemsCard: React.FC<OrderItemsCardProps> = ({
  items,
  editable = false,
  onRemove,
  onUpdateQty,
  className,
}) => (
  <div
    className={
      className ||
      "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
    }
  >
    {items.map((item) => (
      <div key={item.key} className="flex items-start gap-3 p-3 sm:p-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {item.name}
          </p>
          {item.variantLabel && (
            <span className="inline-flex items-center mt-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-[#075FA8] dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
              {item.variantLabel}
            </span>
          )}
          <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-bold mt-1">
            {item.price > 0 ? `${item.price.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2">
            {editable && onUpdateQty ? (
              <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.key, item.qty - 1)}
                  disabled={item.qty <= 1}
                  aria-label="Giảm số lượng"
                  className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.key, item.qty + 1)}
                  aria-label="Tăng số lượng"
                  className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer !min-h-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">Số lượng: {item.qty}</p>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white whitespace-nowrap">
                {item.price > 0 ? `${(item.price * item.qty).toLocaleString("vi-VN")}đ` : "—"}
              </span>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  aria-label="Xoá khỏi giỏ"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer !min-h-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface OrderTotalCardProps {
  items: CartItem[];
  title?: string;
  children?: React.ReactNode;
}

export const OrderTotalCard: React.FC<OrderTotalCardProps> = ({ items, title = "Tổng cộng", children }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasUnpriced = items.some((item) => item.price === 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
      <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{title}</h2>
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Tạm tính</span>
        <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400">
          {total.toLocaleString("vi-VN")}đ
        </span>
      </div>
      {hasUnpriced && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Chưa gồm các sản phẩm cần liên hệ báo giá — shop sẽ tư vấn giá cụ thể qua Zalo.
        </p>
      )}
      {children}
    </div>
  );
};
