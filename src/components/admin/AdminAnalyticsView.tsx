"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  Layers,
  ChevronRight,
  RefreshCw,
  Award,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/format";
import { StockBadge } from "../common/StockBadge";
import {
  getAdminAnalyticsAction,
  type AnalyticsData,
} from "../../actions/analyticsActions";
import * as XLSX from "xlsx";
import { Button, Tabs, Badge, Card, CardHeader, CardTitle } from "@/components/ui";

interface AdminAnalyticsViewProps {
  initialData: AnalyticsData;
}

type TimeRangeKey = "7d" | "30d" | "this_month" | "last_month" | "all";

const TIME_RANGES: { key: TimeRangeKey; label: string }[] = [
  { key: "7d", label: "7 ngày" },
  { key: "30d", label: "30 ngày" },
  { key: "this_month", label: "Tháng này" },
  { key: "last_month", label: "Tháng trước" },
  { key: "all", label: "Toàn bộ" },
];

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ initialData }) => {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [currentRange, setCurrentRange] = useState<TimeRangeKey>(
    (initialData.timeRange as TimeRangeKey) || "30d"
  );
  const [isPending, startTransition] = useTransition();
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    label: string;
    revenue: number;
    orderCount: number;
  } | null>(null);

  const handleRangeChange = (range: string) => {
    const rangeKey = range as TimeRangeKey;
    setCurrentRange(rangeKey);
    startTransition(async () => {
      const res = await getAdminAnalyticsAction(rangeKey);
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  };

  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Tổng quan
      const summaryData = [
        ["BÁO CÁO DOANH THU & KINH DOANH - VẬT TƯ ĐIỆN LẠNH ĐÔNG KHA"],
        [`Khoảng thời gian: ${TIME_RANGES.find((r) => r.key === currentRange)?.label || currentRange}`],
        [`Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`],
        [],
        ["Chỉ Số", "Giá Trị", "Đơn Vị"],
        ["Tổng Doanh Thu", data.summary.totalRevenue, "VNĐ"],
        ["Doanh Thu Đã Hoàn Tất", data.summary.completedRevenue, "VNĐ"],
        ["Doanh Thu Chờ Xử Lý", data.summary.pendingRevenue, "VNĐ"],
        ["Tổng Số Đơn Hàng", data.summary.totalOrders, "Đơn"],
        ["Đơn Hàng Thành Công", data.summary.completedOrders, "Đơn"],
        ["Đơn Hàng Đã Hủy", data.summary.cancelledOrders, "Đơn"],
        ["Tỷ Lệ Hoàn Tất Đơn", `${data.summary.conversionRate}%`, "%"],
        ["Giá Trị Đơn Trung Bình (AOV)", data.summary.averageOrderValue, "VNĐ"],
        ["Tổng Số Sản Phẩm Xuất Kho", data.summary.totalItemsSold, "Món"],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Tong_Quan");

      // Sheet 2: Top Sản Phẩm Bán Chạy
      const topProductsData = [
        ["Hạng", "Tên Sản Phẩm", "Đơn Giá (VNĐ)", "Số Lượng Đã Bán", "Doanh Thu (VNĐ)"],
        ...data.topProducts.map((p, idx) => [
          idx + 1,
          p.productName,
          p.price,
          p.totalQty,
          p.totalRevenue,
        ]),
      ];
      const wsTop = XLSX.utils.aoa_to_sheet(topProductsData);
      XLSX.utils.book_append_sheet(wb, wsTop, "Top_SanPham_BanChay");

      // Sheet 3: Danh Mục
      const categoryData = [
        ["Danh Mục Sản Phẩm", "Doanh Thu (VNĐ)", "Số Lượng Bán", "Tỷ Trọng (%)"],
        ...data.categoryBreakdown.map((c) => [
          c.categoryName,
          c.revenue,
          c.itemCount,
          `${c.percentage}%`,
        ]),
      ];
      const wsCat = XLSX.utils.aoa_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, wsCat, "DoanhThu_Theo_DanhMuc");

      const fileName = `Bao_Cao_Doanh_Thu_Dong_Kha_${currentRange}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error("Export Excel error:", e);
      alert("Không thể xuất file Excel. Vui lòng thử lại!");
    }
  };

  const { summary, timeline, topProducts, categoryBreakdown, shippingBreakdown } = data;

  // Max revenue in timeline for scaling chart bars
  const maxTimelineRevenue = Math.max(...timeline.map((t) => t.revenue), 1000000);

  return (
    <div className="space-y-3 sm:space-y-3.5 text-left animate-in fade-in duration-200">
      {/* 1. Header Banner & Filter Row - Compact & Tidy */}
      <div className="rounded-xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-3 sm:p-3.5 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-cyan-200">
              <BarChart3 className="w-3 h-3" />
              <span>Thống Kê Doanh Thu</span>
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
              Báo Cáo Phân Tích Hoạt Động
            </h1>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="success"
              size="sm"
              onClick={handleExportExcel}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Time Range Tabs */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TIME_RANGES.map((range) => {
              const isSelected = currentRange === range.key;
              return (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => handleRangeChange(range.key)}
                  disabled={isPending}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer !min-h-0 flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? "bg-white text-[#075FA8] shadow-2xs font-extrabold"
                      : "bg-white/10 hover:bg-white/20 text-blue-100 border border-white/10"
                  }`}
                >
                  {isSelected && isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>{range.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-blue-200/70 font-medium hidden md:inline">
            Cập nhật thời gian thực
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 Primary KPI Cards - Compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* Total Revenue */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {formatCurrency(summary.completedRevenue)}
              </span>
              <span>đã xong</span>
            </div>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Giá Trị TB / Đơn
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.averageOrderValue)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Từ {summary.totalOrders - summary.cancelledOrders} đơn hợp lệ
            </div>
          </div>
        </div>

        {/* Total Orders & Conversion */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tỷ Lệ Hoàn Tất
            </span>
            <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              {summary.conversionRate}%
            </div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <span>{summary.completedOrders}/{summary.totalOrders} đơn</span>
              {summary.pendingOrders > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  ({summary.pendingOrders} chờ)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Items Sold */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sản Phẩm Đã Bán
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              {summary.totalItemsSold.toLocaleString("vi-VN")}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Vật tư / linh kiện
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Omnichannel Revenue Breakdown (Online vs POS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Online Sales Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/70 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border border-blue-100 dark:border-blue-900/50 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#075FA8] dark:text-blue-400 uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Doanh Thu Online (Website)</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.onlineRevenue || 0)}
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              Từ {summary.onlineOrders || 0} đơn đặt hàng trực tuyến
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#075FA8] dark:text-blue-300 font-black text-xs">
              {summary.totalRevenue > 0
                ? `${Math.round(((summary.onlineRevenue || 0) / summary.totalRevenue) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Offline POS Sales Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50/70 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-100 dark:border-amber-900/50 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>Doanh Thu Bán Tại Quầy (POS)</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.posRevenue || 0)}
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              Từ {summary.posOrders || 0} lượt tạo đơn tại showroom
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-black text-xs">
              {summary.totalRevenue > 0
                ? `${Math.round(((summary.posRevenue || 0) / summary.totalRevenue) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Revenue Timeline Chart */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Biểu Đồ Doanh Thu Dòng Thời Gian</span>
            </h3>
          </div>

          {hoveredPoint && (
            <div className="py-0.5 px-2 rounded-md bg-blue-50 dark:bg-blue-950 text-[11px] font-bold text-[#075FA8] dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-in fade-in">
              <span>{hoveredPoint.label}: </span>
              <span className="text-slate-900 dark:text-white ml-1">
                {formatCurrency(hoveredPoint.revenue)} ({hoveredPoint.orderCount} đơn)
              </span>
            </div>
          )}
        </div>

        {timeline.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            Chưa có dữ liệu giao dịch trong khoảng thời gian này.
          </div>
        ) : (
          <div>
            <div className="h-36 sm:h-40 flex items-end gap-1 sm:gap-1.5 pt-2 pb-1 px-1 overflow-x-auto">
              {timeline.map((point) => {
                const heightPercent = Math.max(
                  8,
                  Math.round((point.revenue / maxTimelineRevenue) * 100)
                );
                return (
                  <div
                    key={point.date}
                    className="flex-1 min-w-[24px] max-w-[42px] h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Bar visual */}
                    <div
                      className={`w-full rounded-t-md transition-all duration-200 relative ${
                        point.revenue > 0
                          ? "bg-gradient-to-t from-[#075FA8] to-blue-400 hover:from-blue-700 hover:to-cyan-400 shadow-2xs"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Tooltip on bar hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 bg-slate-950 text-white text-[10px] font-bold py-0.5 px-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                        <div>{point.label}</div>
                        <div className="text-cyan-300">{formatCurrency(point.revenue)}</div>
                        <div className="text-slate-400 font-normal">{point.orderCount} đơn</div>
                      </div>
                    </div>

                    {/* Date label */}
                    <span className="text-[9px] text-slate-400 mt-1 font-medium truncate w-full text-center">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Two Columns: Top 10 Best Sellers & Category/Shipping Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column (2 cols): Top 10 Best Selling Products - Sleek Minimalist Table */}
        <div className="lg:col-span-2 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                Top Mặt Hàng Bán Chạy Nhất
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {topProducts.length} sản phẩm
            </span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <Package className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Chưa có mặt hàng nào được bán trong giai đoạn này.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">
                    <th className="py-1.5 px-2 w-10 text-center">Top</th>
                    <th className="py-1.5 px-2">Sản phẩm</th>
                    <th className="py-1.5 px-2 text-right w-24 hidden sm:table-cell">Đơn giá</th>
                    <th className="py-1.5 px-2 text-center w-16">Đã bán</th>
                    <th className="py-1.5 px-2 text-right w-24">Doanh thu</th>
                    <th className="py-1.5 px-2 text-right w-14 hidden md:table-cell">Tỷ trọng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {topProducts.map((prod, index) => {
                    const revenueShare =
                      summary.totalRevenue > 0
                        ? Math.round((prod.totalRevenue / summary.totalRevenue) * 100)
                        : 0;

                    return (
                      <tr
                        key={prod.productSlug || index}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group align-middle"
                      >
                        <td className="py-2 px-2 text-center align-middle">
                          {index === 0 ? (
                            <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-black text-[10px] inline-flex items-center justify-center shadow-2xs">
                              1
                            </span>
                          ) : index === 1 ? (
                            <span className="w-5 h-5 rounded-md bg-slate-400 text-white font-black text-[10px] inline-flex items-center justify-center shadow-2xs">
                              2
                            </span>
                          ) : index === 2 ? (
                            <span className="w-5 h-5 rounded-md bg-amber-700 text-white font-black text-[10px] inline-flex items-center justify-center shadow-2xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold text-[11px]">
                              {index + 1}
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-2 align-middle">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 relative overflow-hidden shrink-0 flex items-center justify-center">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>
                            <Link
                              href={`/san-pham/${prod.productSlug}`}
                              target="_blank"
                              className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 truncate flex-1 leading-snug !min-h-0 transition-colors"
                            >
                              {prod.productName}
                            </Link>
                          </div>
                        </td>

                        <td className="py-2 px-2 text-right font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:table-cell align-middle">
                          {formatCurrency(prod.price)}
                        </td>

                        <td className="py-2 px-2 text-center align-middle">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-mono font-bold text-[11px] inline-block">
                            {prod.totalQty}
                          </span>
                        </td>

                        <td className="py-2 px-2 text-right font-black text-slate-900 dark:text-white whitespace-nowrap align-middle">
                          {formatCurrency(prod.totalRevenue)}
                        </td>

                        <td className="py-2 px-2 text-right hidden md:table-cell align-middle">
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            {revenueShare}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Category Breakdown & Shipping */}
        <div className="space-y-3">
          {/* Category Breakdown */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                <span>Theo Danh Mục</span>
              </h3>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Chưa có dữ liệu danh mục.
              </div>
            ) : (
              <div className="space-y-2">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.categoryName} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">{cat.categoryName}</span>
                      <span className="shrink-0 text-slate-900 dark:text-white font-extrabold">
                        {formatCurrency(cat.revenue)}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#075FA8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(4, cat.percentage))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] text-slate-400">
                      <span>{cat.itemCount} món</span>
                      <span>{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Method Distribution */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Phương Thức Nhận Hàng</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Delivery */}
              <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#075FA8] dark:text-blue-300">
                  <Truck className="w-3 h-3" />
                  <span>Giao Tận Nơi</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {shippingBreakdown.deliveryCount} đơn
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                  {formatCurrency(shippingBreakdown.deliveryRevenue)}
                </div>
              </div>

              {/* Store Pickup */}
              <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-amber-700 dark:text-amber-300">
                  <Store className="w-3 h-3" />
                  <span>Tại Kho</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {shippingBreakdown.storePickupCount} đơn
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                  {formatCurrency(shippingBreakdown.storePickupRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert Widget */}
          {data.lowStockProducts && data.lowStockProducts.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-2xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/60 pb-1.5">
                <h3 className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cảnh Báo Tồn Kho Thấp ({data.lowStockProducts.length})</span>
                </h3>
                <Link
                  href="/admin/products"
                  className="text-[10px] font-bold text-[#075FA8] dark:text-blue-400 hover:underline"
                >
                  Quản lý kho →
                </Link>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {data.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.sku || p.categoryName}
                      </div>
                    </div>
                    <StockBadge stock={p.stock} lowStockThreshold={5} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
