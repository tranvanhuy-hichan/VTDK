"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  shortDesc: string | null;
  image: string;
  images: string[];
  active: boolean;
  category: Category;
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: ProductCardData;
  company: CompanyContact;
}

const VariantSelector: React.FC<{
  variants: ProductVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}> = ({ variants, selectedIndex, onSelect }) => (
  <div className="flex flex-wrap gap-1">
    {variants.map((variant, index) => (
      <button
        key={variant.id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
        className={`!min-h-0 px-2 py-1 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
          index === selectedIndex
            ? "bg-[#075FA8] border-[#075FA8] text-white shadow-2xs"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        }`}
      >
        {variant.label}
      </button>
    ))}
  </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, company }) => {
  const router = useRouter();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div
      onClick={() => router.push(`/san-pham/${product.slug}`)}
      className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 flex flex-col overflow-hidden group text-left cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        <span className="hidden sm:inline absolute top-2.5 left-2.5 bg-[#075FA8]/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow uppercase tracking-wider pointer-events-none">
          {product.category.name}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-1 sm:mb-1.5 line-clamp-2">
            <Link
              href={`/san-pham/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors"
            >
              {product.name}
            </Link>
          </h3>


          {product.variants.length > 0 && (
            <div className="hidden sm:block mb-2">
              <VariantSelector
                variants={product.variants}
                selectedIndex={selectedVariantIndex}
                onSelect={setSelectedVariantIndex}
              />
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-3 mt-auto">
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Giá bán lẻ</span>
            <span className="text-sm sm:text-base font-black text-orange-600 dark:text-orange-400 truncate block">
              {displayPrice > 0
                ? `${displayPrice.toLocaleString("vi-VN")}đ`
                : "Liên hệ báo giá"}
            </span>
            {product.variants.length > 0 && (
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block">
                {product.variants.length} phân loại
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Nhắn Zalo báo giá"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs p-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Nhắn Zalo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
