"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
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
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { adminUpdateOrderStatusAction } from "@/actions/orderActions";
import { formatCurrency, formatDate } from "@/lib/format";

interface AdminOrderDetailViewProps {
  initialOrder: OrderDetail;
}

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
    <div className="w-full text-left max-w-6xl mx-auto space-y-3 pb-16 px-1 sm:px-2">
      {/* 1. Standard In-Page Breadcrumb & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/admin/orders" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
            Đơn hàng
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            #{order.orderCode}
          </span>
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Phone className="w-3 h-3" />
            <span>Gọi khách</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs"
          >
            <Printer className="w-3 h-3 text-slate-500" />
            <span>In</span>
          </button>
        </div>
      </div>

      {/* 2. Ultra-Compact Status & Order Bar (Saves 150px height!) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-3.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Code, Copy & Meta */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
              #{order.orderCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0"
              title="Sao chép mã đơn"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(order.createdAt)}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline truncate">
              {order.customerName}
            </span>
          </div>

          {/* Inline Compact Status Switcher & Price */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Status Dropdown Selector */}
            <div className="relative">
              <select
                value={currentStatus}
                disabled={loading}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className={`appearance-none font-bold text-xs px-2.5 py-1 pr-6 rounded-lg cursor-pointer border transition-all focus:outline-none disabled:opacity-50 ${
                  currentStatus === "PENDING"
                    ? "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                    : currentStatus === "CONFIRMED"
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                    : currentStatus === "SHIPPING"
                    ? "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800"
                    : currentStatus === "COMPLETED"
                    ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                }`}
              >
                <option value="PENDING">🟡 Chờ xử lý</option>
                <option value="CONFIRMED">🔵 Đã xác nhận</option>
                <option value="SHIPPING">🟣 Đang giao</option>
                <option value="COMPLETED">🟢 Hoàn thành</option>
                <option value="CANCELLED">🔴 Đã hủy</option>
              </select>
              <ChevronDown className="w-3 h-3 text-current absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* Total Price */}
            <span className="font-black text-sm sm:text-base text-[#075FA8] dark:text-blue-400">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Update feedback */}
        {msg && (
          <div className="mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}
      </div>

      {/* 3. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-start">
        {/* LEFT: Products & Payment Summary (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Package className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Sản phẩm ({order.items.length})</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {totalQuantity} món
            </span>
          </div>

          {/* Product Items */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="p-3 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                  <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {item.productName}
                  </h4>
                  {item.variantLabel && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[10px] font-bold rounded">
                      {item.variantLabel}
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

          {/* Financial summary footer */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-200/90 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Tạm tính:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {order.shippingMethod === "STORE_PICKUP" ? "0 ₫ (Lấy tại kho)" : "Miễn phí / Thỏa thuận"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white">Tổng tiền:</span>
              <span className="text-base font-black text-orange-600 dark:text-orange-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Customer & Shipping (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Customer info card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-2xs space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Khách hàng</span>
            </div>

            <div className="space-y-0.5 pt-0.5">
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
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
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white shrink-0"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-2.5 shadow-2xs flex items-center justify-between text-xs">
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
    </div>
  );
};
