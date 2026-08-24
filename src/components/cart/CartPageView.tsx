"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "./OrderSummary";

export const CartPageView: React.FC = () => {
  const router = useRouter();
  const { items, hydrated, removeItem, updateQty, setCheckoutItems, clear } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleClearAll = () => {
    if (window.confirm("Xoá toàn bộ sản phẩm trong giỏ hàng?")) {
      clear();
    }
  };

  const handleProceedToCheckout = () => {
    if (user?.role === "ADMIN") {
      alert("Tài khoản Quản trị viên chỉ có quyền xem và quản lý hệ thống, không thể đặt hàng.");
      return;
    }
    setCheckoutItems(items);
    if (!user) {
      router.push("/dang-nhap?redirect=/thanh-toan");
    } else {
      router.push("/thanh-toan");
    }
  };

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ProductDetailHeader productName={`Giỏ hàng${hydrated ? ` (${items.length})` : ""}`} />
          </div>
          {hydrated && items.length > 0 && user?.role !== "ADMIN" && (
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

        {user?.role === "ADMIN" ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 p-10 text-center space-y-4 shadow-xs max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Tài khoản Quản trị viên (Admin)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Tài khoản Admin chỉ có quyền xem thông tin và quản trị hệ thống, không thể thực hiện đặt hàng.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Vào trang quản trị (Admin)
              </Link>
            </div>
          </div>
        ) : !hydrated ? (

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
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Giỏ hàng của bạn đang trống</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Khám phá danh mục ống đồng, gas lạnh, linh kiện điều hòa chính hãng và thêm vào giỏ hàng ngay.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>Xem danh mục sản phẩm</span>
              <ArrowRight className="w-4 h-4" />
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
                  onClick={handleProceedToCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>Tiến hành đặt hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/san-pham"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline py-1"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </OrderTotalCard>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
