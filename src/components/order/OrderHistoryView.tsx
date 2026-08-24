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

export const OrderHistoryView: React.FC = () => {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (isAuthLoading || loading) {
    return (
      <section className="pt-1.5 sm:pt-2.5 pb-12 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <ProductDetailHeader productName="Đơn hàng của tôi" />
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#075FA8] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="pt-1.5 sm:pt-2.5 pb-12 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-left">
          <ProductDetailHeader productName="Đơn hàng của tôi" />
          <div className="max-w-md mx-auto text-center pt-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Đăng nhập để xem đơn hàng</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vui lòng đăng nhập vào tài khoản của bạn để tra cứu lịch sử và tình trạng các đơn hàng đã đặt.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
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
    <section className="pt-1.5 sm:pt-2.5 pb-12 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-left">
        <ProductDetailHeader productName="Đơn hàng của tôi" />

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3.5 shadow-xs w-full">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Bạn chưa có đơn hàng nào</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Khám phá danh mục ống đồng, gas lạnh, linh kiện điều hòa chính hãng và tiến hành đặt hàng nhé!
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>Mua sắm ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((order) => {
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all space-y-2.5"
                >
                  {/* Top Bar: Code, Date, Shipping, Items count, Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono font-bold text-[#075FA8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md text-xs">
                        {order.orderCode}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
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

                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Body Content: Horizontal Products + Total & Detail Button */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-0.5">
                    {/* Products List (Compact) */}
                    <div className="flex-1 min-w-0 divide-y divide-slate-100/80 dark:divide-slate-800/80">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-1.5 first:pt-0 last:pb-0 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image src={item.image} alt={item.productName} fill sizes="40px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {item.productName}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                              {item.variantLabel && (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium text-[10px]">
                                  Quy cách: {item.variantLabel}
                                </span>
                              )}
                              <span>
                                {formatCurrency(item.price)} × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shrink-0 pl-2">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right Price & Detail CTA */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0 lg:pl-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Tổng đơn hàng
                        </span>
                        <span className="text-sm sm:text-base font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <Link
                        href={`/don-hang/${order.orderCode}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer !min-h-0 shrink-0 shadow-2xs"
                      >
                        <span>Chi tiết</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
