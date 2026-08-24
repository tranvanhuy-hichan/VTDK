"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Wrench,
  Building2,
  Plus,
  Layers,
  ArrowRight,
  Phone,
  MapPin,
  ShoppingBag,
  Store,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  active: boolean;
  category: Category;
  createdAt: Date;
}

interface AdminDashboardHomeProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalCategories: number;
    totalServices: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  company: CompanyContact;
  recentProducts: Product[];
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  stats,
  company,
  recentProducts,
}) => {
  const activePercent = stats.totalProducts > 0 
    ? Math.round((stats.activeProducts / stats.totalProducts) * 100) 
    : 100;

  return (
    <div className="w-full space-y-4 text-left">
      {/* 1. Compact Executive Banner With Company Name Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#06182e] via-[#074b80] to-[#0a2542] rounded-2xl p-4 sm:p-5 text-white shadow-md border border-blue-900/40">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                {company.name}
              </span>
              <span className="text-[9px] font-black uppercase text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded-full border border-cyan-800/60 shrink-0">
                ADMIN
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Bảng Điều Khiển Quản Trị
            </h1>

            <p className="text-xs text-blue-100/80 font-medium">
              Quản lý kho vật tư điện lạnh &amp; kiểm tra đơn hàng trực tuyến.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm sản phẩm</span>
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer !min-h-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
              <span>Xem đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Clean 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Revenue (Doanh thu) */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg dark:hover:shadow-amber-950/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800">
              Doanh thu
            </span>
          </div>

          <div className="mt-2.5 space-y-0.5">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
              {stats.totalRevenue > 0 ? `${stats.totalRevenue.toLocaleString("vi-VN")} ₫` : "0 ₫"}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Tổng doanh số đơn hàng
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Từ <strong className="text-slate-800 dark:text-slate-200">{stats.totalOrders}</strong> đơn</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:underline">Chi tiết ➔</span>
          </div>
        </Link>

        {/* Metric 2: Total Orders (Đơn hàng) */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg dark:hover:shadow-emerald-950/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
              stats.pendingOrders > 0
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse"
                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800"
            }`}>
              {stats.pendingOrders > 0 ? `${stats.pendingOrders} Chờ duyệt` : "Đã xử lý"}
            </span>
          </div>

          <div className="mt-2.5 space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalOrders}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Tổng số đơn đặt hàng
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Chờ duyệt: <strong className="text-amber-600 dark:text-amber-400">{stats.pendingOrders}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">Xem ngay ➔</span>
          </div>
        </Link>

        {/* Metric 3: Total Products (Kho hàng) */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg dark:hover:shadow-blue-950/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#075FA8] dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              {activePercent}% Bán
            </span>
          </div>

          <div className="mt-2.5 space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalProducts}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Sản phẩm trong kho
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Đang bán: <strong className="text-emerald-600 dark:text-emerald-400">{stats.activeProducts}</strong></span>
            <span>Ẩn: <strong className="text-slate-400">{stats.inactiveProducts}</strong></span>
          </div>
        </Link>

        {/* Metric 4: Product Categories (Danh mục vật tư) */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg dark:hover:shadow-cyan-950/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
              Chuyên ngành
            </span>
          </div>

          <div className="mt-2.5 space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalCategories}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Danh mục phân loại vật tư
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[10px] font-semibold text-cyan-700 dark:text-cyan-400">
            <TrendingUp className="w-3 h-3" />
            <span>Ống đồng, Gas &amp; Bo mạch</span>
          </div>
        </Link>
      </div>

      {/* 3. Compact Activity Hub: Recent Products & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Recent Products List (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <span>Sản phẩm mới cập nhật</span>
              </h2>
            </div>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1.5">
              <Package className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs font-bold">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="py-2 flex items-center justify-between gap-2.5 group hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-1.5 px-1.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 shrink-0 overflow-hidden">
                      <img
                        src={p.image || "/images/placeholder.png"}
                        alt={p.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.category.name}
                        </span>
                        <span className="text-xs font-black text-[#075FA8] dark:text-blue-400">
                          {p.price > 0 ? `${p.price.toLocaleString("vi-VN")} ₫` : "Liên hệ"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        p.active
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {p.active ? "Bán" : "Ẩn"}
                    </span>

                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0"
                      title="Chỉnh sửa"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Shortcuts & Warehouse Status (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-2.5">
            <h2 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Thao tác nhanh
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/products/new"
                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-900/60 text-left transition-all space-y-0.5 group cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-[#075FA8] text-white w-fit shadow-2xs group-hover:scale-110 transition-transform">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Thêm sản phẩm</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">Đăng linh kiện mới</div>
              </Link>

              <Link
                href="/admin/orders"
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-900/60 text-left transition-all space-y-0.5 group cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-emerald-600 text-white w-fit shadow-2xs group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Đơn hàng</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">Kiểm tra đơn mới</div>
              </Link>

              <Link
                href="/admin/company"
                className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-100 dark:border-amber-900/60 text-left transition-all space-y-0.5 group cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-amber-600 text-white w-fit shadow-2xs group-hover:scale-110 transition-transform">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Công ty</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">Hotline &amp; Kho bãi</div>
              </Link>

              <Link
                href="/admin/services"
                className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-100 dark:border-cyan-900/60 text-left transition-all space-y-0.5 group cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-cyan-600 text-white w-fit shadow-2xs group-hover:scale-110 transition-transform">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Giải pháp</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">Dịch vụ cơ điện</div>
              </Link>
            </div>
          </div>

          {/* Warehouse & Hotline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kho bãi &amp; Pháp nhân</span>
              </h2>
              <Link
                href="/admin/company"
                className="text-[10px] font-bold text-[#075FA8] dark:text-blue-400 hover:underline"
              >
                Sửa
              </Link>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="font-extrabold text-slate-900 dark:text-white">{company.name}</span>
              </div>

              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{company.address}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{company.hotline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
