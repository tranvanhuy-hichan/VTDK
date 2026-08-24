"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import {
  Phone,
  ShieldCheck,
  MapPin,
  Wrench,
  Check,
  FileText,
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  X,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "./ImageCarousel";
import { ProductDescription } from "./ProductDescription";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { flyToCart } from "../../lib/flyToCart";
import { formatCurrency } from "../../lib/format";

interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

interface ProductDetailData {
  name: string;
  slug: string;
  shortDesc: string | null;
  image: string;
  images: string[];
  price: number;
  category?: { name: string };
  variants: ProductVariant[];
}

interface ProductDetailViewProps {
  product: ProductDetailData;
  company: CompanyContact;
}

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    desc: "Đầy đủ CO/CQ xuất xứ",
  },
  {
    icon: Wrench,
    title: "Giá sỉ cho thợ",
    desc: "Chiết khấu cao thợ & công trình",
  },
  {
    icon: MapPin,
    title: "Thử tại kho",
    desc: "Kiểm tra trực tiếp tại Đà Nẵng",
  },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, company }) => {
  const router = useRouter();
  const { addItem, setCheckoutItems } = useCart();
  const { user } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [modalQty, setModalQty] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleOpenModal = () => {
    if (user?.role === "ADMIN") {
      alert("Tài khoản Quản trị viên chỉ có quyền xem và quản lý, không thể đặt hàng.");
      return;
    }
    setModalQty(1);
    setIsModalOpen(true);
  };

  const handleAddToCartConfirm = () => {
    const currentCartItem = {
      key: selectedVariant ? `${product.slug}::${selectedVariant.label}` : product.slug,
      slug: product.slug,
      name: product.name,
      variantLabel: selectedVariant?.label,
      price: displayPrice,
      image: product.image,
    };

    addItem(currentCartItem, modalQty);
    setIsModalOpen(false);

    if (addToCartBtnRef.current) {
      flyToCart(product.image, addToCartBtnRef.current);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNowConfirm = () => {
    const currentCartItem = {
      key: selectedVariant ? `${product.slug}::${selectedVariant.label}` : product.slug,
      slug: product.slug,
      name: product.name,
      variantLabel: selectedVariant?.label,
      price: displayPrice,
      image: product.image,
      qty: modalQty,
    };

    setCheckoutItems([currentCartItem]);
    setIsModalOpen(false);

    if (!user) {
      router.push("/dang-nhap?redirect=/thanh-toan");
    } else {
      router.push("/thanh-toan");
    }
  };

  const modalContent = isModalOpen ? (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left animate-in fade-in duration-200"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs font-black text-orange-600 dark:text-orange-400 mt-0.5">
              {formatCurrency(displayPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Đóng"
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {/* Variant Selector inside Modal */}
          {product.variants.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quy cách / Phân loại
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant, index) => {
                  const isSelected = index === selectedVariantIndex;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`!min-h-0 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/80 border-2 border-[#075FA8] dark:border-blue-500 text-[#075FA8] dark:text-blue-300 shadow-2xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>{variant.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector inside Modal */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Số lượng
            </span>
            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                disabled={modalQty <= 1}
                aria-label="Giảm số lượng"
                className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">{modalQty}</span>
              <button
                type="button"
                onClick={() => setModalQty((q) => q + 1)}
                aria-label="Tăng số lượng"
                className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer !min-h-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Price Calculation */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
                Đơn giá
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {formatCurrency(displayPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
                Tổng cộng
              </span>
              <span className="text-base font-black text-orange-600 dark:text-orange-400">
                {displayPrice > 0 ? formatCurrency(displayPrice * modalQty) : "Liên hệ báo giá"}
              </span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCartConfirm}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer !min-h-0"
            >
              <ShoppingCart className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Thêm giỏ</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNowConfirm}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-3 px-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Mua ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start text-left">
      {/* Product Image */}
      <div className="lg:col-span-5 w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs max-h-[320px] sm:max-h-[360px] mx-auto">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          priority
        />
      </div>

      {/* Product Main Info */}
      <div className="lg:col-span-7 flex flex-col justify-between text-left h-full">
        <div className="space-y-3.5">
          <div>
            {product.category?.name && (
              <span className="inline-block text-xs font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900 mb-1.5 sm:mb-2">
                {product.category.name}
              </span>
            )}

            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
              {formatCurrency(displayPrice)}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold">Giá bán lẻ niêm yết</span>
          </div>

          {/* Variant Selector on Main Page */}
          {product.variants.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quy cách / Phân loại
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.variants.map((variant, index) => {
                  const isSelected = index === selectedVariantIndex;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`!min-h-0 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/80 border-2 border-[#075FA8] dark:border-blue-500 text-[#075FA8] dark:text-blue-300 shadow-2xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />}
                      <span>{variant.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* E-Commerce Action Buttons: Clicking opens option modal */}
        <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-3.5 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          {user?.role === "ADMIN" ? (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Tài khoản Quản trị viên (Admin)</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Tài khoản admin chỉ có quyền quản trị, không thể thực hiện đặt hàng.
              </p>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer !min-h-0"
              >
                <span>Đến trang quản lý sản phẩm</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
              <button
                ref={addToCartBtnRef}
                type="button"
                onClick={handleOpenModal}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl border transition-all cursor-pointer !min-h-0 ${
                  justAdded
                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-600 dark:text-emerald-400 animate-cart-pop"
                    : "bg-blue-50/70 hover:bg-blue-100/80 dark:bg-slate-800 dark:hover:bg-slate-700 border-blue-200 dark:border-slate-700 text-[#075FA8] dark:text-blue-300"
                }`}
              >
                {justAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />}
                <span className="truncate">{justAdded ? "Đã thêm!" : "Thêm vào giỏ"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300 shrink-0" />
                <span className="truncate">Mua ngay</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Modal via Portal */}
      {mounted && modalContent && createPortal(modalContent, document.body)}

      {/* Product Description & Technical Specs Card - Space Efficient */}
      <div className="lg:col-span-12 p-3.5 sm:p-5 lg:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3 sm:space-y-4 mt-1 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-black text-xs sm:text-base">
            <FileText className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0" />
            <span>Thông Tin Chi Tiết &amp; Thông Số Kỹ Thuật</span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#075FA8] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/80 px-2 sm:px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900 shrink-0">
            Chính Hãng • Có Sẵn
          </span>
        </div>

        {/* Product Description Content */}
        {product.shortDesc ? (
          <ProductDescription shortDesc={product.shortDesc} />
        ) : (
          <p className="text-xs sm:text-sm text-slate-500 italic">
            Sản phẩm chính hãng cung cấp bởi {company.name}. Vui lòng liên hệ hotline để nhận catalog chi tiết.
          </p>
        )}

        {/* 3 Compact Trust Badges in a single 3-column row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">{title}</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight hidden sm:block truncate">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Store Consultation Banner (1-row) */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
            <p className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 truncate">
              Kho hàng: <strong className="font-semibold text-slate-900 dark:text-white">{company.address}</strong>
            </p>
          </div>
          <a
            href={`tel:${company.hotlineRaw}`}
            className="inline-flex items-center gap-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 shadow-2xs transition-colors cursor-pointer !min-h-0"
          >
            <Phone className="w-3 h-3 fill-current" />
            <span>{company.hotline}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
