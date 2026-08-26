"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Share2,
  DownloadCloud,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { OrderItemsCard, OrderTotalCard, OrderRowSkeleton, OrderTotalSkeleton } from "./OrderSummary";
import { PrintableQuoteModal, type QuoteItem } from "../quote/PrintableQuoteModal";
import { ShareCartModal, decodeCartFromSharing } from "./ShareCartModal";
import type { CartItem } from "../../types/cart";
import type { CompanyContact } from "../../lib/company";

interface CartPageViewProps {
  company?: CompanyContact;
}

export const CartPageView: React.FC<CartPageViewProps> = ({ company }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, hydrated, removeItem, updateQty, setCheckoutItems, clear, importItems } = useCart();
  const { user } = useAuth();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedItems, setSharedItems] = useState<CartItem[] | null>(null);
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [importedNotice, setImportedNotice] = useState(false);

  // Check if page opened with ?share=...
  useEffect(() => {
    const shareParam = searchParams.get("share");
    if (shareParam) {
      const decoded = decodeCartFromSharing(shareParam);
      if (decoded && decoded.length > 0) {
        setSharedItems(decoded);
        setIsSharedMode(true);
      }
    }
  }, [searchParams]);

  const displayedItems = useMemo(() => {
    if (isSharedMode && sharedItems) {
      return sharedItems;
    }
    return items;
  }, [isSharedMode, sharedItems, items]);

  const handleClearAll = () => {
    if (window.confirm("Xoá toàn bộ sản phẩm trong giỏ hàng?")) {
      clear();
    }
  };

  const handleImportSharedCart = (andCheckout: boolean = false) => {
    if (!sharedItems || sharedItems.length === 0) return;
    importItems(sharedItems, "replace");
    setImportedNotice(true);
    setIsSharedMode(false);
    // Remove query param from URL without reload
    router.replace("/gio-hang");

    if (andCheckout) {
      setCheckoutItems(sharedItems);
      if (!user) {
        router.push("/dang-nhap?redirect=/thanh-toan");
      } else {
        router.push("/thanh-toan");
      }
    } else {
      setTimeout(() => setImportedNotice(false), 4000);
    }
  };

  const handleProceedToCheckout = () => {
    if (user?.role === "ADMIN") {
      alert("Tài khoản Quản trị viên chỉ có quyền xem và quản lý hệ thống, không thể đặt hàng.");
      return;
    }
    if (isSharedMode && sharedItems) {
      handleImportSharedCart(true);
      return;
    }
    setCheckoutItems(items);
    if (!user) {
      router.push("/dang-nhap?redirect=/thanh-toan");
    } else {
      router.push("/thanh-toan");
    }
  };

  const quoteItems: QuoteItem[] = displayedItems.map((i) => ({
    id: i.key,
    name: i.name,
    variantTitle: i.variantLabel,
    quantity: i.qty,
    price: i.price,
    image: i.image,
  }));

  return (
    <section className="pt-0 pb-10 bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ProductDetailHeader
              productName={
                isSharedMode
                  ? `Giỏ hàng được chia sẻ (${displayedItems.length})`
                  : `Giỏ hàng${hydrated ? ` (${items.length})` : ""}`
              }
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hydrated && displayedItems.length > 0 && user?.role !== "ADMIN" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#075FA8] dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 transition-all cursor-pointer !min-h-0 shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chia sẻ giỏ hàng</span>
                </button>

                {!isSharedMode && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer !min-h-0 px-2 py-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xoá tất cả</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Shared Cart Alert Banner */}
        {isSharedMode && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <PackageCheck className="w-5 h-5 text-cyan-200" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  Bạn đang xem giỏ hàng được chia sẻ ({displayedItems.length} món)
                </h4>
                <p className="text-xs text-blue-100/90">
                  Danh sách vật tư được thợ / khách hàng soạn sẵn với giá bán sỉ chuẩn.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleImportSharedCart(false)}
                className="inline-flex items-center gap-1.5 bg-white text-[#075FA8] hover:bg-blue-50 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer !min-h-0"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Nhập vào giỏ của tôi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSharedMode(false);
                  router.replace("/gio-hang");
                }}
                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-2.5 py-2 rounded-xl border border-white/20 transition-all cursor-pointer !min-h-0"
                title="Quay lại giỏ hàng cá nhân"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giỏ hàng của tôi</span>
              </button>
            </div>
          </div>
        )}

        {/* Imported Success Notice */}
        {importedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 text-xs font-bold shadow-2xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Đã nhập toàn bộ danh sách vật tư vào giỏ hàng của bạn thành công!</span>
          </div>
        )}

        {user?.role === "ADMIN" ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 p-10 text-center space-y-4 shadow-xs max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Tài khoản Quản trị viên (Admin)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Tài khoản Admin chỉ có quyền xem thông tin và quản trị hệ thống, không thể thực hiện đặt
              hàng.
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
        ) : !hydrated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            <div className="lg:col-span-2 lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              <OrderRowSkeleton />
              <OrderRowSkeleton />
              <OrderRowSkeleton />
            </div>
            <div className="lg:col-span-1 lg:h-full lg:overflow-y-auto">
              <OrderTotalSkeleton />
            </div>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Giỏ hàng của bạn đang trống
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Khám phá danh mục ống đồng, gas lạnh, linh kiện điều hòa chính hãng và thêm vào giỏ hàng
              ngay.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>Xem danh mục sản phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[calc(100vh-11rem)]">
            <OrderItemsCard
              items={displayedItems}
              editable={!isSharedMode}
              onRemove={removeItem}
              onUpdateQty={updateQty}
              className="lg:col-span-2 lg:h-full lg:overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800"
            />

            <div className="lg:col-span-1 lg:h-full lg:overflow-y-auto space-y-3">
              <OrderTotalCard
                items={displayedItems}
                freeshipThreshold={company?.freeshipThreshold}
              >
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>{isSharedMode ? "Mua ngay danh sách này" : "Tiến hành đặt hàng"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all active:scale-98 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                  <span>Chia sẻ giỏ hàng qua Zalo / Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#075FA8] dark:text-blue-400 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-800/80 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                  <span>Tải Báo Giá PDF (B2B)</span>
                </button>

                <Link
                  href="/san-pham"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </OrderTotalCard>
            </div>
          </div>
        )}
      </div>

      {/* Printable Quote Modal */}
      <PrintableQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        items={quoteItems}
        company={company}
        initialCustomerName={user?.name || undefined}
        initialCustomerPhone={user?.phone || undefined}
      />

      {/* Share Cart Modal */}
      <ShareCartModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={displayedItems}
      />
    </section>
  );
};
