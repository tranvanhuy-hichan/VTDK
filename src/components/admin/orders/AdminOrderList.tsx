"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Clock,
  Truck,
  CheckCircle,
  Eye,
  Store,
  DollarSign,
  ChevronRight,
  Phone,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react";
import type { OrderDetail } from "@/types/order";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { COMPANY_DATA } from "@/data/company";
import { Button, Input, Tabs } from "@/components/ui";
import { Pagination } from "@/components/product/Pagination";
import { EmptyState } from "@/components/common/EmptyState";

const PAGE_SIZE = 15;

interface AdminOrderListProps {
  initialOrders: OrderDetail[];
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({ initialOrders }) => {
  const router = useRouter();
  const [orders] = useState<OrderDetail[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedStatus !== "ALL" && o.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = o.orderCode.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.toLowerCase().includes(q);
        const matchEmail = o.customerEmail?.toLowerCase().includes(q) ?? false;
        return matchCode || matchName || matchPhone || matchEmail;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    const shippingCount = orders.filter((o) => o.status === "SHIPPING").length;
    const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
    const totalRevenue = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalOrders, pendingCount, shippingCount, completedCount, totalRevenue };
  }, [orders]);

  // Export to Real Microsoft Excel (.xlsx) with Enterprise Corporate Formatting
  const handleExportExcel = async () => {
    if (filteredOrders.length === 0) {
      alert("Không có đơn hàng nào để xuất!");
      return;
    }

    setIsExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = COMPANY_DATA.fullName;
      workbook.lastModifiedBy = "Admin";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Danh Sách Đơn Hàng", {
        views: [{ showGridLines: true }],
        pageSetup: { paperSize: 9, orientation: "landscape" },
      });

      const statusMap: Record<string, string> = {
        ALL: "Tất cả đơn hàng",
        PENDING: "Chờ xử lý",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao hàng",
        COMPLETED: "Đã hoàn thành",
        CANCELLED: "Đã hủy",
      };

      const now = new Date();
      const exportTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ngày ${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
      const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalQuantity = filteredOrders.reduce(
        (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
        0
      );

      // Define column widths
      worksheet.columns = [
        { key: "stt", width: 8 },
        { key: "code", width: 24 },
        { key: "time", width: 18 },
        { key: "customer", width: 24 },
        { key: "phone", width: 16 },
        { key: "email", width: 26 },
        { key: "method", width: 18 },
        { key: "address", width: 40 },
        { key: "items", width: 48 },
        { key: "qty", width: 12 },
        { key: "amount", width: 20 },
        { key: "status", width: 18 },
        { key: "note", width: 28 },
      ];

      // 1. Header Company Info (Clean Left-Aligned Corporate Layout)
      const row1 = worksheet.addRow([COMPANY_DATA.fullName.toUpperCase()]);
      row1.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FF0F172A" } };
      row1.height = 20;

      const row2 = worksheet.addRow([
        `Địa chỉ: ${COMPANY_DATA.address}   |   Hotline: ${COMPANY_DATA.hotline}${
          COMPANY_DATA.taxCode ? `   |   MST: ${COMPANY_DATA.taxCode}` : ""
        }${COMPANY_DATA.email ? `   |   Email: ${COMPANY_DATA.email}` : ""}`,
      ]);
      row2.font = { name: "Segoe UI", size: 9.5, color: { argb: "FF475569" } };
      row2.height = 18;

      worksheet.addRow([]); // Row 3 spacer (height: 6)
      worksheet.getRow(3).height = 6;

      // Title Row (Left-aligned, professional)
      const titleRow = worksheet.addRow(["BÁO CÁO TỔNG HỢP DANH SÁCH ĐƠN HÀNG"]);
      titleRow.font = { name: "Segoe UI", size: 15, bold: true, color: { argb: "FF0F172A" } };
      titleRow.alignment = { vertical: "middle", horizontal: "left" };
      titleRow.height = 24;

      // Subtitle Row
      const subRow = worksheet.addRow([
        `Thời gian xuất: ${exportTimeStr}   •   Bộ lọc: ${
          statusMap[selectedStatus] || selectedStatus
        }   •   Tổng cộng: ${filteredOrders.length} đơn hàng   •   Tổng giá trị: ${formatCurrency(totalRevenue)}`,
      ]);
      subRow.font = { name: "Segoe UI", size: 10, italic: true, color: { argb: "FF475569" } };
      subRow.alignment = { vertical: "middle", horizontal: "left" };
      subRow.height = 18;

      worksheet.addRow([]); // Row 6 spacer
      worksheet.getRow(6).height = 8;

      // 2. Table Headers (Row 7)
      const headerValues = [
        "STT",
        "Mã đơn hàng",
        "Thời gian đặt",
        "Tên khách hàng",
        "Số điện thoại",
        "Email",
        "Hình thức nhận",
        "Địa chỉ nhận hàng",
        "Chi tiết sản phẩm & số lượng",
        "Tổng SL",
        "Tổng tiền (VNĐ)",
        "Trạng thái",
        "Ghi chú",
      ];
      const headerRow = worksheet.addRow(headerValues);
      headerRow.height = 26;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0F172A" },
        };
        cell.font = {
          name: "Segoe UI",
          size: 10.5,
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF334155" } },
          left: { style: "thin", color: { argb: "FF334155" } },
          bottom: { style: "medium", color: { argb: "FF0F172A" } },
          right: { style: "thin", color: { argb: "FF334155" } },
        };
      });

      // 3. Table Data Rows
      filteredOrders.forEach((o, index) => {
        const itemsSummary = o.items
          .map((it) => `${it.productName}${it.variantLabel ? ` (${it.variantLabel})` : ""} x${it.quantity}`)
          .join("; ");
        const orderQty = o.items.reduce((s, it) => s + it.quantity, 0);
        const isEven = index % 2 === 0;

        const row = worksheet.addRow([
          index + 1,
          o.orderCode,
          formatDate(o.createdAt),
          o.customerName,
          o.customerPhone,
          o.customerEmail || "",
          o.shippingMethod === "STORE_PICKUP" ? "Lấy tại kho" : "Giao tận nơi",
          o.address || (o.shippingMethod === "STORE_PICKUP" ? "Nhận tại kho cửa hàng" : ""),
          itemsSummary,
          orderQty,
          o.totalAmount,
          statusMap[o.status] || o.status,
          o.note || "",
        ]);

        row.height = 24;
        const bgColor = isEven ? "FFFFFFFF" : "FFF8FAFC";

        row.eachCell((cell, colNumber) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor },
          };
          cell.font = { name: "Segoe UI", size: 10.5, color: { argb: "FF1E293B" } };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };

          // Custom Alignments & Number Formats
          if (colNumber === 1 || colNumber === 5 || colNumber === 7) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else if (colNumber === 2) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.font = { name: "Consolas", size: 10.5, bold: true, color: { argb: "FF075FA8" } };
          } else if (colNumber === 3) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else if (colNumber === 10) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.font = { name: "Segoe UI", size: 10.5, bold: true };
          } else if (colNumber === 11) {
            cell.alignment = { vertical: "middle", horizontal: "right" };
            cell.numFmt = '#,##0 "₫"';
            cell.font = { name: "Segoe UI", size: 10.5, bold: true, color: { argb: "FFD97706" } };
          } else if (colNumber === 12) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.font = { name: "Segoe UI", size: 10, bold: true };
            if (o.status === "COMPLETED") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF15803D" } };
            } else if (o.status === "SHIPPING") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0F2FE" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF0369A1" } };
            } else if (o.status === "CONFIRMED") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3E8FF" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF7E22CE" } };
            } else if (o.status === "PENDING") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB45309" } };
            } else if (o.status === "CANCELLED") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB91C1C" } };
            }
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }
        });
      });

      // 4. Summary Total Footer Row
      const lastRowNum = worksheet.rowCount + 1;
      const totalRow = worksheet.addRow([
        "",
        "TỔNG CỘNG DOANH THU & SẢN PHẨM:",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        totalQuantity,
        totalRevenue,
        "",
        "",
      ]);
      totalRow.height = 28;
      worksheet.mergeCells(`B${lastRowNum}:I${lastRowNum}`);

      totalRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF1F5F9" },
        };
        cell.border = {
          top: { style: "medium", color: { argb: "FF94A3B8" } },
          bottom: { style: "double", color: { argb: "FF334155" } },
        };

        if (colNumber === 2) {
          cell.alignment = { vertical: "middle", horizontal: "right" };
          cell.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FF0F172A" } };
        } else if (colNumber === 10) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = { name: "Segoe UI", size: 11.5, bold: true, color: { argb: "FF075FA8" } };
        } else if (colNumber === 11) {
          cell.alignment = { vertical: "middle", horizontal: "right" };
          cell.numFmt = '#,##0 "₫"';
          cell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FFB45309" } };
        }
      });

      // Write and download buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bao_Cao_Don_Hang_${selectedStatus}_${now.toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
      alert("Có lỗi khi xuất file Excel. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3 text-left">
      {/* 1. Ultra-Compact Micro-Stats (1 Single Horizontal Scroll Row on Mobile, Grid on Desktop) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:grid sm:grid-cols-5 sm:gap-2.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex sm:block items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold">
            <ShoppingBag className="w-3 h-3 text-[#075FA8] dark:text-blue-400" />
            <span className="whitespace-nowrap">Tổng đơn:</span>
          </div>
          <p className="text-xs sm:text-lg font-black text-slate-900 dark:text-white sm:mt-0.5">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex sm:block items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[10px] sm:text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span className="whitespace-nowrap">Chờ duyệt:</span>
          </div>
          <p className="text-xs sm:text-lg font-black text-amber-600 dark:text-amber-400 sm:mt-0.5">
            {stats.pendingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex sm:block items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-[10px] sm:text-[11px] font-bold">
            <Truck className="w-3 h-3" />
            <span className="whitespace-nowrap">Đang giao:</span>
          </div>
          <p className="text-xs sm:text-lg font-black text-purple-600 dark:text-purple-400 sm:mt-0.5">
            {stats.shippingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex sm:block items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-[11px] font-bold">
            <CheckCircle className="w-3 h-3" />
            <span className="whitespace-nowrap">Hoàn thành:</span>
          </div>
          <p className="text-xs sm:text-lg font-black text-emerald-600 dark:text-emerald-400 sm:mt-0.5">
            {stats.completedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex sm:block items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-[10px] sm:text-[11px] font-bold">
            <DollarSign className="w-3 h-3" />
            <span className="whitespace-nowrap">Doanh thu:</span>
          </div>
          <p className="text-xs sm:text-base font-black text-orange-600 dark:text-orange-400 sm:mt-0.5 truncate">
            {stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : "0 ₫"}
          </p>
        </div>
      </div>

      {/* 2. Compact Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-2 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Status Tabs */}
          <Tabs
            variant="pills"
            size="sm"
            activeKey={selectedStatus}
            onChange={(key) => setSelectedStatus(key)}
            tabs={[
              { key: "ALL", label: "Tất cả", count: stats.totalOrders },
              { key: "PENDING", label: "Chờ xử lý", count: stats.pendingCount },
              { key: "CONFIRMED", label: "Đã xác nhận" },
              { key: "SHIPPING", label: "Đang giao", count: stats.shippingCount },
              { key: "COMPLETED", label: "Hoàn thành", count: stats.completedCount },
              { key: "CANCELLED", label: "Đã hủy" },
            ]}
          />

          {/* Search bar & Export CTA */}
          <div className="flex items-center gap-2">
            <div className="w-full sm:w-64">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên, SĐT..."
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>

            <Button
              variant="success"
              isLoading={isExporting}
              onClick={handleExportExcel}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              title="Xuất file Excel (.xlsx) danh sách đơn hàng"
            >
              <span className="hidden sm:inline">Xuất Excel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Cards View (< md) & Desktop Table (>= md) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
        {/* Mobile View: Clean Card List */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredOrders.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={ShoppingBag}
                title="Không tìm thấy đơn hàng nào"
                description="Thử thay đổi bộ lọc trạng thái hoặc nhập mã đơn hàng, số điện thoại khác."
              />
            </div>
          ) : (
            pagedOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs font-black text-[#075FA8] dark:text-blue-400 group-hover:underline">
                      #{order.orderCode}
                    </span>
                    <span className="text-[10px] text-slate-400">• {formatDate(order.createdAt)}</span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400">
                      {order.customerName}
                    </p>
                    {Boolean(order.customerPhone && order.customerPhone.trim() && !order.customerPhone.startsWith("0900000000") && !order.customerPhone.startsWith("0000000000")) ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{order.customerPhone}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                        Không có SĐT
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-black text-sm text-slate-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span className="text-[10px] text-[#075FA8] dark:text-blue-400 font-bold flex items-center gap-0.5 justify-end mt-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Xem chi tiết</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={ShoppingBag}
                title="Không tìm thấy đơn hàng nào"
                description="Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
              />
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Giao nhận</th>
                  <th className="px-4 py-3">Ngày đặt</th>
                  <th className="px-4 py-3">Tổng tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {pagedOrders.map((order) => {
                const isPos = order.orderCode.startsWith("POS-") || (order as any).orderSource === "POS";
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#075FA8] dark:text-blue-400 group-hover:underline">
                      <div className="flex items-center gap-1.5">
                        <span>{order.orderCode}</span>
                        {isPos ? (
                          <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80">
                            POS Quầy
                          </span>
                        ) : (
                          <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 border border-blue-200/80">
                            Web
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {order.customerName}
                      </div>
                      {Boolean(order.customerPhone && order.customerPhone.trim() && !order.customerPhone.startsWith("0900000000") && !order.customerPhone.startsWith("0000000000")) ? (
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      ) : (
                        <div className="text-[11px] text-slate-400/60 italic">Không có SĐT</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.shippingMethod === "DELIVERY" ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Truck className="w-3.5 h-3.5 text-blue-500" /> Giao tận nơi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Store className="w-3.5 h-3.5 text-amber-500" /> {isPos ? "Tại quầy" : "Lấy tại kho"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#075FA8]/10 hover:bg-[#075FA8] text-[#075FA8] hover:text-white dark:bg-blue-900/30 dark:hover:bg-blue-600 dark:text-blue-300 dark:hover:text-white rounded-xl font-bold transition-all cursor-pointer !min-h-0 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination & Count Info Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Hiển thị <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * PAGE_SIZE + 1}</span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}</span> trên tổng số <span className="font-bold text-slate-900 dark:text-white">{filteredOrders.length}</span> đơn hàng
            </div>
            {totalPages > 1 && (
              <div className="!mt-0">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

