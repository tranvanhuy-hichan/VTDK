"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  EyeOff,
  Layers,
  Printer,
  PackageOpen,
} from "lucide-react";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "../../app/admin/actions";
import { Pagination } from "../product/Pagination";
import { Button, Input, Select } from "@/components/ui";
import { BarcodePrintModal } from "./BarcodePrintModal";
import { CategoryManagerModal } from "./CategoryManagerModal";
import { StockBadge } from "../common/StockBadge";
import { EmptyState } from "../common/EmptyState";
import { ConfirmModal } from "../common/ConfirmModal";

const PAGE_SIZE = 10;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  label: string;
  price: number;
  sku?: string | null;
  barcode?: string | null;
  stock?: number | null;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  barcode?: string | null;
  stock?: number;
  price: number;
  shortDesc: string | null;
  image: string;
  images: string[];
  active: boolean;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
}

interface ProductManagerProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  initialCategories,
  initialProducts,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  // Delete product confirm modal state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProductClick = (id: string) => {
    setNavigatingId(id);
    router.push(`/admin/products/${id}`);
  };

  // Delete product handler
  const executeDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(deletingProduct.id);
      if (res.error) {
        alert(res.error);
      } else {
        setDeletingProduct(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (product: Product) => {
    const res = await toggleProductActiveAction(product.id, !product.active);
    if (res.error) {
      alert(res.error);
    }
  };

  // Filter products by search, category and stock status
  const filteredProducts = initialProducts.filter((product) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      (product.sku && product.sku.toLowerCase().includes(q)) ||
      (product.barcode && product.barcode.includes(q)) ||
      (product.shortDesc && product.shortDesc.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory;

    const currentStock = product.stock ?? 100;
    let matchesStock = true;
    if (stockFilter === "low_stock") {
      matchesStock = currentStock > 0 && currentStock <= 5;
    } else if (stockFilter === "out_of_stock") {
      matchesStock = currentStock <= 0;
    } else if (stockFilter === "in_stock") {
      matchesStock = currentStock > 5;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, stockFilter]);

  // Product counts per category
  const productCounts = initialCategories.reduce((acc, cat) => {
    acc[cat.id] = initialProducts.filter((p) => p.categoryId === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* Unified Filter, Search & Action Bar - Standard Compact */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs mb-2.5 flex flex-col md:flex-row items-center justify-between gap-2 text-left transition-colors">
        {/* Left Side: Filter & Search Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto flex-1">
          <div className="w-full sm:w-44 shrink-0">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục ({initialProducts.length})</option>
              {initialCategories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full sm:w-40 shrink-0">
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">Tất cả tồn kho</option>
              <option value="low_stock">⚠️ Sắp hết hàng (≤ 5)</option>
              <option value="out_of_stock">❌ Hết hàng (= 0)</option>
              <option value="in_stock">✅ Còn hàng (&gt; 5)</option>
            </Select>
          </div>

          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Tìm theo tên, mã SKU, barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          {/* Barcode Print Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsBarcodeModalOpen(true)}
            className="flex items-center gap-1.5 font-extrabold bg-blue-50/70 hover:bg-blue-100 text-[#075FA8] border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300"
            title="In hàng loạt tem mã vạch dán sản phẩm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In mã vạch ({filteredProducts.length})</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 font-extrabold"
          >
            <Layers className="w-3.5 h-3.5 text-[#075FA8]" />
            <span>Danh mục ({initialCategories.length})</span>
          </Button>

          <Link href="/admin/products/new">
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm sản phẩm</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Card List View (< md) */}
      <div className="block md:hidden space-y-2 mb-4">
        {filteredProducts.length > 0 ? (
          pagedProducts.map((product) => {
            const isNavigating = navigatingId === product.id;
            const stk = product.stock ?? 100;
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-2xs transition-all cursor-pointer relative overflow-hidden ${
                  isNavigating
                    ? "opacity-60 bg-blue-50/70 dark:bg-slate-800/70 animate-pulse pointer-events-none"
                    : "active:bg-slate-50 dark:active:bg-slate-800/60"
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 relative shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.images && product.images.length > 0 && (
                      <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded-tl">
                        +{product.images.length}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(product);
                        }}
                        className={`!min-h-0 w-6 h-6 rounded-md border shrink-0 flex items-center justify-center ${
                          product.active
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                        }`}
                      >
                        {product.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="text-[9px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 px-1.5 py-0.2 rounded border border-blue-100 dark:border-blue-900/40">
                        {product.category.name}
                      </span>
                      <StockBadge stock={stk} lowStockThreshold={5} />
                    </div>

                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {product.price > 0 ? `${product.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                      </span>
                      {product.variants.length > 0 && (
                        <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{product.variants.length} quy cách</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={PackageOpen}
            title="Không tìm thấy sản phẩm nào"
            description="Thử thay đổi bộ lọc danh mục, trạng thái tồn kho hoặc từ khóa tìm kiếm."
          />
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      {filteredProducts.length > 0 ? (
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4 w-14">Ảnh</th>
                  <th className="py-2.5 px-4">Tên sản phẩm &amp; Mã tra cứu</th>
                  <th className="py-2.5 px-4 w-36">Danh mục</th>
                  <th className="py-2.5 px-4 w-28 text-center">Tồn kho</th>
                  <th className="py-2.5 px-4 text-right whitespace-nowrap">Giá bán lẻ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedProducts.map((product) => {
                  const isNavigating = navigatingId === product.id;
                  const stock = product.stock ?? 100;

                  return (
                    <tr
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group select-none ${
                        isNavigating
                          ? "opacity-60 bg-blue-50/70 dark:bg-slate-800/70 animate-pulse pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="py-2.5 px-4 text-left">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          {product.images && product.images.length > 0 && (
                            <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded-tl">
                              +{product.images.length}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Name & SKU / Barcode */}
                      <td className="py-2.5 px-4 text-left">
                        <div className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          {product.variants.length > 0 && (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              <span>{product.variants.length} quy cách</span>
                            </span>
                          )}
                          {product.sku && (
                            <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                              SKU: {product.sku}
                            </span>
                          )}
                          {product.barcode && (
                            <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50/80 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                              Mã: {product.barcode}
                            </span>
                          )}
                        </div>
                        {product.shortDesc && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                            {product.shortDesc}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-4 text-left">
                        <span className="inline-flex text-[11px] font-bold bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 text-[#075FA8] dark:text-blue-300 px-2 py-0.5 rounded-md">
                          {product.category.name}
                        </span>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-2.5 px-4 text-center">
                        <StockBadge stock={stock} lowStockThreshold={5} />
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap font-black text-slate-900 dark:text-white">
                        <div>
                          {(() => {
                            if (product.variants && product.variants.length > 0) {
                              const prices = product.variants
                                .map((v) => v.price)
                                .filter((p) => typeof p === "number" && p > 0);
                              if (prices.length > 0) {
                                const min = Math.min(...prices);
                                const max = Math.max(...prices);
                                return min === max
                                  ? `${min.toLocaleString("vi-VN")}đ`
                                  : `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString("vi-VN")}đ`;
                              }
                            }
                            return product.price > 0
                              ? `${product.price.toLocaleString("vi-VN")}đ`
                              : "Liên hệ";
                          })()}
                        </div>
                        {product.variants.length > 0 && (
                          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center justify-end gap-1">
                            <Layers className="w-2.5 h-2.5" />
                            <span>{product.variants.length} phân loại</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-3 sm:px-4 py-2 border-t border-slate-100 dark:border-slate-800">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      ) : (
        <div className="hidden md:block">
          <EmptyState
            icon={PackageOpen}
            title="Không tìm thấy sản phẩm nào"
            description="Thử thay đổi bộ lọc danh mục, trạng thái tồn kho hoặc từ khóa tìm kiếm."
          />
        </div>
      )}

      {/* Extracted Category Management Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={initialCategories}
        productCounts={productCounts}
      />

      {/* Extracted Delete Product Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={executeDeleteProduct}
        isLoading={isDeleting}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct?.name}" không? Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.`}
        confirmText="Xóa sản phẩm"
      />

      {/* Barcode Decal Label Print Modal */}
      <BarcodePrintModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        products={filteredProducts.flatMap((p): Array<{
          id: string;
          name: string;
          sku?: string | null;
          barcode?: string | null;
          price: number;
          stock?: number | null;
          variantLabel?: string | null;
        }> => {
          if (p.variants && p.variants.length > 0) {
            return p.variants.map((v) => ({
              id: `${p.id}-var-${v.id}`,
              name: p.name,
              sku: v.sku || p.sku,
              barcode: v.barcode || p.barcode,
              price: v.price || p.price,
              stock: v.stock ?? p.stock ?? 1,
              variantLabel: v.label,
            }));
          }
          return [
            {
              id: p.id,
              name: p.name,
              sku: p.sku,
              barcode: p.barcode,
              price: p.price,
              stock: p.stock ?? 1,
              variantLabel: null,
            },
          ];
        })}
      />
    </>
  );
};
