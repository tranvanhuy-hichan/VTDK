"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Truck,
  Store,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Loader2,
  CheckCircle2,
  LogIn,
  ShieldCheck,
  Package,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrderAction } from "../../actions/orderActions";
import type { CompanyContact } from "../../lib/company";
import type { ShippingMethod } from "../../types/order";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "../cart/OrderSummary";
import { VietnamAddressSelector } from "../address/VietnamAddressSelector";
import { calculateShippingFee } from "../../lib/shipping";

interface CheckoutPageViewProps {
  company: CompanyContact;
}

export const CheckoutPageView: React.FC<CheckoutPageViewProps> = ({ company }) => {
  const router = useRouter();
  const { checkoutItems, hydrated, updateCheckoutQty, removeItem } = useCart();
  const { user, openAuthModal } = useAuth();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("DELIVERY");
  const [provinceCode, setProvinceCode] = useState<string>("48"); // Default Đà Nẵng
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

  // Calculate subtotal
  const subtotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [checkoutItems]
  );

  // Dynamic shipping calculation based on Admin settings
  const shippingCalculation = useMemo(
    () =>
      calculateShippingFee({
        shippingMethod,
        provinceCode,
        subtotal,
        company,
      }),
    [shippingMethod, provinceCode, subtotal, company]
  );

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
      shippingFee: shippingCalculation.shippingFee,
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
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-4">
          <ProductDetailHeader productName="Thanh toán & Đặt hàng" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <OrderRowSkeleton />
                <OrderRowSkeleton />
              </div>
              <OrderTotalSkeleton />
            </div>
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
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
    <section className="pt-0 pb-16 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-4 text-left">
        <ProductDetailHeader productName="Thanh toán & Đặt hàng" />

        {user?.role === "ADMIN" ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-amber-200 dark:border-amber-900/60 p-6 sm:p-10 text-center space-y-4 shadow-xs max-w-2xl mx-auto my-4 sm:my-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Tài khoản Quản trị viên (Admin)</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Tài khoản Admin chỉ có quyền quản trị hệ thống, xử lý đơn hàng và cấu hình sản phẩm, không thể thực hiện đặt hàng.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Vào trang quản trị (Admin)
              </Link>
            </div>
          </div>
        ) : checkoutItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-3.5 sm:space-y-4 shadow-xs">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Không có sản phẩm nào để thanh toán</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Vui lòng chọn sản phẩm và bấm &quot;Mua ngay&quot; hoặc &quot;Tiến hành đặt hàng&quot; từ giỏ hàng.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-md transition-all active:scale-98"
            >
              Xem danh mục sản phẩm
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-start">
            {/* Left Column on Desktop, Top Order on Mobile: Order Items Summary & Total */}
            <div className="order-1 lg:order-1 lg:col-span-5 space-y-3 sm:space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-0 lg:pr-1">
              {/* Items Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                    <h2 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white">
                      Sản phẩm đặt mua ({checkoutItems.length})
                    </h2>
                  </div>
                  <Link href="/gio-hang" className="text-[11px] sm:text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline">
                    Sửa giỏ hàng
                  </Link>
                </div>
                <OrderItemsCard items={checkoutItems} editable onUpdateQty={updateCheckoutQty} />
              </div>

              {/* Total Card */}
              <OrderTotalCard
                items={checkoutItems}
                shippingFee={shippingCalculation.shippingFee}
                shippingLabel={shippingCalculation.label}
                amountNeededForFreeship={shippingCalculation.amountNeededForFreeship}
                freeshipThreshold={company.freeshipThreshold}
              />
            </div>

            {/* Right Column on Desktop, Bottom Order on Mobile: Customer & Shipping Details Form */}
            <div className="order-2 lg:order-2 lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-6 lg:p-7 shadow-xs space-y-4 sm:space-y-5">
              {!user && (
                <div className="p-3 sm:p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl sm:rounded-2xl flex flex-wrap items-center justify-between gap-2.5">
                  <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Đã có tài khoản?</span> Đăng nhập để tự động điền địa chỉ.
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
                <div className="p-3 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl">
                  {error}
                </div>
              )}

              {/* 1. Choose Shipping Method */}
              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  1. Hình thức nhận hàng <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {/* Delivery */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod("DELIVERY")}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer !min-h-0 ${
                      shippingMethod === "DELIVERY"
                        ? "bg-blue-50/80 dark:bg-blue-950/60 border-2 border-[#075FA8] dark:border-blue-500 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${
                        shippingMethod === "DELIVERY"
                          ? "bg-[#075FA8] text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          Giao hàng tận nơi
                        </span>
                        {shippingMethod === "DELIVERY" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {shippingCalculation.label}
                      </p>
                    </div>
                  </button>

                  {/* Store Pickup */}
                  <button
                    type="button"
                    onClick={() => setShippingMethod("STORE_PICKUP")}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer !min-h-0 ${
                      shippingMethod === "STORE_PICKUP"
                        ? "bg-blue-50/80 dark:bg-blue-950/60 border-2 border-[#075FA8] dark:border-blue-500 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${
                        shippingMethod === "STORE_PICKUP"
                          ? "bg-[#075FA8] text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          Lấy tại cửa hàng
                        </span>
                        {shippingMethod === "STORE_PICKUP" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Miễn phí (Lấy tại kho Phạm Hùng)
                      </p>
                    </div>
                  </button>
                </div>

                {shippingMethod === "STORE_PICKUP" ? (
                  <div className="mt-2.5 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl sm:rounded-2xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <strong>Địa chỉ nhận hàng:</strong> {company.address}
                      <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                        Quý khách có thể ghé cửa hàng lấy hàng trong giờ mở cửa: {company.workingHours}.
                      </p>
                    </div>
                  </div>
                ) : (
                  company.shippingNote && (
                    <div className="mt-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{company.shippingNote}</span>
                    </div>
                  )
                )}
              </div>

              {/* 2. Customer Information */}
              <div className="space-y-3 sm:space-y-3.5">
                <label className="block text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Thông tin người nhận <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0905..."
                        required
                        className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email (nhận thông báo đơn hàng - không bắt buộc)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Address (only if shippingMethod === "DELIVERY") */}
                {shippingMethod === "DELIVERY" && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <VietnamAddressSelector
                      initialAddress={address}
                      onChange={(full, detail) => {
                        setAddress(full);
                        if (detail?.provinceCode) {
                          setProvinceCode(detail.provinceCode);
                        }
                      }}
                      required={shippingMethod === "DELIVERY"}
                    />
                    {user && (
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        ✓ Địa chỉ này sẽ được tự động lưu vào tài khoản cho những lần đặt hàng sau.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghi chú đơn hàng (tuỳ chọn)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..."
                      rows={2}
                      className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
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
