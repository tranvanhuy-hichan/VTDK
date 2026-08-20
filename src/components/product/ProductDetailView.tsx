"use client";

import React, { useState } from "react";
import { Phone, ShieldCheck, MapPin, Wrench, Check, FileText } from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "./ImageCarousel";
import { ProductDescription } from "./ProductDescription";
import { ZaloInquiryButton } from "../zalo/ZaloInquiryButton";
import { AddToCartButton } from "../cart/AddToCartButton";
import { buildProductZaloMessage } from "../../lib/zaloMessage";

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
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

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
              {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Giá bán lẻ tham khảo</span>
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
                      className={`!min-h-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
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

        {/* Contact Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2.5 w-full">
            <div className="grid grid-cols-2 gap-2.5 flex-1 min-w-0">
              <a
                href={`tel:${company.hotlineRaw}`}
                className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-base py-3 px-3 rounded-xl shadow-md transition-all text-center active:scale-98"
              >
                <Phone className="w-4 h-4 fill-current shrink-0 animate-pulse-subtle" />
                <span>Gọi tư vấn</span>
              </a>
              <ZaloInquiryButton
                buildMessage={() =>
                  buildProductZaloMessage({
                    name: product.name,
                    slug: product.slug,
                    variantLabel: selectedVariant?.label,
                    price: displayPrice,
                    mode: company.hasDelivery ? "buy" : "inquire",
                  })
                }
                checkoutItem={{
                  key: selectedVariant ? `${product.slug}::${selectedVariant.label}` : product.slug,
                  slug: product.slug,
                  name: product.name,
                  variantLabel: selectedVariant?.label,
                  price: displayPrice,
                  image: product.image,
                }}
                zaloUrl={company.zaloUrl}
                label={company.hasDelivery ? "Mua ngay" : "Nhắn Zalo"}
                mobileLabel={company.hasDelivery ? "Mua" : undefined}
                requireBuyerInfo={company.hasDelivery}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-black text-xs sm:text-base py-3 px-3 rounded-xl shadow-md transition-all text-center active:scale-98 w-full"
              />
            </div>
            <AddToCartButton
              item={{
                key: selectedVariant ? `${product.slug}::${selectedVariant.label}` : product.slug,
                slug: product.slug,
                name: product.name,
                variantLabel: selectedVariant?.label,
                price: displayPrice,
                image: product.image,
              }}
              sizeClassName="w-14 h-auto"
            />
          </div>
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
                Ghé kho 400 Phạm Hùng, Đà Nẵng để kiểm tra, đối chiếu mã linh kiện và nhận tư vấn kỹ thuật trực tiếp.
              </p>
            </div>
            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center gap-1.5 bg-[#075FA8] text-white px-4 py-2 rounded-lg text-xs font-bold shrink-0 hover:bg-[#0B1F33] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Gọi Báo Giá Sỉ: {company.hotline}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
