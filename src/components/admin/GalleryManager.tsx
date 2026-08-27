"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Camera,
  Loader2,
  ImageOff,
} from "lucide-react";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
} from "../../app/admin/actions";
import { Pagination } from "../product/Pagination";
import { EmptyState } from "../common/EmptyState";
import { ConfirmModal } from "../common/ConfirmModal";

const PAGE_SIZE = 12;

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  sortOrder: number;
}

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ initialImages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(initialImages.length / PAGE_SIZE));
  const pagedImages = initialImages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleOpenAdd = () => {
    setTitle("");
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !imageFile) {
      alert("Vui lòng nhập tiêu đề và chọn hình ảnh!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);

    try {
      const res = await createGalleryImageAction(formData);

      if (res?.error) {
        alert(res.error);
      } else {
        setIsModalOpen(false);
        window.location.reload();
        return;
      }
    } catch (err) {
      alert("Lỗi kết nối, vui lòng thử lại! (ảnh có thể quá lớn hoặc mạng yếu)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deletingImageId) return;
    setIsDeleting(true);
    try {
      const res = await deleteGalleryImageAction(deletingImageId);
      if (res?.error) {
        alert(res.error);
      } else {
        setDeletingImageId(null);
        window.location.reload();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Top Action Bar */}
      <div className="flex justify-end mb-3 sm:mb-4 text-left">
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer w-full sm:w-auto transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm hình ảnh mới</span>
        </button>
      </div>

      {/* Image Grid */}
      {initialImages.length > 0 ? (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedImages.map((img) => (
            <div
              key={img.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group text-left transition-colors"
            >
              <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setDeletingImageId(img.id)}
                  aria-label="Xóa ảnh"
                  className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 dark:hover:bg-red-950/80 text-slate-500 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors !min-h-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <EmptyState
          icon={ImageOff}
          title="Chưa có hình ảnh nào"
          description="Bấm 'Thêm hình ảnh mới' để tải ảnh công trình hoặc kho hàng lên."
          actionLabel="+ Thêm hình ảnh mới"
          onActionClick={handleOpenAdd}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingImageId)}
        onClose={() => setDeletingImageId(null)}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa hình ảnh"
        message="Bạn có chắc chắn muốn xóa hình ảnh này khỏi thư viện? Hành động này không thể hoàn tác."
        confirmText="Xóa ảnh"
      />

      {/* Upload Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">THÊM HÌNH ẢNH</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors !min-h-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tiêu đề ảnh *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Kho ống đồng"
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Hình ảnh *
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#075FA8] dark:hover:border-blue-400 rounded-md p-3 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors">
                      <Camera className="w-5 h-5" />
                      <span className="text-xs font-bold">Chụp ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#075FA8] dark:hover:border-blue-400 rounded-md p-3 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors">
                      <Upload className="w-5 h-5" />
                      <span className="text-xs font-bold">Tải ảnh lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-md text-center text-sm transition-colors !min-h-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-3 px-4 rounded-md text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>LƯU HÌNH ẢNH</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
