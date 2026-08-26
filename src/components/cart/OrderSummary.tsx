"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../context/CartContext";
import { OrderItemCard } from "@/components/ui";

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
      "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3 space-y-2 overflow-hidden"
    }
  >
    {items.map((item) => (
      <OrderItemCard
        key={item.key}
        title={item.name}
        variantTitle={item.variantLabel}
        unitPrice={item.price}
        quantity={item.qty}
        image={item.image}
        readOnly={!editable}
        onQuantityChange={
          editable && onUpdateQty ? (newQty) => onUpdateQty(item.key, newQty) : undefined
        }
        onRemove={editable && onRemove ? () => onRemove(item.key) : undefined}
      />
    ))}
  </div>
);

interface OrderTotalCardProps {
  items: CartItem[];
  title?: string;
  shippingFee?: number;
  shippingLabel?: string;
  amountNeededForFreeship?: number;
  freeshipThreshold?: number;
  children?: React.ReactNode;
}

export const OrderTotalCard: React.FC<OrderTotalCardProps> = ({
  items,
  title = "Tổng cộng",
  shippingFee,
  shippingLabel,
  amountNeededForFreeship,
  freeshipThreshold = 2000000,
  children,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const actualShipping = typeof shippingFee === "number" ? shippingFee : 0;
  const finalTotal = subtotal + actualShipping;
  const hasUnpriced = items.some((item) => item.price === 0);

  const threshold = typeof freeshipThreshold === "number" && freeshipThreshold > 0 ? freeshipThreshold : 2000000;
  const needed =
    typeof amountNeededForFreeship === "number"
      ? amountNeededForFreeship
      : Math.max(0, threshold - subtotal);

  const isFreeshipQualified = needed <= 0 || subtotal >= threshold;
  const freeshipProgress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
      <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{title}</h2>

      {/* Freeship Progress Meter: Chỉ hiển thị khi CHƯA đủ điều kiện freeship để gợi ý mua thêm. Khi đủ điều kiện thì ẩn hoàn toàn. */}
      {threshold > 0 && !isFreeshipQualified && needed > 0 && subtotal > 0 && (
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#075FA8] dark:text-blue-300">
              Mua thêm{" "}
              <strong className="text-orange-600 dark:text-orange-400">
                {needed.toLocaleString("vi-VN")}đ
              </strong>{" "}
              để được <strong>FREESHIP</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">{freeshipProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#075FA8] to-cyan-400"
              style={{ width: `${freeshipProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Breakdown Rows */}
      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Tiền hàng (Tạm tính)</span>
          <span className="font-bold text-slate-900 dark:text-slate-200">
            {subtotal.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {typeof shippingFee === "number" && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span>Phí vận chuyển</span>
              {shippingLabel && <span className="text-[11px] text-slate-400">({shippingLabel})</span>}
            </span>
            <span
              className={`font-black ${
                shippingFee === 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-900 dark:text-slate-200"
              }`}
            >
              {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {typeof shippingFee === "number" ? "Tổng thanh toán" : "Tạm tính"}
          </span>
          <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400">
            {finalTotal.toLocaleString("vi-VN")}đ
          </span>
        </div>
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
