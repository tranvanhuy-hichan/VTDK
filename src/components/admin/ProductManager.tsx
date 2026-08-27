"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  X,
  Loader2,
  PackageOpen,
  Layers,
  Printer,
  Tag,
  AlertTriangle,
} from "lucide-react";
import {
  deleteProductAction,
  toggleProductActiveAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../../app/admin/actions";
import { Pagination } from "../product/Pagination";
import { Button, Input, Select } from "@/components/ui";
import { BarcodePrintModal } from "./BarcodePrintModal";

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
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const handleProductClick = (id: string) => {
    setNavigatingId(id);
    router.push(`/admin/products/${id}`);
  };

  // Category management states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Handlers for Categories
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSubmitting(true);
    const fd = new FormData();
    fd.append("name", newCatName.trim());
    const res = await createCategoryAction(fd);
    setCatSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setNewCatName("");
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCatName.trim()) return;
    setCatSubmitting(true);
    const fd = new FormData();
    fd.append("id", id);
    fd.append("name", editingCatName.trim());
    const res = await updateCategoryAction(fd);
    setCatSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setEditingCatId(null);
      setEditingCatName("");
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const count = initialProducts.filter((p) => p.categoryId === cat.id).length;
    if (count > 0) {
      alert(`Không thể xóa danh mục "${cat.name}" vì đang có ${count} sản phẩm thuộc danh mục này! Vui lòng chuyển hoặc xóa sản phẩm trước.`);
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}" không?`)) return;
    setCatSubmitting(true);
    const res = await deleteCategoryAction(cat.id);
    setCatSubmitting(false);
    if (res.error) {
      alert(res.error);
    }
  };

  // Delete product handler
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    const res = await deleteProductAction(id);
    if (res.error) {
      alert(res.error);
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
              <option value="in_stock">✅ Còn hàng dồi dào</option>
            </Select>
          </div>

          <div className="w-full sm:w-64 flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SKU, mã vạch..."
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0 justify-end flex-wrap">
          <Button
            variant="secondary"
            onClick={() => setIsBarcodeModalOpen(true)}
            leftIcon={<Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          >
            In tem mã vạch
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
            leftIcon={<Layers className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />}
          >
            Danh mục
          </Button>

          <Button
            variant="primary"
            href="/admin/products/new"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Product Table Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden text-left transition-colors">
          {/* Mobile Card List */}
          <div className="sm:hidden grid grid-cols-2 gap-2 p-2">
            {pagedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group !min-h-0"
              >
                <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleActive(product);
                    }}
                    aria-label={product.active ? "Đang hiển thị" : "Đã ẩn"}
                    className={`!min-h-0 absolute top-1.5 right-1.5 p-1 rounded-md shadow-xs border ${
                      product.active
                        ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    {product.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
                <div className="p-2 flex-1 flex flex-col">
                  <span className="inline-block w-fit text-[9px] font-bold bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 text-[#075FA8] dark:text-blue-300 px-1.5 py-0.2 rounded mb-1">
                    {product.category.name}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    {product.variants.length > 0 && (
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300">
                        {product.variants.length} quy cách
                      </span>
                    )}
                    {(() => {
                      const stk = product.stock ?? 100;
                      if (stk <= 0) {
                        return (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                            ❌ Hết hàng (0)
                          </span>
                        );
                      }
                      if (stk <= 5) {
                        return (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            ⚠️ Sắp hết ({stk})
                          </span>
                        );
                      }
                      return (
                        <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                          Kho: {stk}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="mt-auto pt-1">
                    <div className="text-xs font-black text-slate-900 dark:text-white">
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
                        return product.price > 0 ? `${product.price.toLocaleString("vi-VN")}đ` : "Liên hệ";
                      })()}
                    </div>
                    {product.variants.length > 0 && (
                      <div className="text-[9px] font-bold text-[#075FA8] dark:text-blue-400">{product.variants.length} quy cách</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="py-2.5 px-4 text-left w-14">Hình ảnh</th>
                  <th className="py-2.5 px-4 text-left">Tên sản phẩm &amp; Mã SKU</th>
                  <th className="py-2.5 px-4 text-left">Danh mục</th>
                  <th className="py-2.5 px-4 text-left">Giá bán</th>
                  <th className="py-2.5 px-4 text-center w-24">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {pagedProducts.map((product) => {
                  const isNavigating = navigatingId === product.id;
                  return (
                    <tr
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className={`transition-all cursor-pointer group ${
                        isNavigating
                          ? "bg-blue-50/70 dark:bg-slate-800/80 opacity-60 animate-pulse pointer-events-none"
                          : "hover:bg-blue-50/40 dark:hover:bg-slate-800/50"
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

                    {/* Product Name & SKU / Barcode / Stock */}
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
                        {(() => {
                          const stk = product.stock ?? 100;
                          if (stk <= 0) {
                            return (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                                ❌ Hết hàng (0)
                              </span>
                            );
                          }
                          if (stk <= 5) {
                            return (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-0.5">
                                <span>⚠️ Sắp hết ({stk})</span>
                              </span>
                            );
                          }
                          return (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40">
                              {product.variants.length > 0 ? `Tổng kho: ${stk}` : `Kho: ${stk}`}
                            </span>
                          );
                        })()}
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

                    {/* Price */}
                    <td className="py-2.5 px-4 text-left font-black text-slate-900 dark:text-white">
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
                      {product.variants.length > 0 && (
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{product.variants.length} phân loại</span>
                        </div>
                      )}
                    </td>

                    {/* Active Status Switch (Icon Only) */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(product);
                        }}
                        aria-label={product.active ? "Đang hiển thị (Nhấp để ẩn)" : "Đã ẩn (Nhấp để hiển thị)"}
                        title={product.active ? "Đang hiển thị (Nhấp để ẩn)" : "Đã ẩn (Nhấp để hiển thị)"}
                        className={`!min-h-0 w-7 h-7 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${
                          product.active
                            ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {product.active ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
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
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h3>
          <p className="text-slate-500 text-sm mt-1">
            Thử thay đổi bộ lọc danh mục hoặc từ khóa tìm kiếm.
          </p>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 text-left flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#075FA8]" />
                <h3 className="text-lg font-black text-slate-900">QUẢN LÝ DANH MỤC SẢN PHẨM</h3>
              </div>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCatId(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors !min-h-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* Add New Category Form */}
              <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Thêm danh mục mới
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nhập tên danh mục mới..."
                    className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#075FA8]"
                  />
                  <button
                    type="submit"
                    disabled={catSubmitting || !newCatName.trim()}
                    className="bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors disabled:opacity-50 !min-h-0 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                  >
                    {catSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Thêm</span>
                  </button>
                </div>
              </form>

              {/* Categories Table / List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Danh sách ({initialCategories.length} danh mục)
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                  {initialCategories.map((cat) => {
                    const productCount = initialProducts.filter((p) => p.categoryId === cat.id).length;
                    const isEditingThis = editingCatId === cat.id;

                    return (
                      <div key={cat.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                        {isEditingThis ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="flex-1 text-sm bg-white border border-[#075FA8] rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateCategory(cat.id)}
                              disabled={catSubmitting}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors !min-h-0 cursor-pointer"
                            >
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(null);
                                setEditingCatName("");
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-lg transition-colors !min-h-0 cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-extrabold text-slate-900 block truncate">
                                {cat.name}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400 block truncate">
                                Slug: /{cat.slug} • ({productCount} sản phẩm)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCatId(cat.id);
                                  setEditingCatName(cat.name);
                                }}
                                className="p-1.5 text-slate-500 hover:text-[#075FA8] hover:bg-blue-50 rounded-lg transition-colors !min-h-0 cursor-pointer"
                                title="Đổi tên danh mục"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors !min-h-0 cursor-pointer"
                                title="Xóa danh mục"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCatId(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors !min-h-0 cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

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
