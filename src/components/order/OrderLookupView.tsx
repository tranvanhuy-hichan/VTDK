"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Phone,
  Truck,
  Store,
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import type { OrderDetail } from "../../types/order";
import { lookupOrderAction } from "../../actions/orderActions";
import { formatCurrency, formatDate } from "../../lib/format";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ProductDetailHeader } from "../product/ProductDetailHeader";

interface OrderLookupViewProps {
  company: CompanyContact;
}

export const OrderLookupView: React.FC<OrderLookupViewProps> = ({ company }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OrderDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError(null);
    startTransition(async () => {
      const res = await lookupOrderAction(query.trim());
      if (res.success && res.orders && res.orders.length > 0) {
        setResults(res.orders);
        setError(null);
      } else {
        setResults([]);
        setError(res.error || "Không tìm thấy đơn hàng phù hợp.");
      }
    });
  };

  return (
    <section className="pt-0 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4 text-left">
        <ProductDetailHeader productName="Tra Cứu Đơn Hàng" />

        {/* Hero Search Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B1F33] via-[#072444] to-[#075FA8] p-5 sm:p-8 lg:p-10 text-white shadow-lg border border-blue-900/40 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Theo dõi tình trạng đơn hàng trực tuyến</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Tra Cứu Đơn Hàng {company.brandName || "Đông Kha"}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg mx-auto">
              Nhập <span className="font-bold text-white">Mã đơn hàng</span> (ví dụ: <code>DK-XXXX-XXXX</code>) hoặc <span className="font-bold text-white">Số điện thoại</span> người nhận để kiểm tra chi tiết.
            </p>

            <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nhập mã đơn hàng hoặc số điện thoại..."
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md active:scale-98 cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Tra cứu</span>
              </button>
            </form>
          </div>
        </div>

        {/* Results Area */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
            <p>{error}</p>
          </div>
        )}

        {results !== null && results.length > 0 && (
          <div className="space-y-4 max-w-4xl mx-auto pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Tìm thấy {results.length} đơn hàng
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4 transition-all hover:border-blue-400 dark:hover:border-blue-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-[#075FA8] dark:text-blue-400 tracking-wider">
                          {order.orderCode}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/don-hang/${order.orderCode}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Order items snapshot */}
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {item.productName}
                            {item.variantLabel && ` (${item.variantLabel})`}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-slate-400 italic">
                        và {order.items.length - 3} sản phẩm khác...
                      </p>
                    )}
                  </div>

                  {/* Footer total & shipping info */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      {order.shippingMethod === "STORE_PICKUP" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Store className="w-3.5 h-3.5" /> Đến lấy tại cửa hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                          <Truck className="w-3.5 h-3.5" /> Giao hàng tận nơi ({order.address || "Đã cung cấp"})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      <span className="text-xs font-normal text-slate-500">Tổng thanh toán:</span>
                      <span className="text-[#075FA8] dark:text-blue-400">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Assistance Card */}
        <div className="max-w-2xl mx-auto p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cần hỗ trợ về đơn hàng?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bộ phận hỗ trợ khách hàng của Đông Kha luôn sẵn sàng giải đáp 24/7.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${company.hotlineRaw || company.hotline}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{company.hotline}</span>
            </a>
            {company.zaloUrl && (
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Zalo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
