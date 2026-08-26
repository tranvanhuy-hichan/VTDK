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
  Mail,
  FileText,
  Clock,
  Globe,
  MapPin,
  Tag,
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
import { Button } from "@/components/ui";

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

  // Logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Gallery
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    initialCompany.images || []
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  // Province search filter for Freeship
  const [provinceSearch, setProvinceSearch] = useState<string>("");

  // Province Detection
  const companyProvince = findProvinceByCity(form.city || form.address || "Đà Nẵng");
  const companyProvinceCode = companyProvince ? String(companyProvince.code) : "48";
  const companyProvinceName = companyProvince ? companyProvince.name : "Đà Nẵng";

  // Freeship Helpers
  const freeshipList: string[] = Array.isArray(form.freeshipProvinces)
    ? form.freeshipProvinces
    : [];
  const isAllFreeship =
    freeshipList.length === 0 ||
    freeshipList.includes("ALL") ||
    freeshipList.length === VIETNAM_PROVINCES.length;

  const isProvinceSelected = (code: string): boolean => {
    if (isAllFreeship) return true;
    return freeshipList.includes(code);
  };

  const handleToggleProvince = (code: string) => {
    if (!isEditing) return;
    let current = isAllFreeship
      ? VIETNAM_PROVINCES.map((p) => String(p.code))
      : [...freeshipList.filter((c) => c !== "ALL")];

    if (current.includes(code)) {
      current = current.filter((c) => c !== code);
    } else {
      current.push(code);
    }

    if (current.length === VIETNAM_PROVINCES.length) {
      handleChange("freeshipProvinces", ["ALL"]);
    } else {
      handleChange("freeshipProvinces", current);
    }
  };

  const handleSetPreset = (preset: "ALL" | "LOCAL" | "BIG_CITIES" | "NORTH" | "CENTRAL" | "SOUTH" | "NONE") => {
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
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
      setSavedSuccess(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
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
      setErrorMessage(err?.message || "Có lỗi xảy ra khi lưu thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLogo = logoPreview || form.logoUrl || PLACEHOLDER_IMAGE;
  const currentCover = removeImage
    ? PLACEHOLDER_IMAGE
    : imagePreview || form.image || PLACEHOLDER_IMAGE;

  return (
    <div className="space-y-2.5 max-w-6xl mx-auto text-left pb-12 sm:pb-0 font-sans">
      {/* 1. ULTRA COMPACT HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-3 sm:p-4 text-white shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Logo & Main Info */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative group shrink-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-slate-900 border border-white/20 p-1 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogo}
                  alt="Logo công ty"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 rounded-xl bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[8px] font-bold gap-0.5">
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

            <div className="min-w-0 space-y-0.5 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap leading-none">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[8.5px] font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="text-[10px] text-blue-200/80 font-mono">
                  MST: {form.taxCode || "Chưa thiết lập"}
                </span>
                {isEditing && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                    ✏️ Sửa
                  </span>
                )}
              </div>

              <h1 className="text-xs sm:text-base font-black text-white tracking-tight truncate leading-snug">
                {form.fullName || form.name || "Cấu hình Doanh nghiệp"}
              </h1>

              <div className="flex items-center gap-1.5 text-[10.5px] text-blue-100/80 truncate">
                <span className="font-bold text-amber-300 truncate">
                  {form.shortName || form.brandName}
                </span>
                {form.address && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="truncate opacity-80">{form.address}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5 shrink-0 justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <Button
              variant="outline"
              size="sm"
              href="/"
              target="_blank"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 text-xs !min-h-0"
            >
              Xem Web
            </Button>

            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 h-7 text-xs !min-h-0"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  form="company-form"
                  variant="success"
                  size="sm"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                  className="h-7 text-xs !min-h-0 font-black"
                >
                  LƯU
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartEdit}
                leftIcon={<Pencil className="w-3.5 h-3.5" />}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold h-7 text-xs !min-h-0 border-transparent shadow-xs"
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
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

      {/* 2. CUSTOM RESPONSIVE NAVIGATION TABS */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-0.5">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 select-none min-w-full sm:min-w-0">
          {[
            { key: "brand", label: "Thương hiệu & Pháp lý", shortLabel: "Thương hiệu", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { key: "contact", label: "Liên hệ & MXH", shortLabel: "Liên hệ", icon: <Phone className="w-3.5 h-3.5" /> },
            { key: "location", label: "Địa chỉ & Bản đồ", shortLabel: "Địa chỉ", icon: <MapPinned className="w-3.5 h-3.5" /> },
            { key: "shipping", label: "Vận chuyển & Phí", shortLabel: "Giao hàng", icon: <Truck className="w-3.5 h-3.5" /> },
            { key: "media", label: "Hình ảnh & Kho", shortLabel: "Hình ảnh", icon: <Images className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`flex-1 sm:flex-initial h-7.5 px-2.5 sm:px-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer !min-h-0 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN FORM BODY */}
      <form id="company-form" onSubmit={handleSubmit}>
        {/* TAB 1: THƯƠNG HIỆU & PHÁP LÝ */}
        {activeTab === "brand" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Chuẩn Hóa Danh Xưng Doanh Nghiệp
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Ánh xạ chính xác vào Header, Footer, Zalo, Hóa đơn VAT và SEO.
                  </p>
                </div>
              </div>
              {!isEditing && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <Lock className="w-3 h-3" /> Chỉ xem
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* fullName */}
              <div className="sm:col-span-2 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>1. Tên đầy đủ pháp lý (fullName)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    Footer, VAT, Giấy tờ
                  </span>
                </div>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Công ty TNHH Vật Tư Đông Kha"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
                <p className="text-[10px] text-slate-400">Tên pháp nhân công ty trên giấy phép ĐKKD.</p>
              </div>

              {/* shortName */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>2. Tên thương hiệu ngắn (shortName)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    Header, Menu
                  </span>
                </div>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={form.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                  placeholder="VẬT TƯ ĐÔNG KHA"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
                <p className="text-[10px] text-slate-400">Hiển thị nổi bật cạnh logo trên thanh Menu.</p>
              </div>

              {/* brandName */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>3. Tên gọi nhanh (brandName)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    Zalo, Xưng hô
                  </span>
                </div>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={form.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  placeholder="Đông Kha"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
                <p className="text-[10px] text-slate-400">Ví dụ: &quot;Chào Đông Kha, tôi muốn hỏi giá...&quot;</p>
              </div>

              {/* tagline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    4. Khẩu hiệu / Slogan (tagline)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    Dưới Logo
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="VẬT TƯ ĐIỆN LẠNH ĐÀ NẴNG"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
                <p className="text-[10px] text-slate-400">Chữ in hoa nhỏ nằm ngay dưới logo.</p>
              </div>

              {/* city */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Khu vực / Thành phố chính (city)
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Đà Nẵng & Miền Trung"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
                <p className="text-[10px] text-slate-400">Khu vực phục vụ khách hàng chính.</p>
              </div>

              {/* taxCode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Mã số thuế doanh nghiệp (taxCode)
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.taxCode || ""}
                  onChange={(e) => handleChange("taxCode", e.target.value)}
                  placeholder="0402123456"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 font-mono transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
              </div>

              {/* email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Email liên hệ chính thức (email)
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="lienhe@vattudongkha.io.vn"
                  className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIÊN HỆ & MẠNG XÃ HỘI */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start animate-in fade-in duration-200">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#F47A20]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Kênh Hotline &amp; Mạng Xã Hội
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Kết nối trực tiếp với khách hàng và đối tác thợ điện lạnh.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* hotline */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Số điện thoại Hotline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.hotline}
                    onChange={(e) => handleChange("hotline", e.target.value)}
                    placeholder="0905 487 441"
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 font-mono font-bold transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#F47A20] cursor-default"
                    }`}
                  />
                </div>

                {/* zaloUrl */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Link Zalo cá nhân / Zalo OA
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.zaloUrl}
                    onChange={(e) => handleChange("zaloUrl", e.target.value)}
                    placeholder="https://zalo.me/0905487441"
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 cursor-default"
                    }`}
                  />
                </div>

                {/* whatsAppUrl */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Link WhatsApp
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.whatsAppUrl}
                    onChange={(e) => handleChange("whatsAppUrl", e.target.value)}
                    placeholder="https://wa.me/84905487441"
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 cursor-default"
                    }`}
                  />
                </div>

                {/* facebookUrl */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Link Fanpage Facebook
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.facebookUrl}
                    onChange={(e) => handleChange("facebookUrl", e.target.value)}
                    placeholder="https://www.facebook.com/..."
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[#1877F2] cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Toggle Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Chính Sách Giao Hàng
                </h3>
              </div>

              <label className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                isEditing ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 cursor-default"
              }`}>
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                    Bật Giao Hàng Tận Nơi
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Khách có thể chọn nhận hàng tại nhà hoặc lấy tại kho.
                  </span>
                </div>
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  checked={form.hasDelivery}
                  onChange={(e) => handleChange("hasDelivery", e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#075FA8] cursor-pointer disabled:cursor-default"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: ĐỊA CHỈ & BẢN ĐỒ */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start animate-in fade-in duration-200">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <MapPinned className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Địa Chỉ Kho &amp; Giờ Mở Cửa
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Chỉ đường cho khách hàng ghé lấy hàng trực tiếp.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Địa chỉ kho / Showroom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng"
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* workingHours */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Khung giờ mở cửa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={form.workingHours}
                    onChange={(e) => handleChange("workingHours", e.target.value)}
                    placeholder="07:00 – 18:30 (Tất cả các ngày trong tuần)"
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* googleMapsUrl */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Link mở app Google Maps
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.googleMapsUrl}
                    onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                    placeholder="https://www.google.com/maps/..."
                    className={`w-full text-xs sm:text-sm rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                    }`}
                  />
                </div>

                {/* googleMapsEmbed */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Mã nhúng iframe Google Maps (Embed)
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={form.googleMapsEmbed}
                    onChange={(e) => handleChange("googleMapsEmbed", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className={`w-full text-xs font-mono rounded-xl px-3 py-2 transition-all ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-default"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Live Map Preview Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Xem Trước Bản Đồ
              </h3>
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative shadow-inner">
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

        {/* TAB 4: VẬN CHUYỂN & GIAO HÀNG */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start animate-in fade-in duration-200">
            {/* CỘT 1: CẤU HÌNH CƯỚC */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Cước Phí Vận Chuyển
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Áp dụng tự động khi khách đặt hàng online.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* hasDelivery switch */}
                <label
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                    isEditing
                      ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-default"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                      Bật Giao Hàng Tận Nơi
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Cho phép khách hàng chọn &quot;Giao hàng tận nơi&quot; khi thanh toán.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isEditing}
                    checked={form.hasDelivery}
                    onChange={(e) => handleChange("hasDelivery", e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#075FA8] cursor-pointer disabled:cursor-default"
                  />
                </label>

                {/* shippingFeeDanang */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Phí giao nội tỉnh / Cùng địa bàn (VNĐ) <span className="text-red-500">*</span>
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
                      className={`w-full text-xs sm:text-sm font-bold rounded-xl px-3 py-2 pr-12 transition-all ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                </div>

                {/* shippingFeeProvince */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Phí giao liên tỉnh / Xe chành (VNĐ) <span className="text-red-500">*</span>
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
                      className={`w-full text-xs sm:text-sm font-bold rounded-xl px-3 py-2 pr-12 transition-all ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                </div>

                {/* shippingNote */}
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Chính sách &amp; Lời dặn giao hàng
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={form.shippingNote || ""}
                    onChange={(e) => handleChange("shippingNote", e.target.value)}
                    placeholder="Miễn phí giao hàng cho đơn đạt định mức tại các tỉnh thành áp dụng..."
                    className={`w-full text-xs rounded-xl px-3 py-2 transition-all leading-relaxed ${
                      isEditing
                        ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                        : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-default"
                    }`}
                  />
                </div>

                {/* enablePosModule */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {form.enablePosModule ?? true ? "🟢 Module POS Bán Tại Quầy (Bật)" : "⚪ Module POS (Tắt)"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Bán hàng quét mã vạch trực tiếp tại showroom.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={form.enablePosModule ?? true}
                      onChange={(e) => handleChange("enablePosModule", e.target.checked)}
                      className="w-4 h-4 text-[#075FA8] border-slate-300 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* CỘT 2: FREESHIP POLICY */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Chính Sách Freeship
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Định mức miễn phí vận chuyển.
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {isAllFreeship ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Toàn quốc (63 tỉnh)</span>
                  ) : freeshipList.length > 0 ? (
                    <span className="text-[#075FA8] dark:text-blue-400">{freeshipList.length} tỉnh</span>
                  ) : (
                    <span className="text-amber-600">Tắt Freeship</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* freeshipThreshold */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Định mức Đơn Hàng Để Được Freeship (VNĐ)
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
                      className={`w-full text-xs sm:text-sm font-bold rounded-xl px-3 py-2 pr-12 transition-all ${
                        isEditing
                          ? "bg-white dark:bg-slate-800 border border-[#075FA8] text-slate-900 dark:text-white shadow-xs focus:ring-1 focus:ring-[#075FA8]"
                          : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-default"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                      VNĐ
                    </span>
                  </div>
                </div>

                {/* Preset Buttons */}
                {isEditing && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold block">Chọn nhanh danh sách tỉnh:</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetPreset("ALL")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          isAllFreeship ? "bg-[#075FA8] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Toàn quốc
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("LOCAL")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === 1 && freeshipList.includes(companyProvinceCode) ? "bg-[#075FA8] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Nội tỉnh
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("BIG_CITIES")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.BIG_CITIES.length ? "bg-[#075FA8] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        6 Đô thị lớn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("CENTRAL")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          !isAllFreeship && freeshipList.length === REGION_PROVINCE_CODES.CENTRAL.length ? "bg-[#075FA8] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Miền Trung
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPreset("NONE")}
                        className="text-[10px] px-2 py-0.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all ml-auto cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>
                )}

                {/* Province Search & Grid */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={provinceSearch}
                      onChange={(e) => setProvinceSearch(e.target.value)}
                      placeholder="Tìm tỉnh thành..."
                      className="w-full pl-8 pr-7 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                    {provinceSearch && (
                      <button
                        type="button"
                        onClick={() => setProvinceSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {filteredProvinces.map((prov) => {
                      const code = String(prov.code);
                      const selected = isProvinceSelected(code);
                      const isCompanyHome = code === companyProvinceCode;
                      return (
                        <label
                          key={code}
                          className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                            selected
                              ? "bg-blue-50/90 dark:bg-blue-950/40 border-[#075FA8]/40 dark:border-blue-700/60 text-[#075FA8] dark:text-blue-300 font-bold"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          } ${!isEditing ? "opacity-75 cursor-default pointer-events-none" : ""}`}
                        >
                          <input
                            type="checkbox"
                            disabled={!isEditing}
                            checked={selected}
                            onChange={() => handleToggleProvince(code)}
                            className="w-3.5 h-3.5 rounded accent-[#075FA8] cursor-pointer"
                          />
                          <span className="truncate flex-1 text-[11px]">{prov.name}</span>
                          {isCompanyHome && (
                            <span className="text-[8px] font-bold px-1 rounded bg-blue-100 dark:bg-blue-900 text-[#075FA8] dark:text-blue-300">
                              Trụ sở
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HÌNH ẢNH & KHO BÃI */}
        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start animate-in fade-in duration-200">
            {/* Storefront Cover */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8]">
                  <Images className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Ảnh Mặt Tiền &amp; Kho Tổng
                  </h3>
                  <p className="text-[11px] text-slate-400">Hiển thị ở đầu trang chủ.</p>
                </div>
              </div>

              <div className="aspect-[16/10] w-full rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
                <img
                  src={currentCover}
                  alt="Ảnh đại diện kho"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="inline-flex items-center justify-center gap-1 cursor-pointer text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-[#075FA8] rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors">
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
                    <label className="inline-flex items-center justify-center gap-1 cursor-pointer text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-[#075FA8] rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors">
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
                      className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl py-1.5 text-xs font-bold transition-colors !min-h-0 cursor-pointer"
                    >
                      Xóa ảnh bìa
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Images className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Thư Viện Ảnh Hoạt Động ({existingGalleryUrls.length + newGalleryFiles.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Hình ảnh hàng hóa, bo mạch, xe giao hàng.</p>
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
                <div className="grid grid-cols-3 gap-2">
                  {existingGalleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-6 text-center">Chưa có ảnh nào trong thư viện.</p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SAVE ACTION BAR (Desktop) */}
        {isEditing && (
          <div className="hidden sm:flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mt-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              💡 Lưu ý: Các thông tin sau khi lưu sẽ có hiệu lực ngay lập tức trên toàn hệ thống website.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="success"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-3.5 h-3.5" />}
                className="font-black bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                LƯU THAY ĐỔI CÀI ĐẶT
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* STICKY FLOATING BOTTOM BAR (Mobile - only when isEditing) */}
      {isEditing && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl flex items-center justify-between gap-2 sm:hidden">
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSubmitting}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-all !min-h-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hủy</span>
          </button>
          <button
            type="submit"
            form="company-form"
            disabled={isSubmitting}
            className="flex-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 !min-h-0 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>LƯU THAY ĐỔI</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
