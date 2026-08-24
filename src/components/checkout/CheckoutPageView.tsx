"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Truck, Store, MapPin, User, Phone, Mail, FileText, Loader2, CheckCircle2, LogIn, ShieldCheck } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrderAction } from "../../actions/orderActions";
import type { CompanyContact } from "../../lib/company";
import type { ShippingMethod } from "../../types/order";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "../cart/OrderSummary";
import { VietnamAddressSelector } from "../address/VietnamAddressSelector";


interface CheckoutPageViewProps {
  company: CompanyContact;
}

export const CheckoutPageView: React.FC<CheckoutPageViewProps> = ({ company }) => {
  const router = useRouter();
  const { checkoutItems, hydrated, updateCheckoutQty, removeItem, clear } = useCart();
  const { user, openAuthModal } = useAuth();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("DELIVERY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill and update state from user profile whenever user logs in or profile updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Require user login before placing order
    if (!user) {
      setError("Vui lòng đăng nhập hoặc tạo tài khoản để hoàn tất đặt hàng.");
      openAuthModal("login");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và số điện thoại người nhận.");
      return;
    }

    if (shippingMethod === "DELIVERY" && !address.trim()) {
      setError("Vui lòng nhập địa chỉ nhận hàng đối với hình thức giao hàng tận nơi.");
      return;
    }

    if (checkoutItems.length === 0) {
      setError("Không có sản phẩm nào để đặt hàng.");
      return;
    }

    setLoading(true);
    const res = await createOrderAction({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim() || undefined,
      shippingMethod,
      address: shippingMethod === "DELIVERY" ? address.trim() : undefined,
      note: note.trim() || undefined,
      items: checkoutItems.map((item) => ({
        productSlug: item.slug,
        productName: item.name,
        variantLabel: item.variantLabel,
        price: item.price,
        quantity: item.qty,
        image: item.image,
      })),
    });
    setLoading(false);

    if (res.success && res.orderCode) {
      // Remove checkout items from cart
      checkoutItems.forEach((i) => removeItem(i.key));
      router.push(`/don-hang/${res.orderCode}`);
    } else {
      setError(res.error || "Không thể đặt hàng. Vui lòng thử lại.");
    }
  };


  if (!hydrated) {
    return (
      <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ProductDetailHeader productName="Thanh toán" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <OrderRowSkeleton />
                <OrderRowSkeleton />
              </div>
              <OrderTotalSkeleton />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
              <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-1.5 sm:pt-2.5 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ProductDetailHeader productName="Thanh toán & Đặt hàng" />


        {user?.role === "ADMIN" ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 p-10 text-center space-y-4 shadow-xs max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Tài khoản Quản trị viên (Admin)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Tài khoản Admin chỉ có quyền quản trị hệ thống, xử lý đơn hàng và cấu hình sản phẩm, không thể thực hiện đặt hàng.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Vào trang quản trị (Admin)
              </Link>
            </div>
          </div>
        ) : checkoutItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Không có sản phẩm nào để thanh toán</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Vui lòng chọn sản phẩm và bấm &quot;Mua ngay&quot; hoặc &quot;Tiến hành đặt hàng&quot; từ giỏ hàng.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-98"
            >
              Xem danh mục sản phẩm
            </Link>
          </div>
        ) : (

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Order Items Summary - Independent Scroll on Desktop */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>Sản phẩm đặt mua ({checkoutItems.length})</span>
                  <Link href="/gio-hang" className="text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline">
                    Sửa giỏ hàng
                  </Link>
                </h2>
                <OrderItemsCard items={checkoutItems} editable onUpdateQty={updateCheckoutQty} />
              </div>

              <OrderTotalCard items={checkoutItems} title="Tổng thanh toán" />
            </div>

            {/* Right Column: Customer & Shipping Details Form - Independent Scroll on Desktop */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1">

              {!user && (
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-2xl flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Đã có tài khoản?</span> Đăng nhập để tự động điền địa chỉ và theo dõi đơn hàng dễ dàng.
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#075FA8] text-white text-xs font-bold rounded-xl hover:bg-[#0B1F33] transition-all shrink-0 cursor-pointer !min-h-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl">
                  {error}
                </div>
              )}

              {/* 1. Choose Shipping Method */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  1. Hình thức nhận hàng <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod("DELIVERY")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer !min-h-0 ${
                      shippingMethod === "DELIVERY"
                        ? "bg-blue-50/80 dark:bg-blue-950/60 border-2 border-[#075FA8] dark:border-blue-500 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${shippingMethod === "DELIVERY" ? "bg-[#075FA8] text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">Giao hàng tận nơi</span>
                        {shippingMethod === "DELIVERY" && <CheckCircle2 className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Giao hỏa tốc tại Đà Nẵng & ship toàn quốc
                      </p>
                    </div>
                  </button>

                  {/* Store Pickup */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod("STORE_PICKUP")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer !min-h-0 ${
                      shippingMethod === "STORE_PICKUP"
                        ? "bg-blue-50/80 dark:bg-blue-950/60 border-2 border-[#075FA8] dark:border-blue-500 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${shippingMethod === "STORE_PICKUP" ? "bg-[#075FA8] text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">Lấy tại cửa hàng</span>
                        {shippingMethod === "STORE_PICKUP" && <CheckCircle2 className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Không cần nhập địa chỉ giao hàng
                      </p>
                    </div>
                  </button>
                </div>

                {shippingMethod === "STORE_PICKUP" && (
                  <div className="mt-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Địa chỉ nhận hàng:</strong> {company.address}
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                        Quý khách có thể ghé cửa hàng lấy hàng trong giờ mở cửa: {company.workingHours}.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Customer Information */}
              <div className="space-y-3.5">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Thông tin người nhận <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0905..."
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email (nhận thông báo đơn hàng - không bắt buộc)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Address (only if shippingMethod === "DELIVERY") */}
                {shippingMethod === "DELIVERY" && (
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <VietnamAddressSelector
                      initialAddress={address}
                      onChange={(full) => setAddress(full)}
                      required={shippingMethod === "DELIVERY"}
                    />
                    {user && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        ✓ Địa chỉ này sẽ được tự động lưu vào tài khoản cho những lần đặt hàng sau.
                      </p>
                    )}
                  </div>
                )}


                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghi chú đơn hàng (tuỳ chọn)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..."
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý đặt hàng...</span>
                  </>
                ) : (
                  <span>Xác nhận &amp; Đặt hàng</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
