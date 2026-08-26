"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/format";
import {
  getAdminAnalyticsAction,
  type AnalyticsData,
} from "../../actions/analyticsActions";
import * as XLSX from "xlsx";

interface AdminAnalyticsViewProps {
  initialData: AnalyticsData;
}

type TimeRangeKey = "7d" | "30d" | "this_month" | "last_month" | "all";

const TIME_RANGES: { id: TimeRangeKey; label: string }[] = [
  { id: "7d", label: "7 ngày qua" },
  { id: "30d", label: "30 ngày qua" },
  { id: "this_month", label: "Tháng này" },
  { id: "last_month", label: "Tháng trước" },
  { id: "all", label: "Toàn thời gian" },
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

  const handleRangeChange = (range: TimeRangeKey) => {
    setCurrentRange(range);
    startTransition(async () => {
      const res = await getAdminAnalyticsAction(range);
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
        [`Khoảng thời gian: ${TIME_RANGES.find((r) => r.id === currentRange)?.label || currentRange}`],
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
    <div className="space-y-4 sm:space-y-5 text-left animate-in fade-in duration-200">
      {/* 1. Header Banner & Filter Row */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-extrabold tracking-wide uppercase text-cyan-200 border border-white/10">
              <BarChart3 className="w-3 h-3" />
              <span>Thống Kê Doanh Thu &amp; Bán Hàng</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
              Báo Cáo Phân Tích Hoạt Động
            </h1>
            <p className="text-xs text-blue-100/80 font-medium">
              Theo dõi hiệu quả doanh số, sản phẩm bán chạy và cơ cấu đơn hàng theo thời gian thực.
            </p>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
            >
              <Download className="w-4 h-4" />
              <span>Xuất File Excel</span>
            </button>
          </div>
        </div>

        {/* Time Range Pills */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center flex-wrap gap-1.5 sm:gap-2">
          <span className="text-[11px] font-bold text-blue-200 mr-1 hidden sm:inline">
            Khoảng thời gian:
          </span>
          {TIME_RANGES.map((range) => {
            const isSelected = currentRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => handleRangeChange(range.id)}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer !min-h-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white text-[#075FA8] shadow-sm scale-102"
                    : "bg-white/10 hover:bg-white/20 text-blue-100 border border-white/10"
                }`}
              >
                {isSelected && isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>{range.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 Primary KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Total Revenue */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {formatCurrency(summary.completedRevenue)}
              </span>
              <span>đã hoàn tất</span>
            </div>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Giá Trị TB / Đơn (AOV)
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary.averageOrderValue)}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-medium">
              Từ {summary.totalOrders - summary.cancelledOrders} đơn đặt hợp lệ
            </div>
          </div>
        </div>

        {/* Total Orders & Conversion */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tỷ Lệ Hoàn Tất Đơn
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {summary.conversionRate}%
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
              <span>{summary.completedOrders}/{summary.totalOrders} đơn</span>
              {summary.pendingOrders > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  ({summary.pendingOrders} đang chờ)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Items Sold */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sản Phẩm Đã Bán
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {summary.totalItemsSold.toLocaleString("vi-VN")}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-medium">
              Vật tư / linh kiện xuất kho
            </div>
          </div>
        </div>
      </div>

      {/* 3. Revenue Timeline Chart */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Biểu Đồ Doanh Thu Dòng Thời Gian</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Phân bố doanh số và số lượng đơn hàng theo từng ngày
            </p>
          </div>

          {hoveredPoint && (
            <div className="p-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-xs font-bold text-[#075FA8] dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-in fade-in">
              <span>{hoveredPoint.label}: </span>
              <span className="text-slate-900 dark:text-white ml-1">
                {formatCurrency(hoveredPoint.revenue)} ({hoveredPoint.orderCount} đơn)
              </span>
            </div>
          )}
        </div>

        {timeline.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Chưa có dữ liệu giao dịch trong khoảng thời gian này.
          </div>
        ) : (
          <div className="pt-2">
            <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2 px-1 overflow-x-auto">
              {timeline.map((point) => {
                const heightPercent = Math.max(
                  8,
                  Math.round((point.revenue / maxTimelineRevenue) * 100)
                );
                return (
                  <div
                    key={point.date}
                    className="flex-1 min-w-[28px] max-w-[48px] h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Bar visual */}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 relative ${
                        point.revenue > 0
                          ? "bg-gradient-to-t from-[#075FA8] to-blue-400 hover:from-blue-700 hover:to-cyan-400 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Tooltip on bar hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-slate-950 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
                        <div>{point.label}</div>
                        <div className="text-cyan-300">{formatCurrency(point.revenue)}</div>
                        <div className="text-slate-400 font-normal">{point.orderCount} đơn</div>
                      </div>
                    </div>

                    {/* Date label */}
                    <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 font-medium truncate w-full text-center">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Left Column (2 cols): Top 10 Best Selling Products */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Top Mặt Hàng Bán Chạy Nhất
                </h3>
                <p className="text-xs text-slate-400">
                  Xếp hạng theo tổng doanh thu &amp; sản lượng xuất kho
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              {topProducts.length} sản phẩm
            </span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Chưa có mặt hàng nào được bán trong giai đoạn này.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {topProducts.map((prod, index) => {
                const revenueShare =
                  summary.totalRevenue > 0
                    ? Math.round((prod.totalRevenue / summary.totalRevenue) * 100)
                    : 0;

                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div
                    key={prod.productSlug || index}
                    className="group p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md transition-all duration-200 flex items-center gap-3 sm:gap-4"
                  >
                    {/* Rank Medal */}
                    <div className="shrink-0">
                      {isTop1 ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white font-black text-xs shadow-md shadow-amber-500/25 flex items-center justify-center">
                          #1
                        </div>
                      ) : isTop2 ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white font-black text-xs shadow-md shadow-slate-400/20 flex items-center justify-center">
                          #2
                        </div>
                      ) : isTop3 ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700 to-orange-800 text-white font-black text-xs shadow-md shadow-orange-700/20 flex items-center justify-center">
                          #3
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                          #{index + 1}
                        </div>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 relative overflow-hidden shrink-0 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>

                    {/* Product Details & Contribution Bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/san-pham/${prod.productSlug}`}
                          target="_blank"
                          className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate block group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors"
                        >
                          {prod.productName}
                        </Link>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#075FA8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium text-slate-400">
                          Đơn giá: <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(prod.price)}</span>
                        </span>
                        <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-950/80 text-[#075FA8] dark:text-blue-300 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                          Đã xuất: {prod.totalQty} cái
                        </span>
                      </div>

                      {/* Revenue Share Progress Bar */}
                      <div className="w-full bg-slate-200/70 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-[#075FA8] dark:from-blue-400 dark:to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(revenueShare, 5)}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue Metric */}
                    <div className="text-right shrink-0 pl-1">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight">
                        {formatCurrency(prod.totalRevenue)}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-100/80 dark:border-blue-900/40">
                        {revenueShare}% doanh số
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 col): Category Breakdown & Shipping */}
        <div className="space-y-3.5">
          {/* Category Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                <span>Doanh Thu Theo Danh Mục</span>
              </h3>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Chưa có dữ liệu danh mục.
              </div>
            ) : (
              <div className="space-y-2.5">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.categoryName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">{cat.categoryName}</span>
                      <span className="shrink-0 text-slate-900 dark:text-white font-extrabold">
                        {formatCurrency(cat.revenue)}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#075FA8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(4, cat.percentage))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{cat.itemCount} món đã bán</span>
                      <span>{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Method Distribution */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Phương Thức Nhận Hàng</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Delivery */}
              <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-left space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#075FA8] dark:text-blue-300">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Giao Tận Nơi</span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {shippingBreakdown.deliveryCount} đơn
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {formatCurrency(shippingBreakdown.deliveryRevenue)}
                </div>
              </div>

              {/* Store Pickup */}
              <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-left space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  <Store className="w-3.5 h-3.5" />
                  <span>Lấy Tại Kho</span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {shippingBreakdown.storePickupCount} đơn
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {formatCurrency(shippingBreakdown.storePickupRevenue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
