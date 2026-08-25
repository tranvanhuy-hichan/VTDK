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
  AlertCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";

interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
}

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "PENDING", label: "Chờ xử lý", desc: "Đơn mới đặt, chờ nhân viên xác nhận" },
  { status: "CONFIRMED", label: "Đã xác nhận", desc: "Đã gọi xác thực và chuẩn bị hàng" },
  { status: "SHIPPING", label: "Đang giao", desc: "Hàng đã xuất kho, đang vận chuyển" },
  { status: "COMPLETED", label: "Hoàn thành", desc: "Khách đã nhận hàng và thanh toán" },
  { status: "CANCELLED", label: "Đã hủy", desc: "Đơn hàng đã bị hủy hoặc trả hàng" },
];

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({ initialOrder }) => {
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder.status);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      setMsg("Đã cập nhật trạng thái đơn hàng thành công!");
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg(res.error || "Lỗi khi cập nhật trạng thái.");
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
    <div className="space-y-4 sm:space-y-6 text-left max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer !min-h-0 shrink-0 border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách đơn</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs sm:text-sm font-black text-white px-2.5 py-1 bg-[#075FA8] dark:bg-blue-600 rounded-lg inline-flex items-center gap-1.5 shadow-2xs shrink-0">
              #{order.orderCode}
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-0.5 hover:bg-white/20 rounded transition-colors cursor-pointer !min-h-0"
                title="Sao chép mã đơn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white/80" />}
              </button>
            </span>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer !min-h-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gọi khách:</span>
            <span>{order.customerPhone}</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer !min-h-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>In đơn</span>
          </button>
        </div>
      </div>

      {/* Status Stepper Management Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Tiến Trình & Trạng Thái Xử Lý</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn trạng thái tương ứng để cập nhật quy trình đóng gói và bàn giao
            </p>
          </div>

          {msg && (
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl animate-in fade-in flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{msg}</span>
            </div>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {STEPS.map((step) => {
            const isActive = currentStatus === step.status;
            const isCancelled = step.status === "CANCELLED";
            return (
              <button
                key={step.status}
                type="button"
                disabled={loading}
                onClick={() => handleStatusChange(step.status)}
                className={`p-3 rounded-xl sm:rounded-2xl text-left transition-all border cursor-pointer !min-h-0 flex flex-col justify-between ${
                  isActive
                    ? isCancelled
                      ? "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300 dark:ring-red-900"
                      : "bg-[#075FA8] dark:bg-blue-600 text-white border-[#075FA8] dark:border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-blue-900"
                    : "bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-black ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {step.label}
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                </div>
                <p className={`text-[10px] mt-1 line-clamp-2 leading-tight ${isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full-Screen 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* LEFT COLUMN: Products & Payment (7 or 8 Cols) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Ordered Products Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Danh sách mặt hàng đã đặt ({order.items.length})</span>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Tổng cộng: {totalQuantity} sản phẩm
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.productName}
                    </h4>

                    {item.variantLabel && (
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[11px] font-bold rounded-md border border-blue-100 dark:border-blue-900">
                          Quy cách / Phân loại: {item.variantLabel}
                        </span>
                      </div>
                    )}

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Đơn giá: <strong className="text-slate-700 dark:text-slate-300 font-bold">{formatCurrency(item.price)}</strong></span>
                      <span>×</span>
                      <span>Số lượng: <strong className="text-slate-900 dark:text-white font-extrabold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">{item.quantity}</strong></span>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <CreditCard className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Tổng Kết Tài Chính Đơn Hàng</span>
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Tạm tính hàng hóa ({totalQuantity} món):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Phí vận chuyển giao hàng:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy tại kho)" : "Miễn phí nội thành / Thỏa thuận"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Chiết khấu / Giảm giá:</span>
                <span className="font-bold text-slate-400">0 ₫</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base block">
                    TỔNG TIỀN THANH TOÁN:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    (Giá đã bao gồm chiết khấu và hỗ trợ giao hàng)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer, Shipping & Warehouse Info (4 or 5 Cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          {/* Customer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                <User className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Thông Tin Khách Hàng</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#075FA8] to-blue-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {order.customerName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {order.customerEmail || "Khách hàng không cung cấp email"}
                </p>
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <a
                href={`tel:${order.customerPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-2xs"
              >
                <Phone className="w-4 h-4" />
                <span>Bấm gọi: {order.customerPhone}</span>
              </a>
            </div>
          </div>

          {/* Shipping & Delivery Address Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>Hình Thức Giao Nhận</span>
              </div>

              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  <MapPin className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Địa chỉ nhận hàng:</span>
                    <span>{order.address}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  <span className="font-bold block mb-0.5">Nhận trực tiếp tại kho:</span>
                  <span>400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng</span>
                </div>
              )}

              {order.note && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900">
                  <FileText className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Ghi chú của khách:</span>
                    <span>{order.note}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Badge Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#075FA8]" />
                <span>Phương thức thanh toán:</span>
              </span>
              <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Tiền mặt khi giao (COD)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời gian đặt:</span>
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
