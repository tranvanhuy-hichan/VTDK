"use client";

import React, { useState } from "react";
import { Layers, X, Plus, Loader2, Edit3, Trash2 } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../../app/admin/actions";
import { ConfirmModal } from "../common/ConfirmModal";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  productCounts?: Record<string, number>;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  productCounts = {},
}) => {
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Confirm delete category modal
  const [deletingCat, setDeletingCat] = useState<CategoryItem | null>(null);

  if (!isOpen) return null;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", newCatName.trim());
      const res = await createCategoryAction(fd);
      if (res?.error) {
        alert(res.error);
      } else {
        setNewCatName("");
      }
    } catch {
      alert("Đã xảy ra lỗi khi tạo danh mục");
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleUpdateCategory = async (catId: string) => {
    if (!editingCatName.trim()) return;
    setCatSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("id", catId);
      fd.append("name", editingCatName.trim());
      const res = await updateCategoryAction(fd);
      if (res?.error) {
        alert(res.error);
      } else {
        setEditingCatId(null);
        setEditingCatName("");
      }
    } catch {
      alert("Đã xảy ra lỗi khi cập nhật danh mục");
    } finally {
      setCatSubmitting(false);
    }
  };

  const executeDeleteCategory = async () => {
    if (!deletingCat) return;
    setCatSubmitting(true);
    try {
      const res = await deleteCategoryAction(deletingCat.id);
      if (res?.error) {
        alert(res.error);
      } else {
        setDeletingCat(null);
      }
    } catch {
      alert("Đã xảy ra lỗi khi xóa danh mục");
    } finally {
      setCatSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-left flex flex-col text-slate-800 dark:text-slate-100">
          
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#075FA8] dark:text-blue-400" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                QUẢN LÝ DANH MỤC SẢN PHẨM
              </h3>
            </div>
            <button
              onClick={() => {
                onClose();
                setEditingCatId(null);
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors !min-h-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Add New Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Thêm danh mục mới
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nhập tên danh mục mới..."
                  className="flex-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8]"
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

            {/* Categories List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Danh sách ({categories.length} danh mục)
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                {categories.map((cat) => {
                  const productCount = productCounts[cat.id] || 0;
                  const isEditingThis = editingCatId === cat.id;

                  return (
                    <div key={cat.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      {isEditingThis ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="flex-1 text-sm bg-white dark:bg-slate-900 border border-[#075FA8] rounded-lg px-3 py-1.5 font-bold text-slate-900 dark:text-white focus:outline-none"
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
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white block truncate">
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
                              className="p-1.5 text-slate-500 hover:text-[#075FA8] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors !min-h-0 cursor-pointer"
                              title="Đổi tên danh mục"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingCat(cat)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors !min-h-0 cursor-pointer"
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
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 shrink-0 text-right">
            <button
              type="button"
              onClick={() => {
                onClose();
                setEditingCatId(null);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors !min-h-0 cursor-pointer"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>

      {/* Delete Category Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCat)}
        onClose={() => setDeletingCat(null)}
        onConfirm={executeDeleteCategory}
        isLoading={catSubmitting}
        title="Xác nhận xóa danh mục"
        message={
          <span>
            Bạn có chắc muốn xóa danh mục <strong>&ldquo;{deletingCat?.name}&rdquo;</strong>?
            {(productCounts[deletingCat?.id || ""] || 0) > 0 && (
              <span className="block mt-1 text-red-500 font-bold">
                ⚠️ Danh mục này đang chứa {productCounts[deletingCat?.id || ""]} sản phẩm!
              </span>
            )}
          </span>
        }
        confirmText="Xóa danh mục"
      />
    </>
  );
};
