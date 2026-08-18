"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Wrench,
  ImageIcon,
  Building2,
  Plus,
  ExternalLink,
  Layers,
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Globe,
  Sparkles,
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
    totalGalleryImages: number;
  };
  company: CompanyContact;
  recentProducts: Product[];
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  stats,
  company,
  recentProducts,
}) => {
  return (
    <div className="w-full space-y-6 text-left">
      {/* 1. Welcome Executive Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#075FA8] to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hệ thống Quản trị Đông Kha 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Chào mừng trở lại, Quản trị viên 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Tổng quan hoạt động sản phẩm, giải pháp kỹ thuật và thông tin liên hệ công ty {company.name}.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#075FA8] hover:bg-blue-50 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer !min-h-0"
            >
              <Globe className="w-4 h-4" />
              <span>Xem trang Khách hàng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Decorative ambient background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products Stat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Sản phẩm
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalProducts}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">🟢 {stats.activeProducts} hiển thị</span>
              <span>•</span>
              <span className="text-slate-400">⚪ {stats.inactiveProducts} ẩn</span>
            </div>
          </div>
        </div>

        {/* Total Services Stat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Giải pháp kỹ thuật
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalServices}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Dịch vụ thi công cơ điện lạnh
            </div>
          </div>
        </div>

        {/* Gallery Images Stat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Thư viện ảnh
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalGalleryImages}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Hình ảnh thực tế dự án
            </div>
          </div>
        </div>

        {/* Categories Stat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Danh mục sản phẩm
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalCategories}
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Phân loại vật tư thiết bị
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
          Lối tắt thao tác nhanh
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/products/new"
            className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-100 dark:border-blue-800/60 text-[#075FA8] dark:text-blue-300 font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#075FA8] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Thêm sản phẩm</span>
          </Link>

          <Link
            href="/admin/products"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <span>Quản lý sản phẩm</span>
          </Link>

          <Link
            href="/admin/services"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
            <span>Quản lý giải pháp</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>Bộ sưu tập ảnh</span>
          </Link>

          <Link
            href="/admin/company"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <span>Thông tin công ty</span>
          </Link>
        </div>
      </div>

      {/* 4. Customer Content Preview Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Recent Products Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Sản phẩm vừa cập nhật
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                Các sản phẩm mới nhất đang phân phối trên hệ thống
              </p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-blue-300 transition-colors"
            >
              <span>Xem tất cả ({stats.totalProducts})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[9px] font-bold bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 px-1.5 py-0.5 rounded mb-0.5">
                    {p.category.name}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h4>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-200 mt-1">
                    {p.price > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Company Live Info Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Thông tin công ty
            </h3>
            <Link
              href="/admin/company"
              className="text-xs font-extrabold text-[#075FA8] dark:text-blue-400 hover:underline"
            >
              Chỉnh sửa
            </Link>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">{company.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="font-medium text-slate-600 dark:text-slate-300 leading-snug">{company.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-black text-slate-900 dark:text-white">{company.hotline}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-medium text-slate-600 dark:text-slate-300">{company.workingHours}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Website Status:</span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Đang hoạt động</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
