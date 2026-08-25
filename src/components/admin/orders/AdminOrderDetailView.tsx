"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
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
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";

interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Chờ xử lý" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
  { status: "SHIPPING", label: "Đang giao" },
  { status: "COMPLETED", label: "Hoàn thành" },
  { status: "CANCELLED", label: "Đã hủy" },
];

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({ initialOrder }) => {
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder.status);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAddress = () => {
    if (!order.address) return;
    navigator.clipboard.writeText(order.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus || loading) return;
    setLoading(true);
    setMsg(null);
    const res = await adminUpdateOrderStatusAction(order.id, newStatus);
    setLoading(false);
    if (res.success) {
      setCurrentStatus(newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setMsg("Đã cập nhật trạng thái!");
      setTimeout(() => setMsg(null), 2500);
    } else {
      setMsg(res.error || "Lỗi cập nhật.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full text-left max-w-6xl mx-auto space-y-3.5 sm:space-y-4 pb-16 px-1 sm:px-2">
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/90 dark:border-slate-800 shadow-2xs cursor-pointer !min-h-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Danh sách đơn hàng</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi khách</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer !min-h-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In đơn</span>
          </button>
        </div>
      </div>

      {/* 2. Unified Hero Order Card & Interactive Status Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
        {/* Top line: Code, date & Total */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-white">
                #{order.orderCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sao chép mã đơn"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <OrderStatusBadge status={currentStatus} />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Đặt ngày {formatDate(order.createdAt)} • Khách hàng: <strong className="text-slate-800 dark:text-slate-200 font-bold">{order.customerName}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 font-semibold block">Tổng thanh toán:</span>
            <span className="text-xl sm:text-2xl font-black text-[#075FA8] dark:text-blue-400">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Status segmented buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trạng thái đơn hàng:
            </span>
            {msg && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {msg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {STEPS.map((step) => {
              const isActive = currentStatus === step.status;
              const isCancelled = step.status === "CANCELLED";
              return (
                <button
                  key={step.status}
                  type="button"
                  disabled={loading}
                  onClick={() => handleStatusChange(step.status)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center transition-all border cursor-pointer !min-h-0 flex items-center justify-center gap-1.5 ${
                    isActive
                      ? isCancelled
                        ? "bg-red-600 text-white border-red-600 shadow-xs ring-2 ring-red-200 dark:ring-red-950 font-black"
                        : "bg-[#075FA8] dark:bg-blue-600 text-white border-[#075FA8] dark:border-blue-600 shadow-xs ring-2 ring-blue-200 dark:ring-blue-950 font-black"
                      : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700"
                  } ${isCancelled ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <span>{step.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Two Columns: Left (Products & Financials), Right (Customer & Shipping) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
        {/* LEFT COLUMN: Products & Payment Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Sản phẩm ({order.items.length})</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {totalQuantity} món
            </span>
          </div>

          {/* Product rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                  <Image src={item.image} alt={item.productName} fill sizes="56px" className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {item.productName}
                  </h4>
                  {item.variantLabel && (
                    <span className="inline-block mt-0.5 px-2 py-0.2 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[10px] sm:text-[11px] font-bold rounded border border-blue-100 dark:border-blue-900">
                      Quy cách: {item.variantLabel}
                    </span>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatCurrency(item.price)} × <strong className="text-slate-900 dark:text-white font-bold">{item.quantity}</strong>
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

          {/* Financial summary footer */}
          <div className="p-3.5 sm:p-4 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-200/90 dark:border-slate-800 space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Tạm tính:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy tại kho)" : "Miễn phí / Thỏa thuận"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">Tổng tiền:</span>
              <span className="text-base sm:text-xl font-black text-orange-600 dark:text-orange-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Shipping (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
          {/* Customer info card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                <span>Khách hàng</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {order.customerName}
              </p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <a href={`tel:${order.customerPhone}`} className="text-[#075FA8] dark:text-blue-400 font-bold hover:underline">
                  {order.customerPhone}
                </a>
              </p>
              {order.customerEmail && (
                <p className="text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Delivery info card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
                <span>Giao nhận</span>
              </div>
              <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="text-xs space-y-2">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="flex items-start justify-between gap-1.5 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <div className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="break-words font-medium">{order.address}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white shrink-0"
                    title="Sao chép địa chỉ"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <p className="text-slate-500 italic">Nhận trực tiếp tại kho 400 Phạm Hùng, Đà Nẵng.</p>
              )}

              {order.note && (
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-900">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Payment info card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Thanh toán:</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              Tiền mặt (COD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
