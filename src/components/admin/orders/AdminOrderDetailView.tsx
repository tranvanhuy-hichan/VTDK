"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Truck,
  Store,
  Phone,
  MapPin,
  Copy,
  Check,
  User,
  Package,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderItemCard } from "@/components/ui";

import { PrintableQuoteModal, type QuoteItem } from "@/components/quote/PrintableQuoteModal";
import { FileText } from "lucide-react";

const PrintableOrderSlip = dynamic(
  () => import("./PrintableOrderSlip").then((mod) => mod.PrintableOrderSlip),
  { ssr: false }
);

import type { CompanyContact } from "@/lib/company";

const ORDER_FLOW = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED"] as const;

const ORDER_STEP_LABELS: Record<(typeof ORDER_FLOW)[number], string> = {
  PENDING: "Tiếp nhận",
  CONFIRMED: "Xác nhận",
  SHIPPING: "Giao hàng",
  COMPLETED: "Hoàn tất",
};
interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
  company?: CompanyContact;
}

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({ initialOrder, company }) => {
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder.status);
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"items" | "customer">("items");

  const handleCopyAddress = () => {
    if (!order.address) return;
    navigator.clipboard.writeText(order.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus || loading) return;

    const nextLabel = ORDER_STEP_LABELS[newStatus as (typeof ORDER_FLOW)[number]];
    const confirmed = window.confirm(`Xác nhận chuyển đơn hàng sang “${nextLabel}”? Thao tác này không thể hoàn tác.`);
    if (!confirmed) return;

    setLoading(true);
    setMsg(null);
    const res = await adminUpdateOrderStatusAction(order.id, newStatus);
    setLoading(false);
    if (res.success) {
      setCurrentStatus(newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setMsg(`Đã cập nhật trạng thái đơn thành “${nextLabel}”`);
    } else {
      setMsg(res.error || "Cập nhật trạng thái thất bại");
    }
  };

  const quoteItems: QuoteItem[] = order.items.map((i) => ({
    id: i.id,
    name: i.productName,
    variantTitle: i.variantLabel || undefined,
    quantity: i.quantity,
    price: i.price,
    image: i.image,
  }));

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full text-left max-w-7xl mx-auto space-y-2.5 sm:space-y-4 pb-12 px-1 sm:px-2">
      {/* Compact order header */}
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                #{order.orderCode}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            <PrintableOrderSlip order={order} company={company} />

            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#075FA8] dark:text-blue-300 hover:bg-blue-100 text-xs font-bold shadow-2xs transition-colors shrink-0 whitespace-nowrap cursor-pointer !min-h-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Báo giá PDF</span>
            </button>

            <a
              href={`tel:${order.customerPhone}`}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 whitespace-nowrap !min-h-0"
            >
              <Phone className="w-3 h-3" />
              <span>Gọi khách</span>
            </a>
          </div>
        </div>

        {/* Forward-only order progress */}
        <div className="mt-2.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          {currentStatus === "CANCELLED" ? (
            <div className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Đơn hàng đã hủy
            </div>
          ) : (
            <div className="relative grid grid-cols-4">
              <div className="absolute left-[12.5%] right-[12.5%] top-2.5 sm:top-3 h-0.5 bg-slate-200 dark:bg-slate-700" />
              <div
                className="absolute left-[12.5%] top-2.5 sm:top-3 h-0.5 bg-[#075FA8] transition-all duration-300"
                style={{ width: `${(ORDER_FLOW.indexOf(currentStatus) / (ORDER_FLOW.length - 1)) * 75}%` }}
              />
              {ORDER_FLOW.map((status, index) => {
                const currentIndex = ORDER_FLOW.indexOf(currentStatus);
                const isReached = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const canAdvance = index === currentIndex + 1 && !loading;

                return (
                  <button
                    key={status}
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => canAdvance && handleStatusChange(status)}
                    className={`relative z-10 flex flex-col items-center gap-1 bg-transparent !min-h-0 ${
                      canAdvance ? "cursor-pointer group" : "cursor-default"
                    }`}
                    title={canAdvance ? `Chuyển sang ${ORDER_STEP_LABELS[status]}` : undefined}
                  >
                    <span
                      className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 text-[9px] sm:text-[10px] font-black transition-colors ${
                        isReached
                          ? "border-[#075FA8] bg-[#075FA8] text-white"
                          : canAdvance
                            ? "border-blue-300 bg-white text-[#075FA8] group-hover:bg-blue-50 dark:bg-slate-900"
                            : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                      } ${isCurrent ? "ring-2 sm:ring-4 ring-blue-100 dark:ring-blue-950" : ""}`}
                    >
                      {index < currentIndex || currentStatus === "COMPLETED" ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : index + 1}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-bold ${isReached ? "text-[#075FA8] dark:text-blue-400" : "text-slate-400"}`}>
                      {ORDER_STEP_LABELS[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {msg && (
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>{msg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Segmented Tab Switcher */}
      <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("items")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "items"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>1. Sản phẩm ({order.items.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("customer")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "customer"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>2. Khách &amp; Giao nhận</span>
        </button>
      </div>

      {/* Order details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
        {/* LEFT: Products & Payment Summary (8 cols) */}
        <div className={`lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs ${mobileTab !== "items" ? "hidden lg:block" : "block"}`}>
          <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/70 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Package className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Sản phẩm ({order.items.length})</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {totalQuantity} món
            </span>
          </div>

          {/* Product Items */}
          <div className="p-2 sm:p-3 space-y-2">
            {order.items.map((item, idx) => (
              <OrderItemCard
                key={item.id || idx}
                title={item.productName}
                variantTitle={item.variantLabel}
                unitPrice={item.price}
                quantity={item.quantity}
                image={item.image}
                readOnly={true}
              />
            ))}
          </div>

          {/* Total calculation */}
          <div className="border-t border-slate-200 bg-slate-50/50 p-3 sm:p-4 space-y-1.5 text-xs sm:text-sm dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Phí vận chuyển:</span>
              <span
                className={`font-semibold ${
                  order.shippingFee === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-800 dark:text-slate-200"
                }`}
              >
                {order.shippingFee === 0
                  ? "0 ₫ (Miễn phí / Lấy tại kho)"
                  : formatCurrency(order.shippingFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">Tổng tiền thanh toán:</span>
              <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Customer & Shipping (4 cols) */}
        <div className={`lg:col-span-4 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 ${mobileTab !== "customer" ? "hidden lg:block" : "block"}`}>
          {/* Customer info card */}
          <div className="p-4 sm:p-5 space-y-4 text-sm">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Khách hàng</span>
            </div>

            <div className="space-y-2 pt-0.5">
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {order.customerName}
              </p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <a href={`tel:${order.customerPhone}`} className="text-[#075FA8] dark:text-blue-400 font-bold hover:underline !min-h-0 inline-flex items-center">
                  {order.customerPhone}
                </a>
              </p>
              {order.customerEmail && (
                <p className="text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Delivery info card */}
          <div className="border-t border-slate-100 p-4 sm:p-5 space-y-4 text-xs dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
                <span>Giao nhận</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-500"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="space-y-1.5">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="flex items-start justify-between gap-1.5 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <div className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="break-words font-medium">{order.address}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg shrink-0 cursor-pointer !min-h-0"
                    title="Sao chép địa chỉ"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <p className="text-slate-500 italic">Nhận trực tiếp tại kho 400 Phạm Hùng, Đà Nẵng.</p>
              )}

              {order.note && (
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px]">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-xs dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Thanh toán:</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] border border-slate-200 dark:border-slate-700">
              Tiền mặt (COD)
            </span>
          </div>
        </div>
      </div>

      {/* Printable Quote Modal */}
      <PrintableQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={quoteItems}
        company={company}
        initialCustomerName={order.customerName}
        initialCustomerPhone={order.customerPhone}
        initialCustomerAddress={order.address || undefined}
      />
    </div>
  );
};
