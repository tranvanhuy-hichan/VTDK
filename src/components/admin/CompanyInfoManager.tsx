"use client";

import React, { useState } from "react";
import { Loader2, Save, X, Pencil, Building2, Phone, MapPinned, Upload, Camera, Images, Trash2, Truck } from "lucide-react";
import { updateCompanyInfoAction } from "../../app/admin/actions";
import type { CompanyContact } from "../../lib/company";
import { MultiImageUpload } from "./MultiImageUpload";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface CompanyInfoManagerProps {
  initialCompany: CompanyContact;
}

type TextFieldKey = Exclude<keyof CompanyContact, "hasDelivery" | "images">;

interface FieldDef {
  key: TextFieldKey;
  label: string;
  placeholder: string;
  multiline?: boolean;
  wide?: boolean;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FieldDef[];
}

const SECTIONS: Section[] = [
  {
    id: "general",
    title: "Thông tin chung",
    icon: Building2,
    fields: [
      { key: "name", label: "Tên công ty", placeholder: "Công ty TNHH Vật Tư Đông Kha", wide: true },
      { key: "address", label: "Địa chỉ", placeholder: "400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng", wide: true },
      { key: "workingHours", label: "Giờ mở cửa - đóng cửa", placeholder: "07:00 – 18:30 (Tất cả các ngày trong tuần)", wide: true },
    ],
  },
  {
    id: "contact",
    title: "Liên hệ & Mạng xã hội",
    icon: Phone,
    fields: [
      { key: "hotline", label: "Số điện thoại hotline", placeholder: "0905 487 441" },
      { key: "zaloUrl", label: "Link Zalo", placeholder: "https://zalo.me/0905487441" },
      { key: "whatsAppUrl", label: "Link WhatsApp", placeholder: "https://wa.me/84905487441" },
      { key: "facebookUrl", label: "Link Facebook", placeholder: "https://www.facebook.com/..." },
    ],
  },
  {
    id: "maps",
    title: "Google Maps",
    icon: MapPinned,
    fields: [
      { key: "googleMapsUrl", label: "Link chỉ đường", placeholder: "https://www.google.com/maps/...", wide: true },
      { key: "googleMapsEmbed", label: "Link nhúng bản đồ (embed)", placeholder: "https://www.google.com/maps/embed?...", multiline: true, wide: true },
    ],
  },
];

const ALL_FIELD_KEYS = SECTIONS.flatMap((s) => s.fields.map((f) => f.key));

