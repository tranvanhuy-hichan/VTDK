"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import type { OrderDetail, OrderStatus } from "../../../types/order";
import { OrderStatusBadge } from "../../order/OrderStatusBadge";
import { AdminOrderDetailModal } from "./AdminOrderDetailModal";
import { formatCurrency, formatDate } from "../../../lib/format";

interface AdminOrderListProps {
  initialOrders: OrderDetail[];
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({ initialOrders }) => {
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

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

  const handleStatusUpdated = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { key: "ALL", label: "Tất cả" },
              { key: "PENDING", label: "Chờ xử lý" },
              { key: "CONFIRMED", label: "Đã xác nhận" },
              { key: "SHIPPING", label: "Đang giao" },
              { key: "COMPLETED", label: "Hoàn thành" },
              { key: "CANCELLED", label: "Đã hủy" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
                  selectedStatus === tab.key
                    ? "bg-[#075FA8] text-white shadow-2xs font-extrabold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên, SĐT..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#075FA8]"
            />
          </div>
        </div>
      </div>

      {/* 3. Mobile Cards View (< md) & Desktop Table (>= md) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
        {/* Mobile View: Clean Card List */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Không có đơn hàng nào phù hợp.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs font-black text-[#075FA8] dark:text-blue-400">
                      #{order.orderCode}
                    </span>
                    <span className="text-[10px] text-slate-400">• {formatDate(order.createdAt)}</span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">
                      {order.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{order.customerPhone}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-black text-sm text-slate-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span className="text-[10px] text-[#075FA8] dark:text-blue-400 font-bold flex items-center gap-0.5 justify-end">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-2.5 font-mono font-bold text-[#075FA8] dark:text-blue-400">
                      {order.orderCode}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      {order.shippingMethod === "DELIVERY" ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Truck className="w-3.5 h-3.5 text-blue-500" /> Giao tận nơi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Store className="w-3.5 h-3.5 text-amber-500" /> Lấy tại kho
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-2.5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-colors cursor-pointer !min-h-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};
