"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Upload,
  Camera,
  Loader2,
  Wrench,
} from "lucide-react";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "../../app/admin/actions";
import { MultiImageUpload } from "./MultiImageUpload";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  images: string[];
  sortOrder: number;
}

interface ServiceManagerProps {
  initialServices: Service[];
}

const ICON_OPTIONS = ["Building2", "Fan", "Wind", "ThermometerSun"];

export const ServiceManager: React.FC<ServiceManagerProps> = ({ initialServices }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [featureRows, setFeatureRows] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIcon(ICON_OPTIONS[0]);
    setFeatureRows([]);
    setImageFile(null);
    setImagePreview(null);
    setExistingGalleryUrls([]);
    setNewGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setIsEditing(true);
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setFeatureRows(service.features);
    setImageFile(null);
    setImagePreview(service.image);
    setExistingGalleryUrls(service.images);
    setNewGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddFeatureRow = () => setFeatureRows((rows) => [...rows, ""]);
  const handleFeatureChange = (index: number, value: string) => {
    setFeatureRows((rows) => rows.map((r, i) => (i === index ? value : r)));
  };
  const handleRemoveFeatureRow = (index: number) => {
    setFeatureRows((rows) => rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Mô tả!");
      return;
    }
    if (!isEditing && !imageFile) {
      alert("Vui lòng chọn hình ảnh!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("icon", icon);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    featureRows.forEach((f) => {
      if (f.trim()) formData.append("feature", f.trim());
    });
    existingGalleryUrls.forEach((url) => formData.append("existingImages", url));
    newGalleryFiles.forEach((file) => formData.append("newImages", file));

    try {
      const res = isEditing && editingService
        ? await updateServiceAction(editingService.id, formData)
        : await createServiceAction(formData);

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải pháp này?")) {
      const res = await deleteServiceAction(id);
      if (res?.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">GIẢI PHÁP THI CÔNG & KỸ THUẬT</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Quản lý các giải pháp hiển thị trong mục "Dịch vụ" trên trang chủ.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-md shadow transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM GIẢI PHÁP</span>
        </button>
      </div>

        {/* Service List */}
        {initialServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {initialServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col text-left"
              >
                <div className="relative aspect-[16/9] bg-slate-50">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{service.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">
                    {service.description}
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 mb-4">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#075FA8] mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      aria-label="Sửa"
                      className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors !min-h-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      aria-label="Xóa"
                      className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">Chưa có giải pháp nào</h3>
            <p className="text-slate-500 text-sm mt-1">Bấm "Thêm giải pháp" để tạo mới.</p>
          </div>
        )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? "CHỈNH SỬA GIẢI PHÁP" : "THÊM GIẢI PHÁP MỚI"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors !min-h-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Image */}
                <div className="lg:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Hình ảnh {!isEditing && "*"}
                  </label>
                  <div className="aspect-square w-full rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-[#075FA8] border border-slate-200 hover:border-[#075FA8] rounded-md px-2 py-2 text-xs font-bold transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Chụp ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-[#075FA8] border border-slate-200 hover:border-[#075FA8] rounded-md px-2 py-2 text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center">JPG, PNG, WEBP tối đa 5MB</p>
                </div>

                {/* Right Column: Fields */}
                <div className="lg:col-span-8 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ví dụ: Tư Vấn & Thi Công Điều Hòa & Thông Gió"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Biểu tượng
                      </label>
                      <select
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                    />
                  </div>
                </div>

                {/* Full Width: Features */}
                <div className="lg:col-span-12">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Điểm nổi bật
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFeatureRow}
                      className="text-xs font-bold text-[#075FA8] hover:text-[#0B1F33] flex items-center gap-1 !min-h-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm dòng
                    </button>
                  </div>
                  {featureRows.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Chưa có điểm nổi bật nào.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {featureRows.map((f, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={f}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Ví dụ: Khảo sát thực tế & lập bản vẽ kỹ thuật chi tiết"
                            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureRow(index)}
                            aria-label="Xóa dòng"
                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-md transition-colors !min-h-0 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Full Width: Gallery Images */}
                <div className="lg:col-span-12">
                  <MultiImageUpload
                    existingUrls={existingGalleryUrls}
                    onExistingUrlsChange={setExistingGalleryUrls}
                    newFiles={newGalleryFiles}
                    onNewFilesChange={setNewGalleryFiles}
                    label="Thư viện ảnh giải pháp (khách hàng lướt xem)"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-md text-center text-sm transition-colors !min-h-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-2.5 px-4 rounded-md text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>LƯU GIẢI PHÁP</span>
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