export const CompanyInfoManager: React.FC<CompanyInfoManagerProps> = ({ initialCompany }) => {
  const [saved, setSaved] = useState<CompanyContact>(initialCompany);
  const [form, setForm] = useState<CompanyContact>(initialCompany);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialCompany.images);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const handleChange = (key: keyof CompanyContact, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleStartEdit = () => {
    setForm(saved);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setExistingGalleryUrls(saved.images);
    setNewGalleryFiles([]);
    setSavedMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(saved);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setExistingGalleryUrls(saved.images);
    setNewGalleryFiles([]);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedMessage(null);

    const hotlineRaw = form.hotline.replace(/\D/g, "");

    const formData = new FormData();
    ALL_FIELD_KEYS.forEach((key) => formData.append(key, form[key] as string));
    formData.set("hotlineRaw", hotlineRaw);
    formData.set("hasDelivery", String(form.hasDelivery));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (removeImage) {
      formData.append("removeImage", "true");
    }
    existingGalleryUrls.forEach((url) => formData.append("existingImages", url));
    newGalleryFiles.forEach((file) => formData.append("newImages", file));

    try {
      const res = await updateCompanyInfoAction(formData);

      if (res?.error) {
        alert(res.error);
      } else {
        setIsEditing(false);
        setSavedMessage("Đã lưu thông tin công ty thành công!");
        window.location.reload();
        return;
      }
    } catch (err) {
      alert("Lỗi kết nối, vui lòng thử lại! (ảnh có thể quá lớn hoặc mạng yếu)");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isEditing && (
        <div className="flex justify-end mb-3 sm:mb-4 text-left">
          <button
            onClick={handleStartEdit}
            className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors w-full sm:w-auto !min-h-0 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Chỉnh sửa thông tin</span>
          </button>
        </div>
      )}

      {savedMessage && !isEditing && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold mb-3 sm:mb-4 text-left">
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Images Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-left transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-800/60">
                <Images className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Hình ảnh công ty
              </h3>
            </div>

            <div className="space-y-5">
              {/* Cover image */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Ảnh đại diện (hiển thị đầu trang chủ)
                </label>
                <div className="aspect-[4/3] w-full rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <img
                    src={isEditing ? (removeImage ? PLACEHOLDER_IMAGE : imagePreview ?? saved.image) : saved.image}
                    alt="Ảnh đại diện công ty"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-[#075FA8] dark:hover:border-blue-400 rounded-md px-2 py-2 text-xs font-bold transition-colors">
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
                      <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-[#075FA8] dark:hover:border-blue-400 rounded-md px-2 py-2 text-xs font-bold transition-colors">
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
                    {!removeImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 inline-flex items-center justify-center gap-1.5 w-full text-red-600 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-800/80 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-md px-2 py-2 text-xs font-bold transition-colors !min-h-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa ảnh</span>
                      </button>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1.5 text-center">JPG, PNG, WEBP tối đa 5MB</p>
                  </>
                )}
              </div>

              {/* Gallery */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Thư viện ảnh
                </label>
                {isEditing ? (
                  <MultiImageUpload
                    existingUrls={existingGalleryUrls}
                    onExistingUrlsChange={setExistingGalleryUrls}
                    newFiles={newGalleryFiles}
                    onNewFilesChange={setNewGalleryFiles}
                    label=""
                  />
                ) : saved.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {saved.images.map((url, i) => (
                      <div key={i} className="aspect-square rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-400 italic">Chưa có ảnh nào trong thư viện.</p>
                )}
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="lg:col-span-7 space-y-5">
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-left transition-colors"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-800/60">
                    <section.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  {section.fields.map(({ key, label, placeholder, multiline, wide }) => (
                    <div key={key} className={wide ? "sm:col-span-2" : ""}>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {label}
                      </label>
                      {isEditing ? (
                        multiline ? (
                          <textarea
                            value={form[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={placeholder}
                            rows={3}
                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                          />
                        ) : (
                          <input
                            type="text"
                            value={form[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={placeholder}
                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                          />
                        )
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-words">
                          {saved[key] || <span className="text-slate-400 dark:text-slate-400 font-normal italic">Chưa có</span>}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Delivery Toggle */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-left transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-800/60">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Vận chuyển
                </h3>
              </div>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">Có giao hàng</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Bật nếu công ty có giao hàng tận nơi — các nút liên hệ trên site sẽ đổi thành &quot;Mua ngay&quot;
                    và thu thập thông tin người nhận (họ tên, SĐT, địa chỉ) trước khi gửi Zalo.
                  </span>
                </span>
                <span className="shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={isEditing ? form.hasDelivery : saved.hasDelivery}
                    disabled={!isEditing}
                    onChange={(e) => setForm((prev) => ({ ...prev, hasDelivery: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <span
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      (isEditing ? form.hasDelivery : saved.hasDelivery)
                        ? "bg-[#075FA8]"
                        : "bg-slate-300 dark:bg-slate-700"
                    } ${isEditing ? "cursor-pointer" : "opacity-70 cursor-not-allowed"}`}
                  >
                    <span
                      className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
                        (isEditing ? form.hasDelivery : saved.hasDelivery) ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-3.5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-5 rounded-md text-center text-sm transition-colors !min-h-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Hủy bỏ</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-2.5 px-6 rounded-md text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU THAY ĐỔI</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </>
  );
};
