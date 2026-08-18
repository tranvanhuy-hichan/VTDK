"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Phone,
  MessageSquare,
  Package,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  Grid,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";
import { BTUCalculatorModal } from "./BTUCalculatorModal";
import { ProductDetailModal } from "./ProductList";

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

interface AllProductsCatalogProps {
  categories: Category[];
  products: Product[];
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
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
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
      className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 flex flex-col overflow-hidden group text-left cursor-pointer"
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
          {product.shortDesc && (
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5 line-clamp-2">
              {product.shortDesc}
            </p>
          )}

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

export const AllProductsCatalog: React.FC<AllProductsCatalogProps> = ({
  categories,
  products,
  company,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryPillClick = (catSlug: string) => {
    setActiveCategoryFilter(catSlug);
    if (catSlug !== "all") {
      const element = document.getElementById(`cat-${catSlug}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-16">
      
      {/* 1. Professional Compact Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#075FA8] to-slate-900 text-white py-5 sm:py-7 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto relative z-10 space-y-2.5">
          {/* Breadcrumb back button */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-xl transition-colors backdrop-blur-xs !min-h-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trở về Trang chủ</span>
            </Link>
          </div>

          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-blue-200 border border-white/15 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>TỔNG KHO VẬT TƯ & THIẾT BỊ ĐIỆN LẠNH ĐÀ NẴNG</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white max-w-3xl mx-auto">
              Tất Cả Sản Phẩm &amp; Vật Tư Điện Lạnh Chính Hãng
            </h1>

            <p className="text-xs text-slate-200 max-w-xl mx-auto font-medium leading-normal">
              Bảng giá sỉ &amp; lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt Đà Nẵng.
            </p>

            {/* Search & Tool Bar inside Hero */}
            <div className="max-w-xl mx-auto pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm (vd: Ống đồng, Gas R32)..."
                  className="w-full text-xs sm:text-sm bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border border-white/20 rounded-xl pl-9 pr-8 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md backdrop-blur-md"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </span>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Xóa tìm kiếm"
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 !min-h-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <BTUCalculatorModal />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-bold text-slate-200">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Chính hãng CO/CQ</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-300" />
                <span>Giao ngay Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-300" />
                <span>Hotline/Zalo: {company.hotline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Fast Navigation Category Pills Bar */}
      <div className="sticky top-[52px] sm:top-[60px] lg:top-[64px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs py-2.5 px-4 sm:px-6 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleCategoryPillClick("all")}
            className={`!min-h-0 px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeCategoryFilter === "all"
                ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            ⚡ Tất cả danh mục ({products.length})
          </button>

          {categories.map((cat) => {
            const catCount = products.filter((p) => p.category.id === cat.id).length;
            const isActive = activeCategoryFilter === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryPillClick(cat.slug)}
                className={`!min-h-0 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 opacity-70">({catCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sequential Category Product Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12 sm:space-y-16 text-left">
        {categories.map((category) => {
          // Filter products belonging to this category & matching search term
          const catProducts = products.filter((p) => {
            const isCatMatch = p.category.id === category.id;
            const isSearchMatch =
              searchTerm.trim() === "" ||
              p.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
              (p.shortDesc && p.shortDesc.toLowerCase().includes(searchTerm.trim().toLowerCase()));
            return isCatMatch && isSearchMatch;
          });

          // Skip section if searching and no matches found in this category
          if (catProducts.length === 0 && searchTerm.trim() !== "") {
            return null;
          }

          // Rule: Max 9 items on PC, Max 6 items on Mobile unless expanded
          const maxInitialLimit = isMobile ? 6 : 9;
          const isExpanded = Boolean(expandedCategories[category.id]);
          const visibleProducts = isExpanded
            ? catProducts
            : catProducts.slice(0, maxInitialLimit);

          const hasMore = catProducts.length > maxInitialLimit;
          const remainingCount = catProducts.length - maxInitialLimit;

          return (
            <section
              key={category.id}
              id={`cat-${category.slug}`}
              className="scroll-mt-32 space-y-5"
            >
              {/* Category Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-800 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {category.name}
                      </h2>
                      <span className="bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        {catProducts.length} sản phẩm
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Vật tư chất lượng cao chính hãng phân phối tại Đà Nẵng
                    </p>
                  </div>
                </div>

                {hasMore && (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer w-full sm:w-auto justify-center !min-h-0"
                  >
                    <span>{isExpanded ? "Thu gọn danh mục" : `Xem thêm (${remainingCount} sản phẩm)`}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {catProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        company={company}
                        onViewDetail={setDetailProduct}
                      />
                    ))}
                  </div>

                  {/* Expand / Show More Button below grid */}
                  {hasMore && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => toggleExpand(category.id)}
                        className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer !min-h-0"
                      >
                        <span>
                          {isExpanded
                            ? `Thu gọn bớt sản phẩm ${category.name}`
                            : `Xem thêm ${remainingCount} sản phẩm thuộc ${category.name}`}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  Chưa có sản phẩm nào thuộc danh mục này.
                </div>
              )}
            </section>
          );
        })}
      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          company={company}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  );
};
