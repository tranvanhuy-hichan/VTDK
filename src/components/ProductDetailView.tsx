"use client";

import React, { useState } from "react";
import { Phone, ShieldCheck, MapPin, CheckCircle2, Check, FileText } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";
import { ZaloInquiryButton } from "./ZaloInquiryButton";
import { AddToCartButton } from "./AddToCartButton";
import { buildProductZaloMessage } from "../lib/zaloMessage";

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

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, company }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start text-left">
      {/* Product Image Carousel - Compact sizing on PC */}
      <div className="lg:col-span-5 w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs max-h-[350px] sm:max-h-[380px] mx-auto">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          priority
        />
      </div>

      {/* Product Main Info (Title, Category, Variants, Price & Action CTAs) */}
      <div className="lg:col-span-7 flex flex-col justify-between text-left h-full">
        <div>
          {product.category?.name && (
            <span className="inline-block text-xs font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900 mb-2 sm:mb-3">
              {product.category.name}
            </span>
          )}

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-5 leading-snug">
            {product.name}
          </h1>

          {/* Compact Variant Selector Chips */}
          {product.variants.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <div className="flex items-center text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quy cách / Phân loại:
                </span>
              </div>

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
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
                      )}
                      <span>{variant.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Callout Banner Box */}
          <div className="p-3.5 sm:p-5 bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-orange-200/80 dark:border-slate-700/80 mb-4 shadow-2xs">
            <span className="text-[10px] sm:text-xs text-orange-800/80 dark:text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
              Giá bán lẻ tham khảo
            </span>
            <span className="text-xl sm:text-3xl lg:text-4xl font-black text-orange-600 dark:text-orange-400 tracking-tight block">
              {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
            </span>
          </div>

          {/* Trust Badges Box */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-850/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 mb-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Sản phẩm chính hãng, đầy đủ chứng chỉ CO/CQ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Giá sỉ ưu đãi thợ kỹ thuật &amp; công ty điện lạnh</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0" />
              <span>Xem trực tiếp &amp; thử bo mạch tại 400 Phạm Hùng</span>
            </div>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
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
                message={buildProductZaloMessage({
                  name: product.name,
                  slug: product.slug,
                  variantLabel: selectedVariant?.label,
                  hasPrice: displayPrice > 0,
                })}
                zaloUrl={company.zaloUrl}
                label="Nhắn Zalo"
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

      {/* Product Description & Rich Technical Specs Section */}
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

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1">
            {(() => {
              const lines = product.shortDesc.split("\n");
              const elements: React.ReactNode[] = [];
              let currentList: string[] = [];

              const flushList = (key: string) => {
                if (currentList.length > 0) {
                  elements.push(
                    <ul key={key} className="space-y-2 my-3 pl-2 list-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                      {currentList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                  currentList = [];
                }
              };

              lines.forEach((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) {
                  flushList(`list-${i}`);
                  return;
                }

                if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
                  flushList(`list-${i}`);
                  const text = trimmed.replace(/^#+\s*/, "");
                  elements.push(
                    <h3 key={`h3-${i}`} className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-2 border-l-4 border-[#075FA8] pl-2.5">
                      {text}
                    </h3>
                  );
                } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  currentList.push(trimmed.replace(/^[-*]\s*/, ""));
                } else if (trimmed.includes(":") && !trimmed.startsWith("http") && !trimmed.startsWith("Note")) {
                  flushList(`list-${i}`);
                  const [key, ...valParts] = trimmed.split(":");
                  const val = valParts.join(":").trim();
                  elements.push(
                    <div key={`kv-${i}`} className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{key.replace(/^[#-]\s*/, "").trim()}</span>
                      <span className="sm:col-span-2 text-slate-700 dark:text-slate-300">{val}</span>
                    </div>
                  );
                } else {
                  flushList(`list-${i}`);
                  elements.push(
                    <p key={`p-${i}`} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">
                      {trimmed}
                    </p>
                  );
                }
              });

              flushList("list-end");
              return elements;
            })()}
          </div>

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
