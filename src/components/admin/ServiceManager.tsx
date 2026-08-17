"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Upload,
  Camera,
  Loader2,
  Wrench,
  Star,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "../../app/admin/actions";

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

interface ServiceImageItem {
  id: string;
  type: "existing" | "file";
  url: string;
  file?: File;
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
  
  const [imageList, setImageList] = useState<ServiceImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIcon(ICON_OPTIONS[0]);
    setFeatureRows([]);
    setImageList([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setIsEditing(true);
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setFeatureRows(service.features);

    const list: ServiceImageItem[] = [];
    if (service.image && service.image !== "/images/placeholder.png") {
      list.push({
        id: `existing-main-${Date.now()}`,
        type: "existing",
        url: service.image,
      });
    }
    if (Array.isArray(service.images)) {
      service.images.forEach((url, i) => {
        if (url !== service.image) {
          list.push({
            id: `existing-gallery-${i}-${Date.now()}`,
            type: "existing",
            url,
          });
        }
      });
    }
    setImageList(list);
    setIsModalOpen(true);
  };

  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Tệp ${file.name} vượt quá dung lượng 5MB!`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageList((prev) => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random()}`,
            type: "file",
            url: reader.result as string,
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const newList = [...prev];
      const selected = newList.splice(index, 1)[0];
      return [selected, ...newList];
    });
  };

  const handleRemoveImageItem = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
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
      alert("Vui lòng nhập đầy đủ Tiêu đề và Mô tả giải pháp!");
      return;
    }

    if (imageList.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 hình ảnh cho giải pháp!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("icon", icon);

    const mainItem = imageList[0];
    const galleryItems = imageList.slice(1);

    if (mainItem) {
      if (mainItem.type === "file" && mainItem.file) {
        formData.append("image", mainItem.file);
      } else if (mainItem.type === "existing") {
        formData.append("mainImageUrl", mainItem.url);
      }
    } else {
      formData.append("removeImage", "true");
    }

    galleryItems.forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append("newImages", item.file);
      } else if (item.type === "existing") {
        formData.append("existingImages", item.url);
      }
    });

    featureRows.forEach((f) => {
      if (f.trim()) formData.append("feature", f.trim());
    });

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
      alert("Lỗi kết nối, vui lòng thử lại!");
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">GIẢI PHÁP THI CÔNG &amp; KỸ THUẬT</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Quản lý các giải pháp hiển thị trong mục "Dịch vụ" trên trang chủ.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer w-full sm:w-auto transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM GIẢI PHÁP</span>
        </button>
      </div>

      {initialServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {initialServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-slate-50">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                {service.images && service.images.length > 0 && (
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    +{service.images.length} ảnh
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5 leading-snug">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4 font-medium">
                  {service.description}
                </p>
                {service.features.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {service.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="text-xs text-slate-700 font-bold flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    aria-label="Sửa"
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors !min-h-0 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    aria-label="Xóa"
                    className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Chưa có giải pháp nào</h3>
          <p className="text-slate-500 text-sm mt-1">
            Nhấp nút "Thêm giải pháp" ở trên để tạo giải pháp đầu tiên.
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl max-w-7xl w-full h-[90vh] max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">

            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/90 z-20 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#075FA8] text-white flex items-center justify-center font-bold shadow-xs">
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isEditing ? "CHỈNH SỬA GIẢI PHÁP" : "THÊM GIẢI PHÁP MỚI"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isEditing ? "Cập nhật tiêu đề, mô tả, điểm nổi bật & hình ảnh giải pháp" : "Nhập đầy đủ thông tin giải pháp bên dưới"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors !min-h-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
                
                <div className="lg:col-span-6 space-y-4 lg:overflow-y-auto lg:max-h-full lg:pr-2">
                  
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">1</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Thông tin chung</h4>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tiêu đề giải pháp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Tư Vấn & Thi Công Hệ Thống Điều Hòa Trung Tâm"
                        className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] font-medium transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Biểu tượng minh họa
                      </label>
                      <select
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all shadow-2xs"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">2</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Mô tả chi tiết</h4>
                    </div>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả chi tiết về giải pháp thi công, quy trình kỹ thuật..."
                      rows={4}
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all shadow-2xs font-medium"
                    />
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">3</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Điểm nổi bật (Features)</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFeatureRow}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-[#075FA8] hover:text-[#0B1F33] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer !min-h-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm điểm nổi bật</span>
                      </button>
                    </div>

                    {featureRows.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa có điểm nổi bật nào. Nhấp nút trên để thêm.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {featureRows.map((f, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-center">#{index + 1}</span>
                            <input
                              type="text"
                              value={f}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              placeholder="Ví dụ: Khảo sát thực tế & lập bản vẽ kỹ thuật chi tiết"
                              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFeatureRow(index)}
                              aria-label="Xóa dòng"
                              className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors !min-h-0 shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4 lg:overflow-y-auto lg:max-h-full lg:pl-1 lg:pr-2">
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">4</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Hình ảnh giải pháp</h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Ảnh đầu tiên tự động làm <strong>Ảnh chính</strong>
                      </span>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#075FA8] bg-white hover:bg-blue-50/30 rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 group shadow-2xs shrink-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-[#075FA8] flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-[#075FA8] transition-colors">
                        Kéo thả hình ảnh vào đây hoặc nhấp chọn từ thiết bị
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Hỗ trợ chọn nhiều hình ảnh (JPG, PNG, WEBP tối đa 5MB)
                      </p>

                      <div className="mt-3 flex items-center justify-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer !min-h-0"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chọn tệp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer !min-h-0"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chụp camera</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                        className="hidden"
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {imageList.length > 0 ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                          Danh sách ảnh ({imageList.length}):
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5">
                          {imageList.map((item, index) => {
                            const isMain = index === 0;
                            return (
                              <div
                                key={item.id}
                                className={`group relative rounded-xl overflow-hidden border-2 bg-slate-100 aspect-square shadow-2xs transition-all ${
                                  isMain ? "border-[#075FA8] ring-2 ring-blue-400/30" : "border-slate-200"
                                }`}
                              >
                                <img src={item.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                <div className="absolute top-1 left-1 pointer-events-none">
                                  {isMain ? (
                                    <span className="inline-flex items-center gap-1 bg-[#075FA8] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                      <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                      <span>Chính</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-slate-700 bg-white/90 backdrop-blur-xs text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200">
                                      #{index}
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageItem(index)}
                                  aria-label="Xóa ảnh"
                                  title="Xóa ảnh này"
                                  className="absolute top-1 right-1 p-1 bg-slate-950/70 hover:bg-red-600 text-white rounded-full transition-all cursor-pointer shadow-md z-10 !min-h-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>

                                {!isMain && (
                                  <div className="absolute inset-x-0 bottom-0 p-1 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainImage(index)}
                                      className="w-full bg-[#075FA8] hover:bg-blue-600 text-white font-bold text-[9px] py-1 px-1 rounded transition-colors flex items-center justify-center gap-1 !min-h-0 cursor-pointer"
                                    >
                                      <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                                      <span>Làm ảnh chính</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Chưa có ảnh nào được chọn. Vui lòng chọn tệp ảnh cho giải pháp.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-3 p-4 sm:px-6 border-t border-slate-100 bg-white shrink-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl text-center text-sm transition-colors !min-h-0 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-2.5 px-4 rounded-xl text-center text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu giải pháp...</span>
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
