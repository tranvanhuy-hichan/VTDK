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
import { Pagination } from "../Pagination";

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

    const res = await createGalleryImageAction(formData);

    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      setIsModalOpen(false);
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      const res = await deleteGalleryImageAction(id);
      if (res?.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">HÌNH ẢNH TẠI ĐÔNG KHA</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Quản lý hình ảnh hiển thị trong mục "Hình ảnh tại Đông Kha" trên trang chủ.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-md shadow transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM HÌNH ẢNH</span>
        </button>
      </div>

      {/* Image Grid */}
      {initialImages.length > 0 ? (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden group text-left"
            >
              <div className="relative aspect-[4/3] bg-slate-50">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDelete(img.id)}
                  aria-label="Xóa ảnh"
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg shadow-sm transition-colors !min-h-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-slate-900 truncate">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
          <ImageOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Chưa có hình ảnh nào</h3>
          <p className="text-slate-500 text-sm mt-1">Bấm "Thêm hình ảnh" để tải ảnh lên.</p>
        </div>
      )}

      {/* Upload Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-slate-100 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">THÊM HÌNH ẢNH</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors !min-h-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tiêu đề ảnh *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Kho ống đồng"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hình ảnh *
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 hover:border-[#075FA8] rounded-md p-3 cursor-pointer text-slate-500 hover:text-[#075FA8] transition-colors">
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
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 hover:border-[#075FA8] rounded-md p-3 cursor-pointer text-slate-500 hover:text-[#075FA8] transition-colors">
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

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-md text-center text-sm transition-colors !min-h-0"
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
