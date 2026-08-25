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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";

interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
}

const STEPS: { status: OrderStatus; stepNumber: number; title: string; desc: string }[] = [
  { status: "PENDING", stepNumber: 1, title: "Tiếp nhận đơn", desc: "Chờ xác thực đơn mới" },
  { status: "CONFIRMED", stepNumber: 2, title: "Đã xác nhận", desc: "Soạn hàng & đóng gói" },
  { status: "SHIPPING", stepNumber: 3, title: "Đang giao hàng", desc: "Xuất kho, đang vận chuyển" },
  { status: "COMPLETED", stepNumber: 4, title: "Hoàn tất", desc: "Đã giao & thanh toán" },
];

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({ initialOrder }) => {
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder.status);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
      setMsg({ text: `Đã chuyển đơn sang trạng thái "${getStatusLabel(newStatus)}"`, type: "success" });
      setTimeout(() => setMsg(null), 3500);
    } else {
      setMsg({ text: res.error || "Lỗi khi cập nhật trạng thái đơn.", type: "error" });
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy đơn";
      default:
        return status;
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

  // Status step index calculation
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "SHIPPING":
        return 2;
      case "COMPLETED":
        return 3;
      default:
        return -1;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="w-full py-2 px-1 sm:px-2 space-y-4 sm:space-y-5 text-left max-w-7xl mx-auto pb-16">
      {/* 1. Standard Admin Page Header (Consistent with ProductForm & Other Admin Pages) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5 transition-colors">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors shrink-0 !min-h-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
            title="Quay lại danh sách đơn hàng"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#075FA8] dark:text-blue-400 uppercase tracking-wider block">
                CHI TIẾT ĐƠN HÀNG
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                Đặt lúc {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                #{order.orderCode}
              </h1>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0"
                title="Sao chép mã đơn hàng"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <OrderStatusBadge status={currentStatus} />
            </div>
          </div>
        </div>

        {/* Action Buttons: Call Customer & Print Invoice */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-98"
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
            <span>In phiếu đơn</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Alert */}
      {msg && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in ${
            msg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 2. Interactive Order Workflow Stepper & Quick Status Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Quy trình xử lý đơn hàng</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chuyển bước tiến độ đơn hàng hoặc bấm vào trạng thái để cập nhật trực tiếp
            </p>
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trạng thái:</span>
            <select
              value={currentStatus}
              disabled={loading}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="px-3 py-1.5 rounded-xl border font-bold text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
            >
              <option value="PENDING">🟡 1. Chờ xử lý (Mới)</option>
              <option value="CONFIRMED">🔵 2. Đã xác nhận</option>
              <option value="SHIPPING">🟣 3. Đang giao hàng</option>
              <option value="COMPLETED">🟢 4. Hoàn thành</option>
              <option value="CANCELLED">🔴 5. Đã hủy đơn</option>
            </select>
          </div>
        </div>

        {/* Visual 4-Step Stepper */}
        {currentStatus === "CANCELLED" ? (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Đơn hàng này hiện đang ở trạng thái <strong>ĐÃ HỦY</strong>. Chọn trạng thái khác ở thanh chọn phía trên nếu muốn kích hoạt lại.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {STEPS.map((step, idx) => {
              const isPassed = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <button
                  key={step.status}
                  type="button"
                  disabled={loading}
                  onClick={() => handleStatusChange(step.status)}
                  className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer !min-h-0 flex flex-col justify-between ${
                    isCurrent
                      ? "bg-[#075FA8] dark:bg-blue-600 text-white border-[#075FA8] dark:border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-blue-900 font-bold"
                      : isPassed
                      ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black truncate">
                      {step.stepNumber}. {step.title}
                    </span>
                    {isPassed && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />}
                  </div>
                  <p className={`text-[10px] sm:text-[11px] mt-1 line-clamp-1 ${isCurrent ? "text-blue-100" : "text-slate-400"}`}>
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* LEFT COLUMN: Product Items & Financial Calculation (8 Cols) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          {/* Ordered Products Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0" />
                <span>Danh Sách Sản Phẩm Đặt Mua ({order.items.length})</span>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Tổng: {totalQuantity} món
              </span>
            </div>

            {/* Product Items Table / List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 56px, 64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Specs */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {item.productName}
                    </h4>

                    {item.variantLabel && (
                      <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[11px] font-bold rounded-md border border-blue-100 dark:border-blue-900">
                        {item.variantLabel}
                      </span>
                    )}

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>Đơn giá: {formatCurrency(item.price)}</span>
                      <span>•</span>
                      <span>Số lượng: <strong className="text-slate-900 dark:text-white font-bold">{item.quantity}</strong></span>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-black text-[#075FA8] dark:text-blue-400 block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary Integrated Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200/90 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Tạm tính ({totalQuantity} sản phẩm):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy trực tiếp tại kho)" : "Miễn phí / Thỏa thuận khi giao"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm block">
                    TỔNG TIỀN THANH TOÁN:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Thanh toán khi nhận hàng (COD)
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

        {/* RIGHT COLUMN: Customer, Shipping & Meta (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          {/* Customer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                <User className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Khách Hàng</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075FA8] to-blue-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {order.customerName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {order.customerEmail || "Không có email"}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.customerPhone}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#075FA8] hover:bg-[#0B1F33] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer !min-h-0 shadow-2xs active:scale-98"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi: {order.customerPhone}</span>
            </a>
          </div>

          {/* Shipping & Delivery Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {order.shippingMethod === "DELIVERY" ? (
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>Hình Thức Giao Nhận</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                order.shippingMethod === "DELIVERY"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {order.shippingMethod === "DELIVERY" ? "Giao tận nơi" : "Lấy tại kho"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {order.shippingMethod === "DELIVERY" && order.address ? (
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#075FA8] dark:text-blue-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Địa chỉ nhận hàng:</span>
                    </span>
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
                  <p className="text-slate-900 dark:text-white font-medium break-words leading-relaxed">
                    {order.address}
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-0.5">Địa chỉ kho lấy hàng:</span>
                  <span>400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng</span>
                </div>
              )}

              {order.note && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#075FA8]" />
                    <span>Ghi chú từ khách:</span>
                  </span>
                  <p className="italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Timestamps Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-[#075FA8]" />
                <span>Phương thức thanh toán:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Tiền mặt (COD)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời gian tạo đơn:</span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
