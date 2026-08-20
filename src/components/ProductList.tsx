"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PackageOpen, X, Search, ChevronDown, Grid, ArrowRight } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { Pagination } from "./Pagination";
import { BTUCalculatorModal } from "./BTUCalculatorModal";

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

import { ProductCard } from "./ProductCard";

export const ProductList: React.FC<ProductListProps> = ({
  initialCategories,
  initialProducts,
  company,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Dynamic page size based on screen width (8 for 2-col mobile, 12 for 4-col desktop)
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 1024 ? 8 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, pageSize]);

  return (
    <section id="san-pham" className="py-6 sm:py-10 bg-[#F6F8FA] dark:bg-[#0F172A] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-[#075FA8] dark:text-blue-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-2.5">
            DANH SÁCH SẢN PHẨM VẬT TƯ
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Sản phẩm phân phối chính hãng
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-300 font-normal mb-2.5">
            Bảng giá tham khảo vật tư điện lạnh chất lượng cao của Đông Kha.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-1.5">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-blue-300 transition-colors group"
            >
              <Grid className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
              <span className="group-hover:underline sm:hidden">Xem tất cả ➔</span>
              <span className="group-hover:underline hidden sm:inline">Xem Trang Catalog Tất Cả Sản Phẩm ➔</span>
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <BTUCalculatorModal buttonClassName="inline-flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full border border-amber-200/80 dark:border-slate-700 shadow-2xs transition-all cursor-pointer !min-h-0" />
          </div>
        </div>

        {/* Unified Search & Category Control Toolbar */}
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6">

          {/* Top Row: Search Input (+ Category Select side-by-side on mobile) */}
          <div className="flex gap-2 mb-2.5 sm:block sm:mb-3">
            <div className="relative flex-1 sm:w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm theo tên..."
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#075FA8] shadow-2xs transition-all"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
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

            {/* Mobile (< sm): Category Select Dropdown, next to search */}
            <div className="relative w-28 shrink-0 sm:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-2.5 pr-6 py-2.5 font-bold text-xs text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-none focus:border-[#075FA8] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#075FA8] truncate cursor-pointer"
              >
                <option value="all">Danh mục</option>
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Category Filter Row */}
          <div>
            {/* Desktop View (>= sm): Full Category Pills */}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {pagedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  company={company}
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

        {/* Bottom Callout to Full Catalog Page */}
        <div className="mt-8 text-center">
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-blue-300 transition-colors group"
          >
            <Grid className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
            <span className="group-hover:underline">Mở Catalog Tất Cả Sản Phẩm Theo Danh Mục</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
};
