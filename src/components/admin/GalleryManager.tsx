"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  LogOut,
  Trash2,
  Upload,
  Loader2,
  ImageOff,
  ArrowLeft,
  Building2,
} from "lucide-react";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  logoutAction,
} from "../../app/admin/actions";

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

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">ĐÔNG KHA ADMIN</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Quản lý hình ảnh tại Đông Kha
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/company"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Thông tin công ty</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#075FA8] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại danh sách sản phẩm
            </Link>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">HÌNH ẢNH TẠI ĐÔNG KHA</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Quản lý hình ảnh hiển thị trong mục "Hình ảnh tại Đông Kha" trên trang chủ.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM HÌNH ẢNH</span>
          </button>
        </div>

        {/* Image Grid */}
        {initialImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialImages.map((img) => (
              <div
                key={img.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group text-left"
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
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ImageOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">Chưa có hình ảnh nào</h3>
            <p className="text-slate-500 text-sm mt-1">Bấm "Thêm hình ảnh" để tải ảnh lên.</p>
          </div>
        )}
      </main>

      {/* Upload Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
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
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hình ảnh *
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-xl p-4 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold">Chọn tệp hình ảnh</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP tối đa 5MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors !min-h-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-3 px-4 rounded-xl text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
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
    </div>
  );
};
