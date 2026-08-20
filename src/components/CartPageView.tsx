"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { buildCartZaloMessage } from "../lib/zaloMessage";
import { ZaloMessageConfirm } from "./ZaloMessageConfirm";
import { ProductDetailHeader } from "./ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "./OrderSummary";

interface CartPageViewProps {
  zaloUrl: string;
  hasDelivery: boolean;
}

export const CartPageView: React.FC<CartPageViewProps> = ({ zaloUrl, hasDelivery }) => {
  const router = useRouter();
  const { items, hydrated, removeItem, updateQty, setCheckoutItems, clear } = useCart();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClearAll = () => {
    if (window.confirm("Xoá toàn bộ sản phẩm trong giỏ hàng?")) {
      clear();
    }
  };

  const handleCtaClick = () => {
    if (hasDelivery) {
      setCheckoutItems(items);
      router.push("/thanh-toan");
    } else {
      setIsConfirmOpen(true);
    }
  };

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ProductDetailHeader productName={`Giỏ hàng${hydrated ? ` (${items.length})` : ""}`} />
          </div>
          {hydrated && items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer !min-h-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xoá tất cả</span>
            </button>
          )}
        </div>

        {!hydrated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            <div className="lg:col-span-2 lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              <OrderRowSkeleton />
              <OrderRowSkeleton />
              <OrderRowSkeleton />
            </div>
            <div className="lg:col-span-1 lg:h-full lg:overflow-y-auto">
              <OrderTotalSkeleton />
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            <OrderItemsCard
              items={items}
              editable
              onRemove={removeItem}
              onUpdateQty={updateQty}
              className="lg:col-span-2 lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800"
            />

            <div className="lg:col-span-1 lg:h-full lg:overflow-y-auto space-y-3">
              <OrderTotalCard items={items}>
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98"
                >
                  {hasDelivery ? (
                    <>
                      <span className="sm:hidden">Mua</span>
                      <span className="hidden sm:inline">Mua ngay</span>
                    </>
                  ) : (
                    <span>Liên hệ ngay</span>
                  )}
                </button>
                <Link
                  href="/san-pham"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline py-1"
                >
                  Tiếp tục xem sản phẩm
                </Link>
              </OrderTotalCard>
            </div>
          </div>
        )}
      </div>

      {!hasDelivery &&
        isConfirmOpen &&
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
