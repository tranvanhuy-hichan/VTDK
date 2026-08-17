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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          priority
        />
      </div>

      <div className="flex flex-col text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {product.name}
        </h1>

        {product.shortDesc && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
            {product.shortDesc}
          </p>
        )}

        {product.variants.length > 0 && (
          <div className="mb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Chọn phân loại
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`!min-h-0 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                    index === selectedVariantIndex
                      ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-5 border-t border-slate-200">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Giá bán lẻ</span>
          <span className="text-2xl sm:text-3xl font-black text-orange-600 block mb-5">
            {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
          </span>

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm py-3 px-2 rounded-xl shadow-xs transition-colors text-center"
            >
              <Phone className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">Gọi {company.hotline}</span>
            </a>
            <a
              href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3 px-2 rounded-xl shadow-xs transition-colors text-center"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">Nhắn Zalo Báo Giá</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
