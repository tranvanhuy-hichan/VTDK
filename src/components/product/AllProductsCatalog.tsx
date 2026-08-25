"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Phone,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Store,
  Grid,
  ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { CompanyContact } from "../../lib/company";

const BTUCalculatorModal = dynamic(
  () => import("./BTUCalculatorModal").then((m) => m.BTUCalculatorModal),
  { ssr: false }
);

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

import { ProductCard } from "./ProductCard";

export const AllProductsCatalog: React.FC<AllProductsCatalogProps> = ({
  categories,
  products,
  company,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

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
      
      {/* 1. Basic, Sleek, Compact Hero Header */}
      <section className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] text-white py-4 sm:py-6 px-4 sm:px-6 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2.5 text-center">
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            Danh Mục Vật Tư Điện Lạnh Chính Hãng
          </h1>
          <p className="text-xs text-blue-100/90 max-w-xl mx-auto font-medium">
            Bảng giá sỉ &amp; lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt.
          </p>

          {/* Search Bar & BTU Tool */}
          <div className="max-w-lg mx-auto pt-1 flex items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên vật tư, linh kiện, gas lạnh..."
                className="w-full text-xs sm:text-sm bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border border-white/20 rounded-xl pl-8 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Xóa tìm kiếm"
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 !min-h-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="shrink-0">
              <BTUCalculatorModal buttonClassName="inline-flex items-center justify-center gap-1 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3 py-2 rounded-xl border border-white/20 shadow-2xs transition-all cursor-pointer !min-h-0" />
            </div>
          </div>
        </div>
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

          // Rule: Max 12 items on PC, Max 8 items on Mobile unless expanded
          const maxInitialLimit = isMobile ? 8 : 12;
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        company={company}
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
    </div>
  );
};
