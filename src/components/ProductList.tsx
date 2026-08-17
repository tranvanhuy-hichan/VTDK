"use client";

import React, { useState } from "react";
import { Phone, Grid, PackageOpen } from "lucide-react";
import type { CompanyContact } from "../lib/company";

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

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  shortDesc: string | null;
  image: string;
  active: boolean;
  category: Category;
  variants: ProductVariant[];
}

interface ProductListProps {
  initialCategories: Category[];
  initialProducts: Product[];
  company: CompanyContact;
}

const ProductCard: React.FC<{ product: Product; hotlineRaw: string }> = ({ product, hotlineRaw }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group text-left">
      {/* Product Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#075FA8]/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow uppercase tracking-wider">
          {product.category.name}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#075FA8] transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
              {product.shortDesc}
            </p>
          )}

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`!min-h-0 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    index === selectedVariantIndex
                      ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Giá bán lẻ</span>
            <span className="text-lg font-black text-orange-600">
              {displayPrice > 0
                ? `${displayPrice.toLocaleString("vi-VN")}đ`
                : "Liên hệ báo giá"}
            </span>
          </div>

          <a
            href={`tel:${hotlineRaw}`}
            className="inline-flex items-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Liên hệ ngay</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const ProductList: React.FC<ProductListProps> = ({
  initialCategories,
  initialProducts,
  company,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter products based on selected tab
  const filteredProducts =
    selectedCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category.slug === selectedCategory);

  return (
    <section id="san-pham" className="py-16 sm:py-24 bg-[#F6F8FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 border border-blue-200 text-[#075FA8] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            DANH SÁCH SẢN PHẨM VẬT TƯ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sản phẩm phân phối chính hãng
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Bảng giá tham khảo vật tư điện lạnh chất lượng cao của Đông Kha.
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`!min-h-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
              selectedCategory === "all"
                ? "bg-[#075FA8] border-[#075FA8] text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`!min-h-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#075FA8] border-[#075FA8] text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} hotlineRaw={company.hotlineRaw} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-xs max-w-md mx-auto">
            <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Chưa có sản phẩm nào được hiển thị trong danh mục này.</p>
          </div>
        )}

      </div>
    </section>
  );
};
