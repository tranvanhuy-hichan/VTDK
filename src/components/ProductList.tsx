"use client";

import React, { useState, useEffect } from "react";
import { Phone, PackageOpen, X, MessageSquare, Eye } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { Pagination } from "./Pagination";
import { ImageCarousel } from "./ImageCarousel";
import { BTUCalculatorModal } from "./BTUCalculatorModal";

const PAGE_SIZE = 9;

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
  images: string[];
  active: boolean;
  category: Category;
  variants: ProductVariant[];
}

interface ProductListProps {
  initialCategories: Category[];
  initialProducts: Product[];
  company: CompanyContact;
}

const VariantSelector: React.FC<{
  variants: ProductVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}> = ({ variants, selectedIndex, onSelect }) => (
  <div className="flex flex-wrap gap-1.5">
    {variants.map((variant, index) => (
      <button
        key={variant.id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
        className={`!min-h-0 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
          index === selectedIndex
            ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        {variant.label}
      </button>
    ))}
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  hotlineRaw: string;
  onViewDetail: (product: Product) => void;
}> = ({ product, hotlineRaw, onViewDetail }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group text-left cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#075FA8]/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow uppercase tracking-wider pointer-events-none">
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

          {product.variants.length > 0 && (
            <div className="mb-4">
              <VariantSelector
                variants={product.variants}
                selectedIndex={selectedVariantIndex}
                onSelect={setSelectedVariantIndex}
              />
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(product);
              }}
              aria-label="Xem chi tiết"
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-xs transition-colors !min-h-0"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <a
              href={`tel:${hotlineRaw}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Liên hệ ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal: React.FC<{
  product: Product;
  company: CompanyContact;
  onClose: () => void;
}> = ({ product, company, onClose }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <span className="text-xs font-extrabold text-[#075FA8] uppercase tracking-wider">
            {product.category.name}
          </span>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors !min-h-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
            <ImageCarousel images={[product.image, ...product.images]} alt={product.name} className="w-full h-full" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
              {product.name}
            </h2>

            {product.shortDesc && (
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{product.shortDesc}</p>
            )}

            {product.variants.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Chọn phân loại
                </span>
                <VariantSelector
                  variants={product.variants}
                  selectedIndex={selectedVariantIndex}
                  onSelect={setSelectedVariantIndex}
                />
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Giá bán lẻ</span>
              <span className="text-2xl font-black text-orange-600 block mb-4">
                {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`tel:${company.hotlineRaw}`}
                  className="inline-flex items-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Gọi {company.hotline}</span>
                </a>
                <a
                  href={company.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#0068FF]" />
                  <span>Nhắn Zalo</span>
                </a>
              </div>
            </div>
          </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products based on selected tab
  const filteredProducts =
    selectedCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category.slug === selectedCategory);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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
          <div className="mt-5">
            <BTUCalculatorModal />
          </div>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {pagedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  hotlineRaw={company.hotlineRaw}
                  onViewDetail={setDetailProduct}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-xs max-w-md mx-auto">
            <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Chưa có sản phẩm nào được hiển thị trong danh mục này.</p>
          </div>
        )}

      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          company={company}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </section>
  );
};
