"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Pencil,
  X,
  Building2,
  Phone,
  MapPinned,
  Upload,
  Camera,
  Images,
  Truck,
  Sparkles,
  CheckCircle2,
  Globe,
  ExternalLink,
  Search,
  MessageCircle,
  Eye,
  Check,
  Copy,
  Lock,
} from "lucide-react";
import { updateCompanyInfoAction } from "../../app/admin/actions";
import type { CompanyContact } from "../../lib/company";
import { MultiImageUpload } from "./MultiImageUpload";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface CompanyInfoManagerProps {
  initialCompany: CompanyContact;
}

type TabType = "brand" | "contact" | "location" | "media" | "preview";

export const CompanyInfoManager: React.FC<CompanyInfoManagerProps> = ({ initialCompany }) => {
  const router = useRouter();
  const [savedData, setSavedData] = useState<CompanyContact>(initialCompany);
  const [form, setForm] = useState<CompanyContact>(initialCompany);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Cover Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Brand Logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Gallery
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialCompany.images || []);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const handleChange = (key: keyof CompanyContact, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setForm(savedData);
    setImageFile(null);
    setImagePreview(null);
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveImage(false);
    setExistingGalleryUrls(savedData.images || []);
    setNewGalleryFiles([]);
    setIsEditing(false);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setSavedSuccess(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setSavedSuccess(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    setSavedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    const hotlineRaw = form.hotline ? form.hotline.replace(/\D/g, "") : "";

    const formData = new FormData();
    const keys: (keyof CompanyContact)[] = [
      "name",
      "fullName",
      "shortName",
      "brandName",
      "tagline",
      "city",
      "email",
      "taxCode",
      "address",
      "hotline",
      "hotlineRaw",
      "zaloUrl",
      "whatsAppUrl",
      "facebookUrl",
      "googleMapsUrl",
      "googleMapsEmbed",
      "workingHours",
    ];

    keys.forEach((k) => {
      if (form[k] !== undefined && form[k] !== null) {
        formData.append(k, String(form[k]));
      }
    });

    formData.set("hotlineRaw", hotlineRaw);
    formData.set("hasDelivery", String(form.hasDelivery));

    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (removeImage) {
      formData.append("removeImage", "true");
    }
    existingGalleryUrls.forEach((url) => formData.append("existingImages", url));
    newGalleryFiles.forEach((file) => formData.append("newImages", file));

    try {
      const res = await updateCompanyInfoAction(formData);

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setSavedSuccess(true);
        setSavedData(form);
        setIsEditing(false);
        setImageFile(null);
        setLogoFile(null);
        setNewGalleryFiles([]);
        router.refresh();
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Lỗi kết nối khi lưu thông tin doanh nghiệp!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLogo = logoPreview ?? form.logoUrl ?? savedData.logoUrl ?? "/images/logo.png";
  const currentCover = removeImage
    ? PLACEHOLDER_IMAGE
    : imagePreview ?? form.image ?? savedData.image ?? "/images/storefront.png";

  return (
    <div className="space-y-6 text-left max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: Brand Identity Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061A30] via-[#092B4D] to-[#0A1F33] text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo & Main Info */}
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-white/20 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogo}
                  alt="Logo công ty"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 rounded-2xl bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold gap-1">
                  <Camera className="w-4 h-4" />
                  <span>Đổi Logo</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đang hoạt động
                </span>
                <span className="text-[11px] text-blue-200/80 font-mono">
                  MST: {form.taxCode || "Chưa thiết lập"}
                </span>
                {isEditing && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                    ✏️ Đang chỉnh sửa
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate leading-tight">
                {form.fullName || form.name || "Cấu hình Thông tin Doanh nghiệp"}
              </h1>

              <div className="flex items-center gap-3 text-xs text-blue-100/80 flex-wrap">
                <span className="font-bold text-amber-300">
                  Thương hiệu: {form.shortName || form.brandName}
                </span>
                <span>•</span>
                <span className="truncate max-w-xs sm:max-w-md">
                  {form.address}
                </span>
              </div>
            </div>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
            {!isEditing ? (
              <>
                <Link
                  href="/"
                  target="_blank"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md transition-colors cursor-pointer !min-h-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem Website</span>
                </Link>

                <button
                  type="button"
                  key="btn-edit"
                  onClick={handleStartEdit}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#064B85] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-98 cursor-pointer !min-h-0"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key="btn-cancel"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer !min-h-0"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy bỏ</span>
                </button>

                <button
                  type="submit"
                  key="btn-submit"
                  form="company-form"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-98 cursor-pointer !min-h-0 disabled:opacity-50"
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
              </>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thông tin doanh nghiệp đã được cập nhật thành công trên toàn bộ hệ thống!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-xs sm:text-sm text-red-800 dark:text-red-300 font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <span>❌ {errorMessage}</span>
        </div>
      )}

      {/* 2. NAVIGATION SEGMENTED TABS */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: "brand", label: "Thương hiệu & Pháp lý", icon: Sparkles },
          { id: "contact", label: "Liên hệ & Mạng xã hội", icon: Phone },
          { id: "location", label: "Địa chỉ & Bản đồ", icon: MapPinned },
          { id: "media", label: "Hình ảnh & Kho bãi", icon: Images },
          { id: "preview", label: "Xem trước giao diện", icon: Eye },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as TabType)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer !min-h-0 ${
                isActive
                  ? "bg-[#075FA8] text-white shadow-md shadow-blue-800/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN FORM BODY */}
      <form id="company-form" onSubmit={handleSubmit}>
        {/* TAB 1: THƯƠNG HIỆU & PHÁP LÝ */}
        {activeTab === "brand" && (
          <div className="animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                      4 Cấp Độ Chuẩn Hóa Tên Doanh Nghiệp
                    </h2>
                    <p className="text-xs text-slate-400">
                      Được tự động ánh xạ đến đúng vị trí hiển thị trên toàn bộ website.
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Chỉ xem (Bấm &quot;Chỉnh sửa&quot; ở trên để sửa)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* fullName */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>1. Tên đầy đủ pháp lý (fullName) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Footer, Hóa đơn VAT, Giấy tờ, SEO</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Công ty TNHH Vật Tư Đông Kha"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">Tên pháp nhân công ty trên giấy phép ĐKKD.</p>
                </div>

                {/* shortName */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>2. Tên thương hiệu ngắn (shortName) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Header, Mobile, Logo text</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.shortName}
                    onChange={(e) => handleChange("shortName", e.target.value)}
                    placeholder="VẬT TƯ ĐÔNG KHA"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">Hiển thị nổi bật cạnh logo trên thanh Menu.</p>
                </div>

                {/* brandName */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>3. Tên gọi nhanh (brandName) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Zalo chat, Xưng hô ngắn</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.brandName}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    placeholder="Đông Kha"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">Ví dụ: &quot;Chào Đông Kha, tôi muốn hỏi giá...&quot;</p>
                </div>

                {/* tagline */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>4. Khẩu hiệu / Slogan phụ (tagline)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Dưới Logo & Header</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                    placeholder="VẬT TƯ ĐIỆN LẠNH ĐÀ NẴNG"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">Chữ in hoa nhỏ nằm ngay dưới logo.</p>
                </div>

                {/* city */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Khu vực / Thành phố chính (city)</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Đà Nẵng & Miền Trung"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400">Khu vực phục vụ khách hàng chính.</p>
                </div>

                {/* taxCode */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Mã số thuế (taxCode)</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.taxCode || ""}
                    onChange={(e) => handleChange("taxCode", e.target.value)}
                    placeholder="0402123456"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 font-mono transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* email */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Email liên hệ chính thức (email)</span>
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="lienhe@vattudongkha.io.vn"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIÊN HỆ & MẠNG XÃ HỘI */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#F47A20]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Kênh Hotline & Mạng Xã Hội
                  </h2>
                  <p className="text-xs text-slate-400">
                    Kết nối tức thì với khách hàng và thợ điện lạnh.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* hotline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Số điện thoại Hotline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.hotline}
                    onChange={(e) => handleChange("hotline", e.target.value)}
                    placeholder="0905 487 441"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 font-mono font-bold transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#F47A20] cursor-default"
                    }`}
                  />
                </div>

                {/* zaloUrl */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Link Zalo cá nhân hoặc Zalo OA
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.zaloUrl}
                    onChange={(e) => handleChange("zaloUrl", e.target.value)}
                    placeholder="https://zalo.me/0905487441"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 cursor-default"
                    }`}
                  />
                </div>

                {/* whatsAppUrl */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Link WhatsApp
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.whatsAppUrl}
                    onChange={(e) => handleChange("whatsAppUrl", e.target.value)}
                    placeholder="https://wa.me/84905487441"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 cursor-default"
                    }`}
                  />
                </div>

                {/* facebookUrl */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Link Facebook Fanpage
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.facebookUrl}
                    onChange={(e) => handleChange("facebookUrl", e.target.value)}
                    placeholder="https://www.facebook.com/..."
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#1877F2] cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Toggle Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                  Chính Sách Vận Chuyển
                </h3>
              </div>

              <label className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                isEditing ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 cursor-default"
              }`}>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                    Bật Giao Hàng Tận Nơi
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Khách hàng có thể chọn nhận hàng tại nhà hoặc lấy tại kho khi đặt hàng.
                  </span>
                </div>
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  checked={form.hasDelivery}
                  onChange={(e) => handleChange("hasDelivery", e.target.checked)}
                  className="w-5 h-5 mt-1 accent-[#075FA8] cursor-pointer disabled:cursor-default"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: ĐỊA CHỈ & BẢN ĐỒ */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <MapPinned className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Địa Chỉ Kho Hàng & Giờ Phục Vụ
                  </h2>
                  <p className="text-xs text-slate-400">
                    Giúp khách hàng dễ dàng tìm đường và ghé lấy hàng.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Địa chỉ kho / Cửa hàng trưng bày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* workingHours */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Khung giờ mở cửa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.workingHours}
                    onChange={(e) => handleChange("workingHours", e.target.value)}
                    placeholder="07:00 – 18:30 (Tất cả các ngày trong tuần)"
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* googleMapsUrl */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Link mở ứng dụng Google Maps
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.googleMapsUrl}
                    onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                    placeholder="https://www.google.com/maps/..."
                    className={`w-full text-sm rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* googleMapsEmbed */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Mã nhúng iframe Google Maps (Embed)
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={form.googleMapsEmbed}
                    onChange={(e) => handleChange("googleMapsEmbed", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className={`w-full text-xs font-mono rounded-xl px-4 py-2.5 transition-colors ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Live Map Preview Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Xem Trước Bản Đồ Nhúng
              </h3>
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative shadow-inner">
                {form.googleMapsEmbed ? (
                  <iframe
                    title="Map Preview"
                    src={form.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400 italic">
                    Chưa có link nhúng Google Maps
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HÌNH ẢNH & KHO BÃI */}
        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            {/* Storefront Cover */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8]">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Ảnh Mặt Tiền & Kho Tổng
                  </h3>
                  <p className="text-xs text-slate-400">Hiển thị nổi bật ở đầu trang chủ.</p>
                </div>
              </div>

              <div className="aspect-[16/10] w-full rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
                <img
                  src={currentCover}
                  alt="Ảnh đại diện kho"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-[#075FA8] rounded-xl px-3 py-2 text-xs font-bold transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Chụp ảnh mới</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-[#075FA8] rounded-xl px-3 py-2 text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy</span>
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
                      className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl py-2 text-xs font-bold transition-colors !min-h-0 cursor-pointer"
                    >
                      Xóa ảnh bìa
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Thư Viện Ảnh Hoạt Động ({existingGalleryUrls.length + newGalleryFiles.length})
                  </h3>
                  <p className="text-xs text-slate-400">Hình ảnh sản phẩm, bốc dỡ hàng, thử bo mạch.</p>
                </div>
              </div>

              {isEditing ? (
                <MultiImageUpload
                  existingUrls={existingGalleryUrls}
                  onExistingUrlsChange={setExistingGalleryUrls}
                  newFiles={newGalleryFiles}
                  onNewFilesChange={setNewGalleryFiles}
                  label="Thêm ảnh vào thư viện"
                />
              ) : existingGalleryUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {existingGalleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-8 text-center">Chưa có ảnh nào trong thư viện.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: XEM TRƯỚC TRỰC QUAN (LIVE MOCKUP PREVIEWS) */}
        {activeTab === "preview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Header Bar Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#075FA8]" />
                <span>1. Xem Trước Thanh Header Trên Website</span>
              </h3>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-950 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <img src={currentLogo} alt="Logo" className="h-9 w-auto object-contain rounded-lg" />
                  <div>
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white block leading-tight">
                      {form.shortName || form.fullName}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
                      {form.tagline || "KHẨU HIỆU DOANH NGHIỆP"}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="text-[#075FA8] dark:text-blue-400">Trang chủ</span>
                  <span>Sản phẩm</span>
                  <span>Đơn hàng</span>
                  <span>Liên hệ</span>
                </div>
              </div>
            </div>

            {/* 2. Google Search SERP Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1877F2]" />
                <span>2. Xem Trước Kết Quả Tìm Kiếm Google (SEO Preview)</span>
              </h3>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-950 space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-0.5">
                    <img src={currentLogo} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <span>https://vattudongkha.io.vn</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                  {form.shortName || form.fullName} {form.city || "Đà Nẵng"} | Sỉ &amp; Lẻ Chính Hãng Giá Tốt
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Đại lý vật tư điện lạnh {form.city || "Đà Nẵng"} - {form.brandName}: sỉ &amp; lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt chính hãng. Hàng sẵn kho {form.address}.
                </p>
              </div>
            </div>

            {/* 3. Zalo Message Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#0068FF]" />
                <span>3. Xem Trước Tin Nhắn Mẫu Gửi Qua Zalo</span>
              </h3>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-[#E5EBF5] dark:bg-slate-950 space-y-2 shadow-inner max-w-lg">
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs space-y-1.5 text-slate-800 dark:text-slate-100">
                  <p className="font-bold text-[#0068FF]">
                    Chào {form.brandName}, tôi muốn hỏi mua sản phẩm:
                  </p>
                  <p>Ống đồng cuộn Hailiang 6.35mm x 15m x1 — 450.000đ</p>
                  <p className="text-[11px] text-slate-400">https://vattudongkha.io.vn/san-pham/ong-dong-hailiang-6</p>
                  <p className="italic text-slate-500 text-[11px] pt-1">
                    Nhờ shop tư vấn và kiểm tra tình trạng hàng giúp tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
