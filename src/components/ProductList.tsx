"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, PackageOpen, X, MessageSquare, Search, ChevronDown } from "lucide-react";
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
        className={`!min-h-0 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
          index === selectedIndex
            ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        }`}
      >
        {variant.label}
      </button>
    ))}
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  company: CompanyContact;
  onViewDetail: (product: Product) => void;
}> = ({ product, company, onViewDetail }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant =
    product.variants.length > 0 ? product.variants[selectedVariantIndex] : null;
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 flex flex-col overflow-hidden group text-left cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <ImageCarousel
          images={[product.image, ...product.images]}
          alt={product.name}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        <span className="hidden sm:inline absolute top-3 left-3 bg-[#075FA8]/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow uppercase tracking-wider pointer-events-none">
          {product.category.name}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1.5 sm:mb-2 line-clamp-2">
            <Link
              href={`/san-pham/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          {product.shortDesc && (
            <p className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
              {product.shortDesc}
            </p>
          )}

          {product.variants.length > 0 && (
            <div className="hidden sm:block mb-2 sm:mb-4">
              <VariantSelector
                variants={product.variants}
                selectedIndex={selectedVariantIndex}
                onSelect={setSelectedVariantIndex}
              />
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 mt-auto">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Giá bán lẻ</span>
            <span className="text-sm sm:text-lg font-black text-orange-600 dark:text-orange-400 truncate block">
              {displayPrice > 0
                ? `${displayPrice.toLocaleString("vi-VN")}đ`
                : "Liên hệ báo giá"}
            </span>
            {product.variants.length > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 block">
                {product.variants.length} phân loại
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Nhắn Zalo báo giá"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm p-2.5 sm:py-2.5 sm:px-4 rounded-xl shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="hidden sm:inline">Nhắn Zalo</span>
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
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 text-left flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
          <span className="text-xs font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
            {product.category.name}
          </span>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8 items-start">
          {/* Image carousel container */}
          <div className="md:col-span-6 lg:col-span-7 aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full min-h-[280px] sm:min-h-[380px]">
            <ImageCarousel
              images={[product.image, ...product.images]}
              alt={product.name}
              className="w-full h-full"
              priority
            />
          </div>

          {/* Details & Actions container */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between h-full text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4 leading-snug">
                {product.name}
              </h2>

              {product.shortDesc && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  {product.shortDesc}
                </p>
              )}

              {product.variants.length > 0 && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                    Chọn phân loại sản phẩm
                  </span>
                  <VariantSelector
                    variants={product.variants}
                    selectedIndex={selectedVariantIndex}
                    onSelect={setSelectedVariantIndex}
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-4 sm:mt-6">
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider mb-1">
                Giá bán lẻ tham khảo
              </span>
              <span className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 block mb-6">
                {displayPrice > 0 ? `${displayPrice.toLocaleString("vi-VN")}đ` : "Liên hệ báo giá"}
              </span>

              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href={`tel:${company.hotlineRaw}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-black text-sm sm:text-base py-3.5 px-3 sm:px-5 rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  <Phone className="w-5 h-5 fill-current shrink-0" />
                  <span>Gọi tư vấn</span>
                </a>
                <a
                  href={`${company.zaloUrl}?text=${encodeURIComponent(`Chào Đông Kha, tôi muốn tư vấn báo giá sản phẩm: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-black text-sm sm:text-base py-3.5 px-3 sm:px-5 rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  <MessageSquare className="w-5 h-5 fill-current shrink-0" />
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Pick up ?q= from the header search on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchTerm(q);
  }, []);

  // Filter products based on selected tab + search term
  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category.slug === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <section id="san-pham" className="py-12 sm:py-16 bg-[#F6F8FA] dark:bg-[#0F172A] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-[#075FA8] dark:text-blue-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
            DANH SÁCH SẢN PHẨM VẬT TƯ
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Sản phẩm phân phối chính hãng
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
            Bảng giá tham khảo vật tư điện lạnh chất lượng cao của Đông Kha.
          </p>
        </div>

        {/* Unified Search & Category Control Toolbar */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          
          {/* Top Row: Search Input + BTU Calculator Modal Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm theo tên..."
                className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#075FA8] shadow-2xs transition-all"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Xóa tìm kiếm"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 !min-h-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <BTUCalculatorModal />
            </div>
          </div>

          {/* Category Filter: Mobile Dropdown Select (< sm) vs Desktop Full Buttons (>= sm) */}
          <div>
            {/* Mobile Dropdown Select */}
            <div className="sm:hidden relative w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 font-bold text-sm text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-none focus:border-[#075FA8] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#075FA8]"
              >
                <option value="all">Tất cả danh mục sản phẩm</option>
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-500">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            {/* Desktop Full Category Buttons Row */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`!min-h-0 px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                }`}
              >
                Tất cả
              </button>

              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`!min-h-0 px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
              {pagedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  company={company}
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
          <div className="text-center py-12 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs max-w-md mx-auto">
            <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {searchTerm
                ? `Không tìm thấy sản phẩm nào khớp với "${searchTerm}".`
                : "Chưa có sản phẩm nào được hiển thị trong danh mục này."}
            </p>
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
