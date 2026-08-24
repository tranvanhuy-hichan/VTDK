"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Truck,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  User,
  Package,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Receipt,
  ArrowRight,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "../../../types/order";
import { OrderStatusBadge } from "../../order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "../../../actions/orderActions";
import { formatCurrency, formatDate } from "../../../lib/format";

interface AdminOrderDetailModalProps {
  order: OrderDetail;
  onClose: () => void;
  onStatusUpdated: (orderId: string, newStatus: OrderStatus) => void;
}

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "PENDING", label: "Chờ xử lý", icon: "1" },
  { status: "CONFIRMED", label: "Đã xác nhận", icon: "2" },
  { status: "SHIPPING", label: "Đang giao hàng", icon: "3" },
  { status: "COMPLETED", label: "Đã hoàn thành", icon: "4" },
  { status: "CANCELLED", label: "Đã hủy đơn", icon: "✕" },
];

const STATUS_HINTS: Record<OrderStatus, string> = {
  PENDING: "Đơn hàng mới tạo từ website, cần liên hệ khách hàng để xác nhận.",
  CONFIRMED: "Đã xác nhận đơn và kiểm tra đủ linh kiện/ống đồng trong kho.",
  SHIPPING: "Hàng đã xuất kho và đang trên đường giao đến địa chỉ khách hàng.",
  COMPLETED: "Khách đã nhận hàng và hoàn tất thanh toán tiền mặt/chuyển khoản.",
  CANCELLED: "Đơn hàng đã bị hủy bỏ theo yêu cầu của khách hoặc lý do khác.",
};

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
      setMsg("Đã cập nhật trạng thái!");
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg(res.error || "Không thể cập nhật.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Helper for customer avatar initials
  const initials = (order.customerName || "K")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(-2);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 text-left overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header: Sleek & Compact */}
        <div className="bg-slate-900 text-white px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đơn hàng
            </span>
            <span className="font-mono text-sm sm:text-base font-black text-white px-2.5 py-0.5 bg-slate-800 rounded-lg border border-slate-700 inline-flex items-center gap-1.5">
              {order.orderCode}
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 hover:bg-slate-700 rounded-md transition-colors cursor-pointer !min-h-0"
                title="Sao chép mã đơn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </span>
            <OrderStatusBadge status={currentStatus} />
            <span className="text-xs text-slate-400 hidden md:inline">
              • Đặt lúc {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer !min-h-0 flex items-center gap-1.5 text-xs font-bold border border-slate-700"
              title="In đơn hàng"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In đơn</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors !min-h-0 cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Status Timeline (Compact Segmented Stepper) */}
        <div className="bg-slate-50 dark:bg-slate-850/80 px-5 py-3 sm:px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trạng thái xử lý:
            </span>
            {msg && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                ✓ {msg}
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
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer !min-h-0 flex items-center justify-center gap-1.5 border ${
                    isActive
                      ? isCancelled
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-[#075FA8] text-white border-[#075FA8] shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            💡 {STATUS_HINTS[currentStatus]}
          </p>
        </div>

        {/* 3. Main Content: Balanced 2-Column Layout */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Products & Payment Summary (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                    <span>Sản phẩm ({order.items.length})</span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {totalQuantity} món
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center gap-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="relative w-13 h-13 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                        <Image src={item.image} alt={item.productName} fill sizes="52px" className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.productName}
                        </h4>
                        {item.variantLabel && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 text-[11px] font-bold rounded-md">
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
              <div className="p-4 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Tạm tính ({totalQuantity} sản phẩm):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Miễn phí nội thành / Thỏa thuận</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
                  <span className="font-black text-slate-900 dark:text-white">Tổng thanh toán:</span>
                  <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Customer, Shipping & Payment (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Customer Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <User className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                    <span>Khách hàng</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Đã đăng ký</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {order.customerEmail || "Chưa có email"}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {order.customerPhone}</span>
                  </a>
                </div>
              </div>

              {/* Delivery Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    {order.shippingMethod === "DELIVERY" ? (
                      <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>Giao nhận</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    order.shippingMethod === "DELIVERY"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}>
                    {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  {order.shippingMethod === "DELIVERY" && order.address ? (
                    <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{order.address}</span>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs italic">
                      Khách đến kho 400 Phạm Hùng, Hòa Xuân, Đà Nẵng nhận hàng.
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
              <div className="p-3 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Thanh toán:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
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
