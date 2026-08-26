"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ExternalLink,
  Search,
  Check,
  Copy,
  Lock,
} from "lucide-react";
import {
  updateCompanyInfoAction,
  updateCompanyShippingAction,
} from "../../app/admin/actions";
import type { CompanyContact } from "../../lib/company";
import {
  VIETNAM_PROVINCES,
  isSameProvince,
  findProvinceByCity,
  REGION_PROVINCE_CODES,
} from "../../lib/vietnamProvinces";
import { MultiImageUpload } from "./MultiImageUpload";
import { Button, Tabs, Badge, Card, CardHeader, CardTitle } from "@/components/ui";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface CompanyInfoManagerProps {
  initialCompany: CompanyContact;
}

type TabType = "brand" | "contact" | "location" | "shipping" | "media";

export const CompanyInfoManager: React.FC<CompanyInfoManagerProps> = ({ initialCompany }) => {
  const [savedData, setSavedData] = useState<CompanyContact>(initialCompany);
  const [form, setForm] = useState<CompanyContact>(initialCompany);
  const [activeTab, setActiveTab] = useState<TabType>("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Freeship Provinces Selector State
  const [provinceSearch, setProvinceSearch] = useState("");

  const freeshipList = Array.isArray(form.freeshipProvinces)
    ? form.freeshipProvinces
    : ["ALL"];
  const isAllFreeship = freeshipList.includes("ALL");

  const isProvinceSelected = (code: string) => {
    if (isAllFreeship) return true;
    return freeshipList.includes(String(code).trim());
  };

  const handleToggleProvince = (code: string) => {
    if (!isEditing) return;
    const strCode = String(code).trim();
    if (isAllFreeship) {
      // Deselect this province, keeping all other 33 provinces
      const rest = VIETNAM_PROVINCES.map((p) => String(p.code)).filter((c) => c !== strCode);
      handleChange("freeshipProvinces", rest);
    } else {
      if (freeshipList.includes(strCode)) {
        const next = freeshipList.filter((c) => c !== strCode);
        handleChange("freeshipProvinces", next);
      } else {
        const next = [...freeshipList, strCode];
        if (next.length >= VIETNAM_PROVINCES.length) {
          handleChange("freeshipProvinces", ["ALL"]);
        } else {
          handleChange("freeshipProvinces", next);
        }
      }
    }
  };

  const companyMatchedProvince = findProvinceByCity(form.city);
  const companyProvinceCode = companyMatchedProvince ? String(companyMatchedProvince.code) : "48";
  const companyProvinceName = companyMatchedProvince ? companyMatchedProvince.name : (form.city || "Trụ sở");

  const handleSetPreset = (
    preset: "ALL" | "LOCAL" | "BIG_CITIES" | "NORTH" | "CENTRAL" | "SOUTH" | "NONE"
  ) => {
    if (!isEditing) return;
    switch (preset) {
      case "ALL":
        handleChange("freeshipProvinces", ["ALL"]);
        break;
      case "LOCAL":
        handleChange("freeshipProvinces", [companyProvinceCode]);
        break;
      case "BIG_CITIES":
        handleChange("freeshipProvinces", REGION_PROVINCE_CODES.BIG_CITIES);
        break;
      case "NORTH":
        handleChange("freeshipProvinces", REGION_PROVINCE_CODES.NORTH);
        break;
      case "CENTRAL":
        handleChange("freeshipProvinces", REGION_PROVINCE_CODES.CENTRAL);
        break;
      case "SOUTH":
        handleChange("freeshipProvinces", REGION_PROVINCE_CODES.SOUTH);
        break;
      case "NONE":
        handleChange("freeshipProvinces", []);
        break;
    }
  };

  const filteredProvinces = VIETNAM_PROVINCES.filter((p) => {
    if (!provinceSearch.trim()) return true;
    const q = provinceSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      String(p.code).includes(q) ||
      (p.englishName && p.englishName.toLowerCase().includes(q))
    );
  });

  const handleChange = (field: keyof CompanyContact, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartEdit = () => {
    setForm(savedData);
    setIsEditing(true);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  const handleCancelEdit = () => {
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
      "shippingFeeDanang",
      "shippingFeeProvince",
      "freeshipThreshold",
      "shippingNote",
    ];

    keys.forEach((k) => {
      if (form[k] !== undefined && form[k] !== null) {
        formData.append(k, String(form[k]));
      }
    });

    formData.set("hotlineRaw", hotlineRaw);
    formData.set("hasDelivery", String(form.hasDelivery));
    formData.set("enablePosModule", String(form.enablePosModule ?? true));
    formData.append(
      "freeshipProvinces",
      JSON.stringify(
        Array.isArray(form.freeshipProvinces)
          ? form.freeshipProvinces
          : ["ALL"]
      )
    );

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
      const res = activeTab === "shipping"
        ? await updateCompanyShippingAction({
            hasDelivery: form.hasDelivery,
            shippingFeeDanang: form.shippingFeeDanang,
            shippingFeeProvince: form.shippingFeeProvince,
            freeshipThreshold: form.freeshipThreshold,
            freeshipProvinces: Array.isArray(form.freeshipProvinces)
              ? form.freeshipProvinces
              : ["ALL"],
            shippingNote: form.shippingNote,
            enablePosModule: form.enablePosModule,
          })
        : await updateCompanyInfoAction(formData);

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        const persistedCompany = res.company ?? form;
        setSavedSuccess(true);
        setSavedData(persistedCompany);
        setForm(persistedCompany);
        setExistingGalleryUrls(persistedCompany.images || []);
        setIsEditing(false);
        setImageFile(null);
        setLogoFile(null);
        setNewGalleryFiles([]);
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
    <div className="space-y-3 sm:space-y-4 text-left max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: Brand Identity Showcase (Compact & Clean) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061A30] via-[#092B4D] to-[#0A1F33] text-white p-3.5 sm:p-5 border border-slate-800 shadow-lg">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Main Info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative group shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-slate-900 border border-white/20 p-1.5 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogo}
                  alt="Logo công ty"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 rounded-xl bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[9px] font-bold gap-0.5">
                  <Camera className="w-3 h-3" />
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

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <span className="text-[10px] text-blue-200/80 font-mono">
                  MST: {form.taxCode || "Chưa thiết lập"}
                </span>
                {isEditing && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                    ✏️ Sửa
                  </span>
                )}
              </div>

              <h1 className="text-sm sm:text-lg font-black text-white tracking-tight truncate leading-tight">
                {form.fullName || form.name || "Cấu hình Doanh nghiệp"}
              </h1>

              <div className="flex items-center gap-2 text-[11px] text-blue-100/80 flex-wrap">
                <span className="font-bold text-amber-300 truncate">
                  {form.shortName || form.brandName}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline truncate max-w-xs">
                  {form.address}
                </span>
              </div>
            </div>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Button
              variant="outline"
              href="/"
              target="_blank"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
            >
              Xem Web
            </Button>

            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  form="company-form"
                  variant="success"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  LƯU THAY ĐỔI
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartEdit}
                leftIcon={<Pencil className="w-3.5 h-3.5" />}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Thông tin doanh nghiệp đã được cập nhật thành công!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl p-2.5 text-xs text-red-800 dark:text-red-300 font-bold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <span>❌ {errorMessage}</span>
        </div>
      )}

      {/* 2. NAVIGATION SEGMENTED TABS */}
      <Tabs
        variant="segmented"
        size="md"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabType)}
        tabs={[
          { key: "brand", label: "Thương hiệu & Pháp lý", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { key: "contact", label: "Liên hệ & MXH", icon: <Phone className="w-3.5 h-3.5" /> },
          { key: "location", label: "Địa chỉ & Bản đồ", icon: <MapPinned className="w-3.5 h-3.5" /> },
          { key: "shipping", label: "Vận chuyển & Phí", icon: <Truck className="w-3.5 h-3.5" /> },
          { key: "media", label: "Hình ảnh & Kho", icon: <Images className="w-3.5 h-3.5" /> },
        ]}
      />

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

        {/* TAB 4: VẬN CHUYỂN & GIAO HÀNG (2 Cột) */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
            {/* CỘT 1: CẤU HÌNH CƯỚC VẬN CHUYỂN & GIAO HÀNG */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Cước Phí Vận Chuyển
                  </h2>
                  <p className="text-xs text-slate-400">
                    Thiết lập mức cước tự động áp dụng khi khách hàng đặt hàng trực tuyến.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* hasDelivery switch */}
                <label
                  className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-default"
                  }`}
                >
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                      Bật Dịch Vụ Giao Hàng Tận Nơi
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Cho phép khách hàng lựa chọn &quot;Giao hàng tận nơi&quot; khi thanh toán giỏ hàng.
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

                {/* shippingFeeDanang (Nội tỉnh) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Phí giao hàng nội tỉnh / Cùng địa bàn doanh nghiệp (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      required
                      disabled={!isEditing}
                      value={form.shippingFeeDanang ?? 30000}
                      onChange={(e) =>
                        handleChange("shippingFeeDanang", parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="30000"
                      className={`w-full text-sm font-bold rounded-xl px-4 py-2.5 transition-colors ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Áp dụng cho khách hàng cùng tỉnh/thành phố với doanh nghiệp (Hiện tại: <span className="font-semibold text-slate-600 dark:text-slate-300">{form.city || "Chưa đặt tỉnh thành"}</span>).
                  </p>
                </div>

                {/* shippingFeeProvince (Liên tỉnh) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Phí giao các tỉnh thành khác / Liên tỉnh / Xe chành (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      required
                      disabled={!isEditing}
                      value={form.shippingFeeProvince ?? 50000}
                      onChange={(e) =>
                        handleChange("shippingFeeProvince", parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="50000"
                      className={`w-full text-sm font-bold rounded-xl px-4 py-2.5 transition-colors ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Phí đóng gói và cước vận chuyển / gửi chành xe đến các tỉnh thành khác.
                  </p>
                </div>

                {/* shippingNote */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Lời dặn &amp; Chính sách giao hàng (Hiển thị tại trang thanh toán)
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={form.shippingNote || ""}
                    onChange={(e) => handleChange("shippingNote", e.target.value)}
                    placeholder="Miễn phí giao hàng cho đơn đạt định mức tại các tỉnh thành áp dụng. Đơn dưới định mức áp dụng cước chuẩn nội tỉnh và liên tỉnh."
                    className={`w-full text-xs rounded-xl px-4 py-2.5 transition-colors leading-relaxed ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-default"
                    }`}
                  />
                </div>

                {/* enablePosModule (Bán hàng tại quầy POS) */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Phân hệ Bán Hàng Tại Quầy (POS &amp; Quét Mã Vạch Barcode)
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {form.enablePosModule ?? true ? "🟢 Đang Bật Module POS Bán Tại Quầy" : "⚪ Đã Tắt Module POS"}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Cho phép thu ngân quét mã vạch và tạo đơn hàng bán trực tiếp tại showroom.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={form.enablePosModule ?? true}
                      onChange={(e) => handleChange("enablePosModule", e.target.checked)}
                      className="w-5 h-5 text-[#075FA8] border-slate-300 rounded focus:ring-[#075FA8]"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* CỘT 2: CHÍNH SÁCH FREESHIP & DANH SÁCH TỈNH THÀNH ÁP DỤNG */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                      Chính Sách Freeship
                    </h2>
                    <p className="text-xs text-slate-400">
                      Định mức và phạm vi tỉnh thành được hưởng miễn phí giao hàng.
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {isAllFreeship ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Toàn quốc ({VIETNAM_PROVINCES.length} tỉnh)
                    </span>
                  ) : freeshipList.length > 0 ? (
                    <span className="text-[#075FA8] dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã chọn {freeshipList.length}/{VIETNAM_PROVINCES.length} tỉnh
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      Chưa chọn (Tắt Freeship)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* freeshipThreshold */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Định mức Đơn Hàng Để Được Miễn Phí Vận Chuyển - Freeship (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      disabled={!isEditing}
                      value={form.freeshipThreshold ?? 2000000}
                      onChange={(e) =>
                        handleChange("freeshipThreshold", parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="2000000"
                      className={`w-full text-sm font-bold rounded-xl px-4 py-2.5 transition-colors ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border-2 border-[#075FA8] text-slate-900 dark:text-white shadow-sm focus:outline-none"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Đơn hàng có tổng tiền hàng đạt hoặc vượt mức này và thuộc các tỉnh thành được chọn bên dưới sẽ được Freeship 100%.
                  </p>
                </div>

                {/* freeshipProvinces Multi-Selector */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                      Tỉnh / Thành Phố Được Áp Dụng Freeship ({VIETNAM_PROVINCES.length} tỉnh thành)
                    </label>
                  </div>

                  {/* Preset Buttons */}
                  {isEditing && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Chọn nhanh:</span>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("ALL")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          isAllFreeship
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Toàn quốc ({VIETNAM_PROVINCES.length} tỉnh)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("LOCAL")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === 1 && freeshipList.includes(companyProvinceCode)
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Nội tỉnh ({companyProvinceName.replace(/^(Thành phố|Tỉnh|TP\.?)\s+/i, "")})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("BIG_CITIES")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.BIG_CITIES.length && REGION_PROVINCE_CODES.BIG_CITIES.every((c) => freeshipList.includes(c))
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        6 Đô thị lớn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("NORTH")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.NORTH.length && REGION_PROVINCE_CODES.NORTH.every((c) => freeshipList.includes(c))
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Miền Bắc ({REGION_PROVINCE_CODES.NORTH.length} tỉnh)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("CENTRAL")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.CENTRAL.length && REGION_PROVINCE_CODES.CENTRAL.every((c) => freeshipList.includes(c))
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Miền Trung ({REGION_PROVINCE_CODES.CENTRAL.length} tỉnh)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("SOUTH")}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.SOUTH.length && REGION_PROVINCE_CODES.SOUTH.every((c) => freeshipList.includes(c))
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Miền Nam ({REGION_PROVINCE_CODES.SOUTH.length} tỉnh)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("NONE")}
                        className="text-[11px] px-2 py-1 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all ml-auto cursor-pointer"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  )}

                  {/* Province Search & Grid */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-3 space-y-2.5">
                    {/* Search box */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={provinceSearch}
                        onChange={(e) => setProvinceSearch(e.target.value)}
                        placeholder="Tìm tỉnh / thành phố..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#075FA8]"
                      />
                      {provinceSearch && (
                        <button
                          type="button"
                          onClick={() => setProvinceSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Province checkboxes grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                      {filteredProvinces.map((prov) => {
                        const code = String(prov.code);
                        const selected = isProvinceSelected(code);
                        const isCompanyHome = code === companyProvinceCode;
                        return (
                          <label
                            key={code}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                              selected
                                ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#075FA8]/40 dark:border-blue-700/60 text-[#075FA8] dark:text-blue-300 font-bold"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                            } ${!isEditing ? "opacity-75 cursor-default pointer-events-none" : ""}`}
                          >
                            <input
                              type="checkbox"
                              disabled={!isEditing}
                              checked={selected}
                              onChange={() => handleToggleProvince(code)}
                              className="w-4 h-4 rounded accent-[#075FA8] cursor-pointer"
                            />
                            <span className="truncate flex-1">{prov.name}</span>
                            {isCompanyHome && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-[#075FA8] dark:text-blue-300">
                                Trụ sở
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono font-normal">
                              {code}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HÌNH ẢNH & KHO BÃI */}
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

        {/* BOTTOM SAVE ACTION BAR */}
        {isEditing && <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            💡 Lưu ý: Các thay đổi về cước phí, tỉnh thành Freeship, module POS và thông tin doanh nghiệp sẽ có hiệu lực ngay lập tức khi bạn nhấn Lưu.
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu cài đặt...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>LƯU THAY ĐỔI CÀI ĐẶT</span>
              </>
            )}
          </button>
        </div>}
      </form>
    </div>
  );
};
