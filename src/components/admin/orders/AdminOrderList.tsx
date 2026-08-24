"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Store,
  DollarSign,
  Loader2,
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
    <div className="space-y-6 text-left">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            <span>Tổng đơn hàng</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>Chờ duyệt mới</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.pendingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
            <Truck className="w-4 h-4" />
            <span>Đang giao</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
            {stats.shippingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>Đã hoàn thành</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completedCount}
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Doanh thu thực tế</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400 truncate">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
                  selectedStatus === tab.key
                    ? "bg-[#075FA8] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên, SĐT..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">Mã đơn</th>
                <th className="px-4 py-3.5">Khách hàng</th>
                <th className="px-4 py-3.5">Giao nhận</th>
                <th className="px-4 py-3.5">Ngày đặt</th>
                <th className="px-4 py-3.5">Tổng tiền</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
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
                    <td className="px-4 py-3 font-mono font-bold text-[#075FA8] dark:text-blue-400">
                      {order.orderCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
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
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors cursor-pointer !min-h-0"
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
