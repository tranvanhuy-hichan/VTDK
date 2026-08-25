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
  ChevronRight,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";

interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
}

const STEPS: { status: OrderStatus; label: string; shortLabel: string; desc: string }[] = [
  { status: "PENDING", label: "Chờ xử lý", shortLabel: "Chờ xử lý", desc: "Đơn mới đặt, chờ xác nhận" },
  { status: "CONFIRMED", label: "Đã xác nhận", shortLabel: "Đã xác nhận", desc: "Đã gọi xác thực và chuẩn bị hàng" },
  { status: "SHIPPING", label: "Đang giao", shortLabel: "Đang giao", desc: "Hàng đã xuất kho, đang vận chuyển" },
  { status: "COMPLETED", label: "Hoàn thành", shortLabel: "Hoàn thành", desc: "Khách đã nhận hàng và thanh toán" },
  { status: "CANCELLED", label: "Đã hủy", shortLabel: "Đã hủy", desc: "Đơn hàng đã bị hủy hoặc trả lại" },
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
      setMsg("Đã cập nhật trạng thái đơn!");
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
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(-2);

  return (
    <div className="space-y-3 sm:space-y-5 text-left max-w-7xl mx-auto pb-16 px-0 sm:px-2">
      {/* 1. Header Bar: Fully Responsive across 320px - 1440px */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
        {/* Top Row / Left Info */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer !min-h-0 shrink-0 border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Danh sách đơn</span>
            <span className="xs:hidden">Đơn</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Order Code Pill & Badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-xs sm:text-sm font-black text-white px-2 py-1 sm:px-2.5 sm:py-1 bg-[#075FA8] dark:bg-blue-600 rounded-lg inline-flex items-center gap-1 shadow-2xs shrink-0">
              #{order.orderCode}
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-0.5 hover:bg-white/20 rounded transition-colors cursor-pointer !min-h-0"
                title="Sao chép mã đơn"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-white/80" />}
              </button>
            </span>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Action Buttons Row on Mobile / Right Group on Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <a
            href={`tel:${order.customerPhone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer !min-h-0"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Gọi {order.customerPhone}</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer !min-h-0 shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>In đơn</span>
          </button>
        </div>
      </div>

      {/* 2. Status Stepper Management Box: Horizontal Scroll & Tap on Mobile */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Trạng Thái Đơn Hàng</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Nhấp vào bước bên dưới để đổi trạng thái quy trình
            </p>
          </div>

          {msg && (
            <div className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl animate-in fade-in flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{msg}</span>
            </div>
          )}
        </div>

        {/* Stepper Buttons: Horizontal Scroll on Mobile, 5-col Grid on Desktop */}
        <div className="flex items-stretch gap-1.5 sm:grid sm:grid-cols-5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none pt-0.5 -mx-1 px-1">
          {STEPS.map((step) => {
            const isActive = currentStatus === step.status;
            const isCancelled = step.status === "CANCELLED";
            return (
              <button
                key={step.status}
                type="button"
                disabled={loading}
                onClick={() => handleStatusChange(step.status)}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-left transition-all border cursor-pointer !min-h-0 flex flex-col justify-between shrink-0 min-w-[130px] sm:min-w-0 ${
                  isActive
                    ? isCancelled
                      ? "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300 dark:ring-red-900"
                      : "bg-[#075FA8] dark:bg-blue-600 text-white border-[#075FA8] dark:border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-blue-900"
                    : "bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-black truncate ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>
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

      {/* 3. Main Full-Screen Layout: Stacks on Mobile, 2-Col on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
        {/* LEFT COLUMN: Products & Payment (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-5">
          {/* Ordered Products Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-3.5 py-3 sm:px-5 sm:py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white min-w-0">
                <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0" />
                <span className="truncate">Sản phẩm ({order.items.length})</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                {totalQuantity} món
              </span>
            </div>

            {/* Mobile & Desktop Optimized Item List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 sm:p-4 flex items-start sm:items-center gap-3 sm:gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Product Image Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 56px, 72px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {item.productName}
                    </h4>

                    {item.variantLabel && (
                      <span className="inline-block px-1.5 py-0.2 sm:px-2 sm:py-0.5 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[10px] sm:text-[11px] font-bold rounded border border-blue-100 dark:border-blue-900">
                        {item.variantLabel}
                      </span>
                    )}

                    <div className="flex flex-wrap items-center justify-between sm:justify-start gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>
                        {formatCurrency(item.price)} × <strong className="text-slate-900 dark:text-white font-extrabold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">{item.quantity}</strong>
                      </span>

                      {/* Mobile Total Subtotal */}
                      <span className="sm:hidden font-black text-xs text-[#075FA8] dark:text-blue-400">
                        = {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Subtotal */}
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 dark:text-white block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <CreditCard className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Tổng Kết Tài Chính</span>
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Tạm tính ({totalQuantity} sản phẩm):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">
                  {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy tại kho)" : "Miễn phí / Thỏa thuận"}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-xs sm:text-base block">
                    TỔNG THANH TOÁN:
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    COD khi giao hàng
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Shipping (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-5">
          {/* Customer Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                <User className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Khách Hàng</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#075FA8] to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  {order.customerName}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {order.customerEmail || "Không có email"}
                </p>
              </div>
            </div>

            <div className="pt-0.5">
              <a
                href={`tel:${order.customerPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-2xs active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay: {order.customerPhone}</span>
              </a>
            </div>
          </div>

          {/* Shipping & Delivery Address Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>Hình Thức Giao Nhận</span>
              </div>

              <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed font-medium space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 text-[#075FA8] dark:text-blue-400 font-bold text-[11px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>Địa chỉ nhận hàng:</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 p-0.5 cursor-pointer !min-h-0"
                      title="Sao chép địa chỉ"
                    >
                      {copiedAddress ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAddress ? "Đã chép" : "Chép"}</span>
                    </button>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium text-xs break-words">
                    {order.address}
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 sm:p-3 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  <span className="font-bold block mb-0.5 text-xs">Nhận trực tiếp tại kho:</span>
                  <span className="text-[11px] sm:text-xs">400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng</span>
                </div>
              )}

              {order.note && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
                    <span>Ghi chú từ khách:</span>
                  </div>
                  <p className="text-xs italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Timestamp Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#075FA8]" />
                <span>Thanh toán:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                Tiền mặt (COD)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời gian đặt:</span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

