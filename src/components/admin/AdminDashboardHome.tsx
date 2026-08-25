"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  PlusCircle,
  ShoppingBag,
  ChevronRight,
  DollarSign,
  Clock,
  User,
  Phone,
  ArrowUpRight,
  Building2,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import type { OrderStatus } from "../../types/order";
import type { CompanyContact } from "../../lib/company";
import { OrderStatusBadge } from "../order/OrderStatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface RecentOrderSummary {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}

interface AdminDashboardHomeProps {
  stats: DashboardStats;
  company?: CompanyContact;
  companyName?: string;
  recentProducts?: any[];
  recentOrders?: RecentOrderSummary[];
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  stats,
  company,
  companyName,
  recentOrders = [],
}) => {
  const displayCompanyName = company?.name || companyName || "CÔNG TY TNHH VẬT TƯ ĐÔNG KHA";

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* 1. Header Banner - Tinh gọn, sang trọng */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold tracking-wide uppercase text-cyan-200 border border-white/10">
              <Building2 className="w-3 h-3" />
              <span>{displayCompanyName}</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
              Bảng Điều Khiển Quản Trị
            </h1>
            <p className="text-xs text-blue-100/80 font-medium">
              Theo dõi doanh số, quản lý đơn hàng và vật tư điện lạnh hôm nay.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#075FA8] font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer !min-h-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm sản phẩm</span>
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/15 transition-all cursor-pointer !min-h-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
              <span>Quản lý đơn</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Stats - Basic, Clean, Không rườm rà */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Doanh thu */}
        <Link
          href="/admin/orders"
          className="group bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Doanh thu</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight truncate">
            {stats.totalRevenue > 0 ? `${stats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Tổng từ {stats.totalOrders} đơn</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Đơn hàng */}
        <Link
          href="/admin/orders"
          className="group bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Đơn hàng</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalOrders} <span className="text-xs font-semibold text-slate-400">đơn</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>
              {stats.pendingOrders > 0 ? (
                <strong className="text-amber-600 dark:text-amber-400">{stats.pendingOrders} chờ duyệt</strong>
              ) : (
                "Đã duyệt xong"
              )}
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Sản phẩm */}
        <Link
          href="/admin/products"
          className="group bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sản phẩm</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalProducts} <span className="text-xs font-semibold text-slate-400">mặt hàng</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Đang bán: {stats.activeProducts}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Danh mục */}
        <Link
          href="/admin/products"
          className="group bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Danh mục</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalCategories} <span className="text-xs font-semibold text-slate-400">nhóm</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Phân loại vật tư</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* 3. Phần dưới: Đơn Hàng Gần Đây & Thao tác nhanh được sắp xếp đẹp mắt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bảng Đơn Hàng Mới Nhất (8 cột) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Header Bảng */}
          <div className="px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#075FA8]/10 dark:bg-blue-500/20 text-[#075FA8] dark:text-blue-400 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Đơn Hàng Gần Đây
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Danh sách đơn hàng - Cân đối & Chuẩn tỷ lệ */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chưa có đơn hàng nào trong hệ thống.
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="p-3 sm:p-3.5 flex flex-col gap-1.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Hàng 1: Tên khách hàng & Số tiền */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                        {order.customerName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold shrink-0">
                        #{order.orderCode}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>

                  {/* Hàng 2: Chi tiết phụ & Badge trạng thái cân đối */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{order.customerPhone}</span>
                      </span>
                      <span>•</span>
                      <span>{order.itemCount} món</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="shrink-0 scale-90 sm:scale-100 origin-right">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Lối Tắt Nhanh & Tiện Ích Quản Trị (4 cột) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Lối tắt quản lý */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              LỐI TẮT QUẢN TRỊ
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/products/new"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-100 dark:border-slate-800"
              >
                <PlusCircle className="w-4 h-4 text-[#075FA8] group-hover:text-white transition-colors" />
                <span>Thêm vật tư</span>
              </Link>

              <Link
                href="/admin/orders"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-100 dark:border-slate-800"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                <span>Duyệt đơn hàng</span>
              </Link>

              <Link
                href="/admin/gallery"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-100 dark:border-slate-800"
              >
                <ImageIcon className="w-4 h-4 text-cyan-600 group-hover:text-white transition-colors" />
                <span>Thư viện ảnh</span>
              </Link>

              <Link
                href="/admin/company"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-100 dark:border-slate-800"
              >
                <Building2 className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                <span>Cài đặt công ty</span>
              </Link>
            </div>
          </div>

          {/* Hotline & Trợ giúp nhanh */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Hệ Thống Sẵn Sàng
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Mọi cập nhật sản phẩm & đơn hàng sẽ đồng bộ ngay lập tức đến ứng dụng và website khách hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
