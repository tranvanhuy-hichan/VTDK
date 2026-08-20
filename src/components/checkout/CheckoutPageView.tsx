"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { buildCartZaloMessage, type BuyerInfo } from "../../lib/zaloMessage";
import { ZaloMessageConfirm } from "../zalo/ZaloMessageConfirm";
import { BuyerInfoForm } from "./BuyerInfoForm";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "../cart/OrderSummary";

interface CheckoutPageViewProps {
  zaloUrl: string;
}

const BuyerFormSkeleton: React.FC = () => (
  <div className="lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-40" />
    <div className="space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
      <div className="h-10 bg-slate-150 dark:bg-slate-800/60 rounded-xl w-full" />
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
      <div className="h-10 bg-slate-150 dark:bg-slate-800/60 rounded-xl w-full" />
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
      <div className="h-10 bg-slate-150 dark:bg-slate-800/60 rounded-xl w-full" />
    </div>
    <div className="h-3 bg-slate-150 dark:bg-slate-800/60 rounded-md w-full" />
    <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
  </div>
);

export const CheckoutPageView: React.FC<CheckoutPageViewProps> = ({ zaloUrl }) => {
  const { checkoutItems, hydrated, updateCheckoutQty } = useCart();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [buyer, setBuyer] = useState<BuyerInfo | undefined>(undefined);

  const handleBuyerSubmit = (info: BuyerInfo) => {
    setBuyer(info);
    setStep("confirm");
  };

  if (!hydrated) {
    return (
      <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ProductDetailHeader productName="Thanh toán" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            <div className="lg:h-full lg:overflow-y-auto lg:pr-1 space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <OrderRowSkeleton />
                <OrderRowSkeleton />
              </div>
              <OrderTotalSkeleton />
            </div>
            <BuyerFormSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ProductDetailHeader productName="Thanh toán" />

        {checkoutItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có sản phẩm nào để thanh toán. Vui lòng chọn sản phẩm rồi bấm &quot;Mua ngay&quot;.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            {/* Order Summary */}
            <div className="lg:h-full lg:overflow-y-auto lg:pr-1 space-y-3">
              <OrderItemsCard items={checkoutItems} editable onUpdateQty={updateCheckoutQty} />
              <OrderTotalCard items={checkoutItems} title="Tổng đơn hàng" />
            </div>

            {/* Buyer Info / Zalo Confirm */}
            <div className="lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-4">
                {step === "form" ? "Thông tin nhận hàng" : "Xác nhận qua Zalo"}
              </h2>
              {step === "form" ? (
                <BuyerInfoForm onSubmit={handleBuyerSubmit} />
              ) : (
                <ZaloMessageConfirm
                  message={buildCartZaloMessage(checkoutItems, { mode: "buy", buyer })}
                  zaloUrl={zaloUrl}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
