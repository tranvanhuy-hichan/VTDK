"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Camera,
  Loader2,
  Star,
  ImageIcon,
  CheckCircle2,
  Building2,
  Fan,
  Wind,
  ThermometerSun,
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
  icon: string;
  image: string;
  images: string[];
  features: string[];
  sortOrder: number;
}

interface ServiceFormProps {
  initialService?: Service;
}

interface ServiceImageItem {
  id: string;
  type: "existing" | "file";
  url: string;
  file?: File;
}

const SERVICE_ICONS = [
  { id: "ThermometerSun", label: "Làm lạnh & Khí nén", icon: ThermometerSun },
  { id: "Wind", label: "Thông gió - Điều hòa", icon: Wind },
  { id: "Fan", label: "Quạt thông nghiệp", icon: Fan },
  { id: "Building2", label: "Hệ thống tòa nhà", icon: Building2 },
];

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialService }) => {
  const router = useRouter();
  const isEditing = Boolean(initialService);

  const [title, setTitle] = useState(initialService?.title || "");
  const [description, setDescription] = useState(initialService?.description || "");
  const [icon, setIcon] = useState(initialService?.icon || "ThermometerSun");
  const [features, setFeatures] = useState<string[]>(
    initialService?.features && initialService.features.length > 0
      ? initialService.features
      : [""]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<"info" | "images">("info");

  // Images list
  const [imageList, setImageList] = useState<ServiceImageItem[]>(() => {
    if (!initialService) return [];
    const list: ServiceImageItem[] = [];
    if (initialService.image && initialService.image !== "/images/placeholder.svg") {
      list.push({
        id: `existing-main-${Date.now()}`,
        type: "existing",
        url: initialService.image,
      });
    }
    if (Array.isArray(initialService.images)) {
      initialService.images.forEach((url) => {
        if (url !== initialService.image) {
          list.push({
            id: `existing-gallery-${Math.random()}`,
            type: "existing",
            url,
          });
        }
      });
    }
    return list;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Features list handlers
  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, ""]);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: ServiceImageItem[] = fileArray.map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      type: "file",
      url: URL.createObjectURL(file),
      file,
    }));
    setImageList((prev) => [...prev, ...newItems]);
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const next = [...prev];
      const target = next.splice(index, 1)[0];
      return [target, ...next];
    });
  };

  const handleRemoveImageItem = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete Service Handler
  const handleDeleteService = async () => {
    if (!initialService) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa giải pháp "${initialService.title}" không? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    const res = await deleteServiceAction(initialService.id);
    setIsSubmitting(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/admin/services");
      router.refresh();
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Mô tả giải pháp!");
      return;
    }

    if (imageList.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 hình ảnh đại diện cho giải pháp!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("icon", icon);

    if (isEditing && initialService) {
      formData.append("id", initialService.id);
    }

    // Append features
    features.forEach((feat) => {
      if (feat.trim()) {
        formData.append("features", feat.trim());
      }
    });

    // Image processing
    const mainItem = imageList[0];
    const galleryItems = imageList.slice(1);

    if (mainItem) {
      if (mainItem.type === "file" && mainItem.file) {
        formData.append("image", mainItem.file);
      } else if (mainItem.type === "existing") {
        formData.append("mainImageUrl", mainItem.url);
      }
    }

    galleryItems.forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append("newImages", item.file);
      } else if (item.type === "existing") {
        formData.append("existingImages", item.url);
      }
    });

    try {
      const res = isEditing
        ? await updateServiceAction(formData)
        : await createServiceAction(formData);

      setIsSubmitting(false);

      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/admin/services");
        router.refresh();
      }
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || "Lỗi hệ thống khi lưu giải pháp!");
    }
  };

  return (
    <div className="w-full py-1.5 px-1 sm:px-2 space-y-2.5 sm:space-y-4 text-left">
      {/* Top Header Navigation (Compact & Responsive on Mobile) */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 transition-colors shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            href="/admin/services"
            className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors shrink-0 !min-h-0"
            title="Quay lại danh sách giải pháp"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              {isEditing ? initialService?.title : "Tạo giải pháp mới"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isEditing && (
            <button
              type="button"
              onClick={handleDeleteService}
              disabled={isSubmitting}
              className="p-2 sm:px-3 sm:py-2 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/80 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 disabled:opacity-50 !min-h-0 cursor-pointer"
              title="Xóa giải pháp"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa</span>
            </button>
          )}

          <Link
            href="/admin/services"
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold px-3 py-1.5 sm:py-2 rounded-xl text-xs transition-colors !min-h-0 text-center"
          >
            Hủy
          </Link>
          <button
            type="button"
            onClick={() => {
              const form = document.getElementById("service-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isSubmitting}
            className="bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 !min-h-0 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>{isEditing ? "CẬP NHẬT" : "LƯU MỚI"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Segmented Switcher */}
      <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("info")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "info"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>1. Thông tin</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("images")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "images"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>2. Hình ảnh</span>
          {imageList.length > 0 && (
            <span className="text-[9px] bg-blue-100 dark:bg-blue-900 text-[#075FA8] dark:text-blue-300 px-1 rounded-full font-bold">
              {imageList.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Form Body */}
      <form id="service-form" onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
          {/* LEFT COLUMN: BASIC INFO & FEATURES */}
          <div className={`lg:col-span-7 space-y-3 sm:space-y-4 ${mobileTab !== "info" ? "hidden lg:block" : "block"}`}>
            
            {/* SECTION 1: GENERAL INFO */}
            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 sm:space-y-3.5 transition-colors">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Thông tin giải pháp
                </h3>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tên giải pháp / dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Thi công hệ thống điều hòa không khí VRV / VRF"
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Chọn Biểu tượng đại diện
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SERVICE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIcon(item.id)}
                        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer !min-h-0 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/80 border-[#075FA8] dark:border-blue-500 text-[#075FA8] dark:text-blue-300 font-black ring-2 ring-blue-100 dark:ring-blue-900"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[10px] sm:text-[11px] leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Mô tả chi tiết giải pháp <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả phạm vi thi công, quy trình kỹ thuật, năng lực cung cấp..."
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl p-2.5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all leading-relaxed font-medium"
                />
              </div>
            </div>

            {/* SECTION 2: FEATURES LIST */}
            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 sm:space-y-3.5 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Các điểm nổi bật / ưu điểm nổi trội
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer !min-h-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm ưu điểm</span>
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleUpdateFeature(index, e.target.value)}
                      placeholder="VD: Đội ngũ kỹ sư trên 10 năm kinh nghiệm..."
                      className="flex-1 h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors !min-h-0 cursor-pointer"
                      title="Xóa ưu điểm này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: IMAGES & GALLERY */}
          <div className={`lg:col-span-5 space-y-3 sm:space-y-4 ${mobileTab !== "images" ? "hidden lg:block" : "block"}`}>
            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 sm:space-y-3.5 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Hình ảnh giải pháp
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-400">
                  {imageList.length} ảnh đã chọn
                </span>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
              />

              {/* Dropzone Container */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#075FA8] dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 p-6 rounded-2xl text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  Tải lên ảnh minh họa cho giải pháp
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  Nhấp để tải hoặc chụp trực tiếp từ thiết bị (JPG, PNG, WEBP)
                </p>

                <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors !min-h-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Chọn nhiều ảnh</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#075FA8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg transition-colors !min-h-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Chụp ảnh</span>
                  </button>
                </div>
              </div>

              {/* Image Preview Grid */}
              {imageList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
                    Danh sách ảnh (Ảnh đầu tiên làm ảnh chính):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imageList.map((item, idx) => {
                      const isMain = idx === 0;
                      return (
                        <div
                          key={item.id}
                          className={`relative aspect-video rounded-xl border overflow-hidden group/img transition-all ${
                            isMain
                              ? "border-2 border-[#075FA8] ring-2 ring-blue-100 dark:ring-blue-900 shadow-md"
                              : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={`Ảnh giải pháp ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Top Left Badge */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            {isMain ? (
                              <span className="bg-[#075FA8] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Ảnh chính</span>
                              </span>
                            ) : (
                              <span className="bg-slate-900/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-1.5 z-20">
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(idx)}
                                className="bg-[#075FA8] hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1 transition-colors !min-h-0 cursor-pointer"
                              >
                                <Star className="w-3 h-3 fill-white" />
                                <span>Đặt ảnh chính</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImageItem(idx)}
                              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1 transition-colors !min-h-0 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa ảnh</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
