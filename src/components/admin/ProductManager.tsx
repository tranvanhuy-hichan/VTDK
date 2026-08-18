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
} from "lucide-react";
import {
  deleteProductAction,
  toggleProductActiveAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../../app/admin/actions";
import { Pagination } from "../Pagination";

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
  sortOrder: number;
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

  // Filter products by search and category
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.shortDesc && product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      {/* Unified Filter, Search & Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs mb-3 sm:mb-4 flex flex-col md:flex-row items-center justify-between gap-3 text-left transition-colors">
        
        {/* Left Side: Filter & Search Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Category Filter Dropdown */}
          <div className="w-full sm:w-56 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all cursor-pointer"
            >
              <option value="all">Tất cả danh mục ({initialProducts.length})</option>
              {initialCategories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
            />
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer flex-1 sm:flex-none"
          >
            <Layers className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
            <span>Quản lý danh mục</span>
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex-1 sm:flex-none transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>

      </div>

      {/* Product Table Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden text-left transition-colors">
          {/* Mobile Card List */}
          <div className="sm:hidden grid grid-cols-2 gap-3 p-3">
            {pagedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleActive(product);
                    }}
                    aria-label={product.active ? "Đang hiển thị" : "Đã ẩn"}
                    className={`!min-h-0 absolute top-1.5 right-1.5 p-1.5 rounded-md shadow-xs border ${
                      product.active
                        ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    {product.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-2.5 flex-1 flex flex-col">
                  <span className="inline-block w-fit text-[9px] font-bold bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 text-[#075FA8] dark:text-blue-300 px-1.5 py-0.5 rounded mb-1">
                    {product.category.name}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h4>
                  <div className="mt-auto pt-1.5">
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      {product.price > 0 ? `${product.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                    </div>
                    {product.variants.length > 0 && (
                      <div className="text-[9px] font-bold text-slate-400 dark:text-slate-400">{product.variants.length} phân loại</div>
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
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6 text-left w-16">Hình ảnh</th>
                  <th className="py-4 px-6 text-left">Tên sản phẩm</th>
                  <th className="py-4 px-6 text-left">Danh mục</th>
                  <th className="py-4 px-6 text-left">Giá bán</th>
                  <th className="py-4 px-6 text-center w-28">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
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
                    <td className="py-4 px-6 text-left">
                      <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {product.images && product.images.length > 0 && (
                          <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded-tl">
                            +{product.images.length}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-6 text-left">
                      <div className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">{product.name}</div>
                      {product.shortDesc && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mt-1">
                          {product.shortDesc}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-left">
                      <span className="inline-flex text-xs font-bold bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 text-[#075FA8] dark:text-blue-300 px-2.5 py-1 rounded-lg">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-left font-black text-slate-900 dark:text-white">
                      {product.price > 0
                        ? `${product.price.toLocaleString("vi-VN")}đ`
                        : "Liên hệ báo giá"}
                      {product.variants.length > 0 && (
                        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{product.variants.length} phân loại</span>
                        </div>
                      )}
                    </td>

                    {/* Active Status Switch (Icon Only) */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(product);
                        }}
                        aria-label={product.active ? "Đang hiển thị (Nhấp để ẩn)" : "Đã ẩn (Nhấp để hiển thị)"}
                        title={product.active ? "Đang hiển thị (Nhấp để ẩn)" : "Đã ẩn (Nhấp để hiển thị)"}
                        className={`!min-h-0 p-2 rounded-xl border transition-all cursor-pointer inline-flex items-center justify-center ${
                          product.active
                            ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {product.active ? (
                          <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
          <div className="px-4 sm:px-6 pb-6 pt-2">
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
    </>
  );
};
