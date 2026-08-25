"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  PlusCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
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
  recentProducts,
  recentOrders = [],
}) => {
  const displayCompanyName = company?.name || companyName || "CÔNG TY TNHH VẬT TƯ ĐÔNG KHA";

  const activePercent =
    stats.totalProducts > 0
      ? Math.round((stats.activeProducts / stats.totalProducts) * 100)
      : 100;

  return (
    <div className="space-y-3.5 sm:space-y-5 text-left">
      {/* 1. Compact Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#075FA8] via-[#083866] to-[#0B1F33] p-3.5 sm:p-5 text-white shadow-md border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-[10px] sm:text-xs font-black tracking-wide uppercase text-cyan-200 border border-white/10">
              <span>{displayCompanyName}</span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white">
              Bảng Điều Khiển Quản Trị
            </h1>
            <p className="text-xs text-slate-200/90 font-medium line-clamp-1">
              Tổng quan kinh doanh vật tư điện lạnh & đơn hàng hôm nay
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#075FA8] font-black text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer !min-h-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm sản phẩm</span>
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer !min-h-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
              <span>Xem đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Compact 2-Column Grid on Mobile, 4-Column on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Metric 1: Total Revenue (Doanh thu) */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800 shrink-0">
              Doanh thu
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="text-sm sm:text-xl lg:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
              {stats.totalRevenue > 0 ? `${stats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Doanh số thực tế
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Từ <strong className="text-slate-800 dark:text-slate-200">{stats.totalOrders}</strong> đơn</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:underline">Chi tiết ➔</span>
          </div>
        </Link>

        {/* Metric 2: Total Orders (Đơn hàng) */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className={`text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded border shrink-0 ${
              stats.pendingOrders > 0
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse"
                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800"
            }`}>
              {stats.pendingOrders > 0 ? `${stats.pendingOrders} Chờ duyệt` : "Đã xử lý"}
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalOrders} <span className="text-xs font-normal text-slate-400">đơn</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Tổng số đơn đặt
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Chờ: <strong className="text-amber-600 dark:text-amber-400">{stats.pendingOrders}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">Xem ngay ➔</span>
          </div>
        </Link>

        {/* Metric 3: Total Products (Kho hàng) */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 shrink-0">
              <Package className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-[#075FA8] dark:text-blue-300 border border-blue-100 dark:border-blue-800 shrink-0">
              {activePercent}% Bán
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalProducts} <span className="text-xs font-normal text-slate-400">mặt hàng</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Sản phẩm trong kho
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Bán: <strong className="text-emerald-600 dark:text-emerald-400">{stats.activeProducts}</strong></span>
            <span>Ẩn: <strong className="text-slate-400">{stats.inactiveProducts}</strong></span>
          </div>
        </Link>

        {/* Metric 4: Product Categories (Danh mục vật tư) */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800 shrink-0">
              Phân loại
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalCategories} <span className="text-xs font-normal text-slate-400">nhóm</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Danh mục vật tư
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 truncate">
            <span>Ống đồng, Gas, Bo...</span>
            <span>➔</span>
          </div>
        </Link>
      </div>

      {/* 3. Recent Orders & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
        {/* Recent Orders List (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#075FA8]/10 dark:bg-blue-500/20 text-[#075FA8] dark:text-blue-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Đơn Hàng Gần Đây
              </h3>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chưa có đơn hàng nào trong hệ thống.
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#075FA8] dark:text-blue-400 group-hover:underline">
                        #{order.orderCode}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {order.customerName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{order.customerPhone}</span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-400 hidden sm:inline">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {order.itemCount} món
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Links / Company Info (4 cols) */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lối Tắt Nhanh
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/products/new"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-200/80 dark:border-slate-700"
              >
                <PlusCircle className="w-4 h-4 text-[#075FA8] group-hover:text-white transition-colors" />
                <span>Thêm vật tư</span>
              </Link>

              <Link
                href="/admin/orders"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-200/80 dark:border-slate-700"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                <span>Duyệt đơn</span>
              </Link>

              <Link
                href="/admin/gallery"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-200/80 dark:border-slate-700"
              >
                <TrendingUp className="w-4 h-4 text-cyan-600 group-hover:text-white transition-colors" />
                <span>Hình thực tế</span>
              </Link>

              <Link
                href="/admin/company"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 group border border-slate-200/80 dark:border-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                <span>Cài đặt cty</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
