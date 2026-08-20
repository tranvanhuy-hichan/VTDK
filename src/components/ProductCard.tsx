"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";
import { ZaloInquiryButton } from "./ZaloInquiryButton";
import { AddToCartOptionsButton } from "./AddToCartOptionsButton";
import { buildProductZaloMessage } from "../lib/zaloMessage";

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

// Helper function to format large prices into compact notation (e.g. 50k, 1.2M, 1.95M)
function formatPriceCompact(num: number): string {
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.?0+$/, "");
    return `${formatted}M`;
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(1).replace(/\.?0+$/, "");
    return `${formatted}k`;
  }
  return `${num.toLocaleString("vi-VN")}đ`;
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
      const fullRangeStr = `${minPrice.toLocaleString("vi-VN")}đ - ${maxPrice.toLocaleString("vi-VN")}đ`;
      // If the full price range text is long, switch to compact abbreviated notation (e.g. 180k - 1.95M)
      if (fullRangeStr.length > 17) {
        priceDisplay = `${formatPriceCompact(minPrice)} - ${formatPriceCompact(maxPrice)}`;
      } else {
        priceDisplay = fullRangeStr;
      }
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
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 sm:mb-2.5 line-clamp-2">
            <Link
              href={`/san-pham/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 mt-auto">
          {/* Row 1: Full-width Large Price */}
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider mb-0.5">
              {product.variants.length > 0 ? "Giá bán lẻ (Theo quy cách)" : "Giá bán lẻ"}
            </span>
            <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 tracking-tight block truncate">
              {priceDisplay}
            </span>
          </div>

          {/* Row 2: Zalo Contact Button + Add to Cart */}
          <div className="flex gap-2">
            <ZaloInquiryButton
              buildMessage={(picked) =>
                buildProductZaloMessage({
                  name: product.name,
                  slug: product.slug,
                  variantLabel: picked?.variantLabel,
                  price: picked ? picked.price : validPrices.length > 0 ? Math.min(...validPrices) : 0,
                  qty: picked?.qty,
                  mode: company.hasDelivery ? "buy" : "inquire",
                })
              }
              picker={{
                product: {
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                },
                variants: product.variants,
              }}
              zaloUrl={company.zaloUrl}
              label={company.hasDelivery ? "Mua ngay" : "Liên hệ ngay"}
              mobileLabel={company.hasDelivery ? "Mua" : undefined}
              iconOnly={!company.hasDelivery}
              requireBuyerInfo={company.hasDelivery}
              className={
                company.hasDelivery
                  ? "flex-1 min-w-0 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer"
                  : "flex-1 min-w-0 bg-[#0068FF] hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center transition-all active:scale-98 shadow-xs cursor-pointer"
              }
            />
            <AddToCartOptionsButton
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              }}
              variants={product.variants}
              sizeClassName={company.hasDelivery ? "w-10 h-10" : "flex-1 h-9"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
