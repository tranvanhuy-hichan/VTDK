"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Loader2,
  Package,
  ArrowRight,
  Truck,
  Store,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrdersAction } from "../../actions/orderActions";
import type { OrderDetail } from "../../types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { CustomerOrderHistorySkeleton } from "../home/CustomerSkeleton";
import { Pagination } from "../product/Pagination";
import { EmptyState } from "../common/EmptyState";

const PAGE_SIZE = 8;

export const OrderHistoryView: React.FC = () => {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        getMyOrdersAction().then((data) => {
          setOrders(data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [user, isAuthLoading]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pagedOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isAuthLoading || loading) {
    return <CustomerOrderHistorySkeleton />;
  }

  if (!user) {
    return (
      <section className="pt-1.5 sm:pt-2.5 pb-12 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 text-left">
          <ProductDetailHeader productName="Đơn hàng của tôi" />
          <div className="max-w-md mx-auto text-center pt-6 sm:pt-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Đăng nhập để xem đơn hàng</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vui lòng đăng nhập vào tài khoản của bạn để tra cứu lịch sử và tình trạng các đơn hàng đã đặt.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-0 pb-12 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 text-left">
        <ProductDetailHeader productName="Đơn hàng của tôi" />

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Bạn chưa có đơn hàng nào"
            description="Khám phá danh mục ống đồng, gas lạnh, linh kiện điều hòa chính hãng và tiến hành đặt hàng nhé!"
            actionLabel="Mua sắm ngay"
            actionHref="/san-pham"
          />
        ) : (
          <div className="space-y-2.5">
            {pagedOrders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all space-y-2.5"
                >
                  {/* Top Bar: Code, Date, Shipping, Items count, Status Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 min-w-0">
                      <span className="font-mono font-bold text-[#075FA8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md text-[11px] sm:text-xs shrink-0">
                        {order.orderCode}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[10px] sm:text-[11px] shrink-0">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                      <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                        {order.shippingMethod === "DELIVERY" ? (
                          <span className="inline-flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#075FA8]" /> Giao tận nơi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Store className="w-3.5 h-3.5 text-amber-600" /> Lấy tại kho
                          </span>
                        )}
                        <span>({totalItems} món)</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  {/* Body Content: Horizontal Products + Total & Detail Button */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-3 pt-0.5">
                    {/* Products List (Compact) */}
                    <div className="flex-1 min-w-0 divide-y divide-slate-100/80 dark:divide-slate-800/80">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-1.5 first:pt-0 last:pb-0 flex items-center gap-2.5 sm:gap-3">
                          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image src={item.image} alt={item.productName} fill sizes="40px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 text-[10px] sm:text-[11px] text-slate-500">
                              {item.variantLabel && (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium text-[9px] sm:text-[10px]">
                                  {item.variantLabel}
                                </span>
                              )}
                              <span>
                                {formatCurrency(item.price)} × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shrink-0 pl-1">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right Price & Detail CTA */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0 lg:pl-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800">
                      <div className="text-left lg:text-right">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Tổng đơn hàng ({totalItems} món)
                        </span>
                        <span className="text-xs sm:text-base font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <Link
                        href={`/don-hang/${order.orderCode}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer !min-h-0 shrink-0 shadow-2xs"
                      >
                        <span>Chi tiết</span>
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Customer Pagination */}
            {totalPages > 1 && (
              <div className="pt-4">
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
    </section>
  );
};
