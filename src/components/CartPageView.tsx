"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Minus, Plus, Trash2, ShoppingCart, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { buildCartZaloMessage } from "../lib/zaloMessage";
import { ZaloMessageConfirm } from "./ZaloMessageConfirm";
import { ProductDetailHeader } from "./ProductDetailHeader";

interface CartPageViewProps {
  zaloUrl: string;
}

const CartRowSkeleton: React.FC = () => (
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

const CartSummarySkeleton: React.FC = () => (
  <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
      <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
    </div>
    <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
    <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-32 mx-auto" />
  </div>
);

export const CartPageView: React.FC<CartPageViewProps> = ({ zaloUrl }) => {
  const { items, hydrated, removeItem, updateQty } = useCart();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasUnpriced = items.some((item) => item.price === 0);

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ProductDetailHeader productName="Giỏ hàng" />

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Giỏ hàng {hydrated ? `(${items.length})` : ""}
        </h1>

        {!hydrated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              <CartRowSkeleton />
              <CartRowSkeleton />
            </div>
            <CartSummarySkeleton />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có sản phẩm nào trong giỏ. Bấm biểu tượng giỏ hàng trên từng sản phẩm để thêm vào đây.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3 p-3 sm:p-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {item.name}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""}
                    </p>
                    <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-bold mt-1">
                      {item.price > 0 ? `${item.price.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
                    </p>

                    {/* Quantity Stepper */}
                    <div className="mt-2 inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Giảm số lượng"
                        className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        aria-label="Tăng số lượng"
                        className="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer !min-h-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {item.price > 0 ? `${(item.price * item.qty).toLocaleString("vi-VN")}đ` : "—"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label="Xoá khỏi giỏ"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer !min-h-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & CTA */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Tổng cộng</h2>
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
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98"
              >
                <span>Liên hệ ngay</span>
              </button>
              <Link
                href="/san-pham"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline py-1"
              >
                Tiếp tục xem sản phẩm
              </Link>
            </div>
          </div>
        )}
      </div>

      {isConfirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left"
            onClick={() => setIsConfirmOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Hỏi giá qua Zalo</h3>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  aria-label="Đóng"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ZaloMessageConfirm
                  message={buildCartZaloMessage(items)}
                  zaloUrl={zaloUrl}
                  onOpened={() => setIsConfirmOpen(false)}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
