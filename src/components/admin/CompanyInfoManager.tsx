"use client";

import React, { useState } from "react";
import { Loader2, Save, X, Pencil, Building2, Phone, MapPinned, Upload, Images } from "lucide-react";
import { updateCompanyInfoAction } from "../../app/admin/actions";
import type { CompanyContact } from "../../lib/company";
import { MultiImageUpload } from "./MultiImageUpload";

interface CompanyInfoManagerProps {
  initialCompany: CompanyContact;
}

interface FieldDef {
  key: keyof CompanyContact;
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
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialCompany.images);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const handleChange = (key: keyof CompanyContact, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  const handleStartEdit = () => {
    setForm(saved);
    setImageFile(null);
    setImagePreview(null);
    setExistingGalleryUrls(saved.images);
    setNewGalleryFiles([]);
    setSavedMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(saved);
    setImageFile(null);
    setImagePreview(null);
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
    if (imageFile) {
      formData.append("image", imageFile);
    }
    existingGalleryUrls.forEach((url) => formData.append("existingImages", url));
    newGalleryFiles.forEach((file) => formData.append("newImages", file));

    const res = await updateCompanyInfoAction(formData);

    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setIsEditing(false);
      setSavedMessage("Đã lưu thông tin công ty thành công!");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">THÔNG TIN CÔNG TY</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Địa chỉ, số điện thoại, giờ mở cửa và ảnh hiển thị trên toàn bộ trang web.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-md shadow transition-colors w-full sm:w-auto !min-h-0"
          >
            <Pencil className="w-4 h-4" />
            <span>CHỈNH SỬA</span>
          </button>
        )}
      </div>

      {savedMessage && !isEditing && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 text-xs sm:text-sm text-emerald-700 font-bold mb-6 text-left max-w-3xl">
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        {/* Images Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 text-left">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-blue-50 text-[#075FA8] rounded-md border border-blue-100">
              <Images className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Hình ảnh công ty
            </h3>
          </div>

          <div className="space-y-5">
            {/* Cover image */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Ảnh đại diện (hiển thị đầu trang chủ)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-24 shrink-0 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={isEditing ? (imagePreview ?? saved.image) : saved.image}
                    alt="Ảnh đại diện công ty"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <div>
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-[#075FA8] border border-slate-200 hover:border-[#075FA8] rounded-md px-3 py-2 text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn ảnh khác</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1.5">JPG, PNG, WEBP tối đa 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className="pt-5 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {saved.images.map((url, i) => (
                    <div key={i} className="aspect-square rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có ảnh nào trong thư viện.</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Sections */}
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 text-left"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 text-[#075FA8] rounded-md border border-blue-100">
                <section.icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              {section.fields.map(({ key, label, placeholder, multiline, wide }) => (
                <div key={key} className={wide ? "sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  {isEditing ? (
                    multiline ? (
                      <textarea
                        value={form[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                      />
                    )
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 break-words">
                      {saved[key] || <span className="text-slate-400 font-normal italic">Chưa có</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg shadow-lg p-3.5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-md text-center text-sm transition-colors !min-h-0 flex items-center justify-center gap-2 disabled:opacity-50"
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
