"use client";

import React from "react";
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, company }) => {
  const router = useRouter();

  // Calculate price display (Min price - Max price range if variants have different prices)
  const validPrices =
    product.variants.length > 0
      ? product.variants.map((v) => v.price).filter((p) => p > 0)
      : product.price > 0
      ? [product.price]
      : [];

  let priceDisplay = "Liên hệ báo giá";
  if (validPrices.length > 0) {
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    if (minPrice === maxPrice) {
      priceDisplay = `${minPrice.toLocaleString("vi-VN")}đ`;
    } else {
      priceDisplay = `${minPrice.toLocaleString("vi-VN")}đ - ${maxPrice.toLocaleString("vi-VN")}đ`;
    }
  }

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
        </div>

        {/* Price & Action */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-3 mt-auto">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
              {product.variants.length > 0 ? "Giá bán lẻ (Theo quy cách)" : "Giá bán lẻ"}
            </span>
            <span className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 truncate block">
              {priceDisplay}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <a
              href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Nhắn Zalo báo giá"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#0068FF] hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
