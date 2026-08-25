"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Truck,
  Store,
  Phone,
  MapPin,
  FileText,
  Copy,
  Check,
  User,
  Package,
  Printer,
  CreditCard,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { OrderDetail, OrderStatus } from "../../../types/order";
import { OrderStatusBadge } from "../../order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "../../../actions/orderActions";
import { formatCurrency, formatDate } from "../../../lib/format";

const PrintableOrderSlip = dynamic(
  () => import("./PrintableOrderSlip").then((mod) => mod.PrintableOrderSlip),
  { ssr: false }
);

interface AdminOrderDetailModalProps {
  order: OrderDetail;
  onClose: () => void;
  onStatusUpdated: (orderId: string, newStatus: OrderStatus) => void;
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Chờ xử lý" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
  { status: "SHIPPING", label: "Đang giao" },
  { status: "COMPLETED", label: "Hoàn thành" },
  { status: "CANCELLED", label: "Đã hủy" },
];

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  order,
  onClose,
  onStatusUpdated,
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    setMsg(null);
    const res = await adminUpdateOrderStatusAction(order.id, newStatus);
    setLoading(false);
    if (res.success) {
      setCurrentStatus(newStatus);
      onStatusUpdated(order.id, newStatus);
      setMsg("Đã đổi trạng thái!");
      setTimeout(() => setMsg(null), 2500);
    } else {
      setMsg(res.error || "Lỗi cập nhật.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const initials = (order.customerName || "K")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(-2);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 text-left overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header: Compact, Full-Width Responsive */}
        <div className="bg-[#081524] text-white px-3.5 py-2.5 sm:px-5 sm:py-3.5 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs sm:text-sm font-black text-white px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700 inline-flex items-center gap-1.5 shrink-0">
              {order.orderCode}
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-0.5 hover:bg-slate-700 rounded transition-colors cursor-pointer !min-h-0"
                title="Sao chép"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </span>
            <OrderStatusBadge status={currentStatus} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <PrintableOrderSlip
              order={order}
              triggerButton={
                <button
                  type="button"
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer !min-h-0 flex items-center gap-1 text-xs font-bold border border-slate-700"
                  title="In phiếu xuất kho & giao hàng"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">In phiếu</span>
                </button>
              }
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors !min-h-0 cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Compact Status Segmented Bar (Horizontal Scroll on Mobile) */}
        <div className="bg-slate-50 dark:bg-slate-900/90 px-3.5 py-2 sm:px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trạng thái:
            </span>
            {msg && (
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                ✓ {msg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {STEPS.map((step) => {
              const isActive = currentStatus === step.status;
              const isCancelled = step.status === "CANCELLED";
              return (
                <button
                  key={step.status}
                  type="button"
                  disabled={loading}
                  onClick={() => handleStatusChange(step.status)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer !min-h-0 border ${
                    isActive
                      ? isCancelled
                        ? "bg-red-600 text-white border-red-600 shadow-2xs"
                        : "bg-[#075FA8] text-white border-[#075FA8] shadow-2xs font-extrabold"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Main Body: Optimized for Mobile & Desktop with Pure Dark Mode support */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
            {/* LEFT: Ordered Products List & Payment Summary (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Product Box */}
              <div className="bg-white dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-750 overflow-hidden">
                <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <Package className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                    <span>Sản phẩm ({order.items.length})</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {totalQuantity} món
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-60 sm:max-h-72 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-2.5 sm:p-3 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600">
                        <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.productName}
                        </h4>
                        {item.variantLabel && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[10px] font-bold rounded">
                            Quy cách: {item.variantLabel}
                          </span>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {formatCurrency(item.price)} × <strong className="text-slate-900 dark:text-white">{item.quantity}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Tạm tính ({totalQuantity} món):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Miễn phí nội thành / Thỏa thuận</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">Tổng tiền:</span>
                  <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Customer, Shipping & Payment (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Customer Box */}
              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                    <span>Khách hàng</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {order.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {order.customerEmail || "Chưa có email"}
                    </p>
                  </div>
                </div>

                <div className="pt-0.5">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {order.customerPhone}</span>
                  </a>
                </div>
              </div>

              {/* Delivery Box */}
              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
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
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}>
                    {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
                  </span>
                </div>

                <div className="text-xs space-y-1.5">
                  {order.shippingMethod === "DELIVERY" && order.address ? (
                    <div className="flex items-start gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] italic">
                      Khách đến kho 400 Phạm Hùng, Đà Nẵng nhận hàng.
                    </div>
                  )}

                  {order.note && (
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px]">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Ghi chú: {order.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <CreditCard className="w-3 h-3 text-slate-500" />
                  <span>Hình thức:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                  Tiền mặt khi giao hàng (COD)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
