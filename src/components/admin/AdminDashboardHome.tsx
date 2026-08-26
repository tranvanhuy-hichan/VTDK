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
  BarChart3,
  Store,
  Plus,
} from "lucide-react";
import type { OrderStatus } from "../../types/order";
import type { CompanyContact } from "../../lib/company";
import { OrderStatusBadge } from "../order/OrderStatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";
import { Button, Badge } from "@/components/ui";

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
  customerPhone?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string | Date;
  itemCount?: number;
  itemsCount?: number;
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
    <div className="space-y-3 sm:space-y-3.5 text-left animate-in fade-in duration-200">
      {/* 1. Header Banner - Tinh gọn, đồng bộ với trang Báo Cáo */}
      <div className="rounded-xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-3 sm:p-3.5 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-cyan-200">
              <Building2 className="w-3 h-3" />
              <span>{displayCompanyName}</span>
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
              Bảng Điều Khiển Quản Trị
            </h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {company?.enablePosModule !== false && (
              <Button
                variant="primary"
                size="sm"
                href="/admin/pos"
                leftIcon={<Store className="w-3.5 h-3.5 text-slate-900" />}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold shadow-xs"
              >
                Bán Tại Quầy (POS)
              </Button>
            )}

            <Button
              variant="success"
              size="sm"
              href="/admin/analytics"
              leftIcon={<BarChart3 className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              Báo cáo doanh thu
            </Button>

            <Button
              variant="secondary"
              size="sm"
              href="/admin/products/new"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-white hover:bg-slate-100 text-[#075FA8] font-bold border-transparent"
            >
              Thêm sản phẩm
            </Button>

            <Button
              variant="outline"
              size="sm"
              href="/admin/orders"
              leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Quản lý đơn
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Stats - Micro KPI Cards Đồng Bộ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* Doanh thu */}
        <Link
          href="/admin/analytics"
          className="group bg-white dark:bg-slate-900 rounded-xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Doanh thu
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 tracking-tight truncate">
            {stats.totalRevenue > 0 ? `${stats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
            <span>Chi tiết báo cáo</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Đơn hàng */}
        <Link
          href="/admin/orders"
          className="group bg-white dark:bg-slate-900 rounded-xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Đơn hàng
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalOrders} <span className="text-[11px] font-semibold text-slate-400">đơn</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
            <span>
              {stats.pendingOrders > 0 ? (
                <strong className="text-amber-600 dark:text-amber-400">{stats.pendingOrders} chờ duyệt</strong>
              ) : (
                "Đã hoàn tất"
              )}
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Sản phẩm */}
        <Link
          href="/admin/products"
          className="group bg-white dark:bg-slate-900 rounded-xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sản phẩm
            </span>
            <div className="w-6 h-6 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalProducts} <span className="text-[11px] font-semibold text-slate-400">mặt hàng</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
            <span>Đang bán: {stats.activeProducts}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Danh mục */}
        <Link
          href="/admin/products"
          className="group bg-white dark:bg-slate-900 rounded-xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Danh mục
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalCategories} <span className="text-[11px] font-semibold text-slate-400">nhóm</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
            <span>Phân loại vật tư</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* 3. Phần dưới: Đơn Hàng Gần Đây & Thao tác nhanh gọn gàng */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Bảng Đơn Hàng Mới Nhất (8 cột) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
          {/* Header Bảng */}
          <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Đơn Hàng Gần Đây
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="text-[11px] font-bold text-[#075FA8] dark:text-blue-400 hover:underline flex items-center gap-0.5 !min-h-0"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Chưa có đơn hàng nào trong hệ thống.
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="p-2.5 sm:p-3 flex flex-col gap-1 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group !min-h-0"
                >
                  {/* Hàng 1: Tên khách hàng & Số tiền */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                        {order.customerName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-semibold shrink-0">
                        #{order.orderCode}
                      </span>
                    </div>

                    <div className="text-xs font-black text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>

                  {/* Hàng 2: Chi tiết phụ & Badge trạng thái */}
                  <div className="flex items-center justify-between gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      {order.customerPhone && (
                        <>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{order.customerPhone}</span>
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>{(order as any).itemsCount ?? (order as any).itemCount ?? 1} món</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="shrink-0 scale-90 origin-right">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Lối Tắt Nhanh & Tiện Ích Quản Trị (4 cột) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Lối tắt quản lý */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-2xs space-y-2">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              LỐI TẮT QUẢN TRỊ
            </h3>

            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/admin/products/new"
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1 group border border-slate-100 dark:border-slate-800 !min-h-0"
              >
                <PlusCircle className="w-4 h-4 text-[#075FA8] group-hover:text-white transition-colors" />
                <span>Thêm vật tư</span>
              </Link>

              <Link
                href="/admin/orders"
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1 group border border-slate-100 dark:border-slate-800 !min-h-0"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                <span>Duyệt đơn hàng</span>
              </Link>

              <Link
                href="/admin/gallery"
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1 group border border-slate-100 dark:border-slate-800 !min-h-0"
              >
                <ImageIcon className="w-4 h-4 text-cyan-600 group-hover:text-white transition-colors" />
                <span>Thư viện ảnh</span>
              </Link>

              <Link
                href="/admin/company"
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1 group border border-slate-100 dark:border-slate-800 !min-h-0"
              >
                <Building2 className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                <span>Cài đặt công ty</span>
              </Link>
            </div>
          </div>

          {/* Hotline & Trợ giúp nhanh */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/60 dark:to-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Hệ Thống Sẵn Sàng
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Mọi cập nhật sản phẩm & đơn hàng sẽ đồng bộ ngay lập tức đến ứng dụng và website khách hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
