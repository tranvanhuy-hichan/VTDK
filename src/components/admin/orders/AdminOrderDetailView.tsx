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
  const [copied, setCopied] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(-2);

  return (
    <div className="w-full py-2 px-1 sm:px-2 space-y-4 text-left max-w-7xl mx-auto pb-16">
      {/* Top Header Navigation (Identical style to ProductForm and other Admin pages) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5 transition-colors">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors shrink-0 !min-h-0 border border-slate-200 dark:border-slate-700"
            title="Quay lại danh sách đơn hàng"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <span className="text-xs font-bold text-[#075FA8] dark:text-blue-400 uppercase tracking-wider block">
              CHI TIẾT ĐƠN HÀNG
            </span>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                #{order.orderCode}
              </h1>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0"
                title="Sao chép mã đơn"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <OrderStatusBadge status={currentStatus} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer !min-h-0"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi {order.customerPhone}</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer !min-h-0"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In đơn</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Bar Card */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Trạng thái đơn hàng:
          </span>
          {msg && (
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 animate-in fade-in">
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
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer !min-h-0 border ${
                  isActive
                    ? isCancelled
                      ? "bg-red-600 text-white border-red-600 shadow-2xs"
                      : "bg-[#075FA8] dark:bg-blue-600 text-white border-[#075FA8] dark:border-blue-600 shadow-2xs font-black"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Grid (Left: 7 cols Products & Financials, Right: 5 cols Customer & Shipping) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* LEFT COLUMN: Ordered Products List & Payment Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Product Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Sản phẩm ({order.items.length})</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {totalQuantity} món
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 sm:p-3.5 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.productName}
                    </h4>
                    {item.variantLabel && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[10px] font-bold rounded border border-blue-100 dark:border-blue-900">
                        Quy cách: {item.variantLabel}
                      </span>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
          </div>

          {/* Financial Calculation Breakdown Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Tạm tính ({totalQuantity} món):</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy tại kho)" : "Miễn phí nội thành / Thỏa thuận"}
              </span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">Tổng tiền:</span>
              <span className="text-base sm:text-xl font-black text-orange-600 dark:text-orange-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer, Shipping & Payment (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Box Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <User className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Khách hàng</span>
              </div>
              <span className="text-[11px] text-slate-400">{formatDate(order.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {order.customerName}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                  {order.customerEmail || "Chưa có email"}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.customerPhone}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi {order.customerPhone}</span>
            </a>
          </div>

          {/* Delivery Box Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>Giao nhận</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="text-xs space-y-2">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="flex items-start justify-between gap-1.5 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                  <div className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
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
                <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs italic">
                  Khách đến kho 400 Phạm Hùng, Đà Nẵng nhận hàng.
                </div>
              )}

              {order.note && (
                <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-900">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Ghi chú: {order.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Badge Card */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Hình thức:</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              Tiền mặt khi giao hàng (COD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
