"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  Phone,
  Truck,
  Store,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Copy,
  Check,
  PackageCheck,
  MapPin,
  User,
  Mail,
  FileText,
  Home,
  ShieldCheck,
} from "lucide-react";
import type { OrderDetail } from "../../types/order";
import type { CompanyContact } from "../../lib/company";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";

interface OrderSuccessViewProps {
  order: OrderDetail;
  company: CompanyContact;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order, company }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-3.5 text-left">
        {/* Breadcrumb Navigation with Back Button */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 leading-none max-w-full">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer !min-h-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 font-normal shrink-0">|</span>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 leading-none shrink-0 min-w-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Trang chủ</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="inline-flex items-center font-extrabold text-slate-900 dark:text-white truncate">
              Đơn hàng {order.orderCode}
            </span>
          </nav>
        </div>

        {/* 1. Compact Hero Banner (Space-efficient & balanced) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B1F33] via-[#072444] to-[#075FA8] p-4 sm:p-5 lg:p-6 text-white shadow-lg border border-blue-900/40">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left Header Info (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đặt hàng thành công</span>
                </span>
                <span className="text-xs text-slate-300">• {formatDate(order.createdAt)}</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                Cảm ơn quý khách đã đặt hàng!
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                Đơn hàng đã chuyển tới bộ phận kho vận <strong>Vật Tư Điện Lạnh Đông Kha</strong>. Chúng tôi sẽ sớm liên hệ để giao hàng.
              </p>

              {/* Order Code & Status Pill */}
              <div className="pt-0.5 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl shadow-inner text-xs">
                  <span className="text-slate-300 font-medium">Mã đơn:</span>
                  <span className="font-mono font-black text-[#38BDF8]">
                    {order.orderCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-0.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer !min-h-0"
                    title="Sao chép mã đơn"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Right Progress Timeline Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase text-blue-200 tracking-wider block">
                Tiến trình xử lý đơn hàng
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {(() => {
                  const status = order.status;
                  let steps: { num: number; title: string; subtext: string; state: "done" | "active" | "pending" | "cancelled" }[];

                  if (status === "CANCELLED") {
                    steps = [
                      { num: 1, title: "Tiếp nhận", subtext: "Đã xong", state: "done" },
                      { num: 2, title: "Xác nhận", subtext: "Đã hủy", state: "cancelled" },
                      { num: 3, title: "Giao hàng", subtext: "Ngưng giao", state: "pending" },
                      { num: 4, title: "Hoàn tất", subtext: "Đã hủy", state: "pending" },
                    ];
                  } else if (status === "CONFIRMED") {
                    steps = [
                      { num: 1, title: "Tiếp nhận", subtext: "Đã xong", state: "done" },
                      { num: 2, title: "Xác nhận", subtext: "Đã xong", state: "done" },
                      { num: 3, title: "Giao hàng", subtext: "Chuẩn bị", state: "active" },
                      { num: 4, title: "Hoàn tất", subtext: "Thanh toán", state: "pending" },
                    ];
                  } else if (status === "SHIPPING") {
                    steps = [
                      { num: 1, title: "Tiếp nhận", subtext: "Đã xong", state: "done" },
                      { num: 2, title: "Xác nhận", subtext: "Đã xong", state: "done" },
                      { num: 3, title: "Giao hàng", subtext: "Đang giao", state: "active" },
                      { num: 4, title: "Hoàn tất", subtext: "Nhận hàng", state: "pending" },
                    ];
                  } else if (status === "COMPLETED") {
                    steps = [
                      { num: 1, title: "Tiếp nhận", subtext: "Đã xong", state: "done" },
                      { num: 2, title: "Xác nhận", subtext: "Đã xong", state: "done" },
                      { num: 3, title: "Giao hàng", subtext: "Đã giao", state: "done" },
                      { num: 4, title: "Hoàn tất", subtext: "Hoàn tất", state: "done" },
                    ];
                  } else {
                    // PENDING
                    steps = [
                      { num: 1, title: "Tiếp nhận", subtext: "Đã xong", state: "done" },
                      { num: 2, title: "Xác nhận", subtext: "Đang xử lý", state: "active" },
                      { num: 3, title: "Giao hàng", subtext: "Chờ xuất kho", state: "pending" },
                      { num: 4, title: "Hoàn tất", subtext: "Thanh toán", state: "pending" },
                    ];
                  }

                  return steps.map((s) => (
                    <div key={s.num} className={`space-y-1 ${s.state === "pending" ? "opacity-40" : ""}`}>
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                          s.state === "done"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : s.state === "active"
                            ? "bg-[#075FA8] border border-blue-300 text-white shadow-md ring-2 ring-blue-400/40"
                            : s.state === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {s.state === "done" ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : s.num}
                      </div>
                      <p className={`text-[10px] sm:text-[11px] font-bold ${
                        s.state === "done" ? "text-white" : s.state === "active" ? "text-blue-200" : s.state === "cancelled" ? "text-red-300" : "text-slate-400"
                      }`}>
                        {s.title}
                      </p>
                      <p className={`text-[8px] sm:text-[9px] ${
                        s.state === "done" ? "text-emerald-300 font-semibold" : s.state === "active" ? "text-blue-300 font-bold" : s.state === "cancelled" ? "text-red-400" : "text-slate-500"
                      }`}>
                        {s.subtext}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Full-Width 2-Column Content Layout (max-w-[1700px]) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Product List & Total Calculation (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-5 h-5 text-[#075FA8] dark:text-blue-400" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Danh sách sản phẩm ({order.items.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Thời gian đặt: {formatDate(order.createdAt)}
              </span>
            </div>

            {/* Product items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.productName}
                    </h4>
                    {item.variantLabel && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-md">
                        Quy cách: {item.variantLabel}
                      </span>
                    )}
                    <div className="text-xs text-slate-500 mt-1 font-medium">
                      Đơn giá: {formatCurrency(item.price)} × Số lượng: <strong>{item.quantity}</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation breakdown */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/60 dark:bg-slate-850/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span>Tạm tính ({order.items.reduce((acc, cur) => acc + cur.quantity, 0)} sản phẩm)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Miễn phí / Báo chi tiết theo km</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                <span className="text-base font-black text-slate-900 dark:text-white">Tổng thanh toán</span>
                <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Details & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Customer & Shipping Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Thông tin người nhận &amp; Giao nhận
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{order.customerName}</p>
                    <p className="text-slate-500 mt-0.5">SĐT: <strong className="text-slate-800 dark:text-slate-200 text-sm">{order.customerPhone}</strong></p>
                    {order.customerEmail && <p className="text-slate-500">{order.customerEmail}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {order.shippingMethod === "DELIVERY" ? (
                    <Truck className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                  ) : (
                    <Store className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {order.shippingMethod === "DELIVERY" ? "Giao hàng tận nơi" : "Nhận tại kho Đông Kha"}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {order.shippingMethod === "DELIVERY" ? order.address : company.address}
                    </p>
                  </div>
                </div>

                {order.note && (
                  <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="italic text-slate-500">
                      Ghi chú: &ldquo;{order.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Hotline Box */}
            <div className="bg-blue-50/90 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/80 p-4 sm:p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#075FA8] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Cần giao hàng hỏa tốc?</p>
                  <a
                    href={`tel:${company.hotline}`}
                    className="text-sm font-black text-[#075FA8] dark:text-blue-400 hover:underline"
                  >
                    Hotline: {company.hotline}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/tai-khoan/don-hang"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Xem đơn hàng của tôi</span>
              </Link>
              <Link
                href="/san-pham"
                className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm py-3 px-4 rounded-2xl transition-all cursor-pointer"
              >
                <span>Tiếp tục mua hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
