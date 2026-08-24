"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Phone, ShieldCheck, MapPin, Wrench, Check, FileText, ShoppingCart, Zap, Minus, Plus } from "lucide-react";
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
  { icon: ShieldCheck, label: "Chính hãng, đủ CO/CQ" },
  { icon: Wrench, label: "Giá sỉ ưu đãi thợ" },
  { icon: MapPin, label: "Xem & thử tại kho" },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, company }) => {
  const router = useRouter();
  const { addItem, setCheckoutItems } = useCart();
  const { user, openAuthModal } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const currentCartItem = {
    key: selectedVariant ? `${product.slug}::${selectedVariant.label}` : product.slug,
    slug: product.slug,
    name: product.name,
    variantLabel: selectedVariant?.label,
    price: displayPrice,
    image: product.image,
  };

  const handleAddToCart = () => {
    addItem(currentCartItem, qty);
    if (addToCartBtnRef.current) {
      flyToCart(product.image, addToCartBtnRef.current);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setCheckoutItems([{ ...currentCartItem, qty }]);
    if (!user) {
      router.push("/dang-nhap?redirect=/thanh-toan");
    } else {
      router.push("/thanh-toan");
    }
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start text-left">
      {/* Product Image */}
      <div className="lg:col-span-5 w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs max-h-[350px] sm:max-h-[380px] mx-auto">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          priority
        />
      </div>

      {/* Product Main Info */}
      <div className="lg:col-span-7 flex flex-col justify-between text-left h-full">
        <div className="space-y-4">
          <div>
            {product.category?.name && (
              <span className="inline-block text-xs font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900 mb-2 sm:mb-3">
                {product.category.name}
              </span>
            )}

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
              {formatCurrency(displayPrice)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Giá bán lẻ niêm yết</span>
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                      className={`!min-h-0 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
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

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Số lượng
            </span>
            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Giảm số lượng"
                className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-black text-slate-900 dark:text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Tăng số lượng"
                className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer !min-h-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* E-Commerce Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {user?.role === "ADMIN" ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Tài khoản Quản trị viên (Admin)</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Tài khoản admin chỉ có quyền xem thông tin và quản trị danh mục, không thể thực hiện đặt hàng.
              </p>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer !min-h-0"
              >
                <span>Đến trang quản lý sản phẩm</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <button
                ref={addToCartBtnRef}
                type="button"
                onClick={handleAddToCart}
                className={`inline-flex items-center justify-center gap-2 font-black text-sm sm:text-base py-3.5 px-4 rounded-xl border transition-all cursor-pointer !min-h-0 ${
                  justAdded
                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-600 dark:text-emerald-400 animate-cart-pop"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                {justAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5 text-[#075FA8] dark:text-blue-400" />}
                <span>{justAdded ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
              >
                <Zap className="w-5 h-5 fill-current text-amber-300" />
                <span>Mua ngay</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Product Description & Technical Specs */}
      {product.shortDesc && (
        <div className="lg:col-span-12 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 mt-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <FileText className="w-5 h-5 text-[#075FA8] dark:text-blue-400 shrink-0" />
              <span>Thông Tin Chi Tiết &amp; Thông Số Kỹ Thuật</span>
            </div>
            <span className="text-xs text-[#075FA8] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900">
              Chính Hãng • Có Sẵn Tại Đà Nẵng
            </span>
          </div>

          <ProductDescription shortDesc={product.shortDesc} />

          {/* Da Nang Store Visit & Consultation Box */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#075FA8] dark:text-blue-300 uppercase tracking-wide">
                Xem Hàng &amp; Thử Linh Kiện Trực Tiếp Tại Cửa Hàng
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Ghé kho {company.address} để kiểm tra, đối chiếu mã linh kiện và nhận tư vấn kỹ thuật trực tiếp.
              </p>
            </div>
            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center gap-1.5 bg-[#075FA8] text-white px-4 py-2 rounded-lg text-xs font-bold shrink-0 hover:bg-[#0B1F33] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Hotline Kỹ Thuật: {company.hotline}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
