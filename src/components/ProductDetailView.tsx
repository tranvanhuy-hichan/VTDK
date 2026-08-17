"use client";

import React, { useState } from "react";
import { Phone, MessageSquare } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";

interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

interface ProductDetailData {
  name: string;
  shortDesc: string | null;
  image: string;
  images: string[];
  price: number;
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-6 lg:col-span-7 aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-sm min-h-[300px] sm:min-h-[400px]">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          priority
        />
      </div>

      <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between text-left h-full">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-snug">
            {product.name}
          </h1>

          {product.shortDesc && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              {product.shortDesc}
            </p>
          )}

          {product.variants.length > 0 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                Chọn phân loại
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`!min-h-0 px-3.5 py-2 text-xs sm:text-sm font-black rounded-xl border transition-all cursor-pointer ${
                      index === selectedVariantIndex
                        ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-1">
            Giá bán lẻ tham khảo
          </span>
          <span className="text-3xl sm:text-4xl font-black text-orange-600 block mb-6">
            {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
          </span>

          <div className="grid grid-cols-2 gap-3 w-full">
            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md transition-all text-center"
            >
              <Phone className="w-5 h-5 fill-current shrink-0" />
              <span>Gọi tư vấn</span>
            </a>
            <a
              href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md transition-all text-center"
            >
              <MessageSquare className="w-5 h-5 fill-current shrink-0" />
              <span>Nhắn Zalo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
