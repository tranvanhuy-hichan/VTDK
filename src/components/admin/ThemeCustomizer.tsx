"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  Palette,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Download,
  Upload,
  Type,
  Layers,
  ShoppingBag,
  ShoppingCart,
  Phone,
  MessageCircle,
  Search,
  Check,
  Laptop,
  Tablet,
  Smartphone,
  SlidersHorizontal,
  Save,
  HelpCircle,
  Building2,
  CheckCircle,
  Eye,
} from "lucide-react";
import {
  FONT_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  getRadiusValue,
  type ThemePreset,
} from "../../lib/theme";
import type { CompanyContact } from "../../lib/company";
import { updateThemeSettingsAction } from "../../actions/adminActions";

interface ThemeCustomizerProps {
  initialCompany: CompanyContact;
}

const PRESET_LIST: (ThemePreset & { category: string })[] = [
  {
    id: "ocean-blue",
    name: "Đông Kha Xanh Đại Dương (Mặc định)",
    description: "Xanh biển công nghệ & Cam nhiệt đới. Hoàn hảo cho Điện lạnh, Điện máy, Kỹ thuật.",
    primaryColor: "#075FA8",
    primaryDark: "#0B1F33",
    primaryLight: "#EBF3FA",
    accentColor: "#F47A20",
    accentHover: "#E06912",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-blue-600",
    category: "Điện lạnh & Điện máy",
  },
  {
    id: "emerald-green",
    name: "Xanh Ngọc Lục Bảo (Eco & Y tế)",
    description: "Xanh lá tươi & Vàng hổ phách. Thích hợp Nông sản, Dược phẩm, Môi trường.",
    primaryColor: "#059669",
    primaryDark: "#064E3B",
    primaryLight: "#ECFDF5",
    accentColor: "#D97706",
    accentHover: "#B45309",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-emerald-600",
    category: "Nông sản & Y tế",
  },
  {
    id: "ruby-red",
    name: "Đỏ Ruby Công Nghiệp (Mạnh Mẽ)",
    description: "Đỏ Ruby & Cam lửa. Tối ưu cho Cơ khí, Vật liệu xây dựng, Kim khí.",
    primaryColor: "#DC2626",
    primaryDark: "#7F1D1D",
    primaryLight: "#FEF2F2",
    accentColor: "#EA580C",
    accentHover: "#C2410C",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-red-600",
    category: "Cơ khí & Xây dựng",
  },
  {
    id: "sunset-orange",
    name: "Cam Hoàng Hôn (Bán Lẻ & Thời Trang)",
    description: "Cam ấm áp & Xanh Navy. Thích hợp Gia dụng, Bán lẻ, Thời trang tiêu dùng.",
    primaryColor: "#EA580C",
    primaryDark: "#1E293B",
    primaryLight: "#FFF7ED",
    accentColor: "#0284C7",
    accentHover: "#0369A1",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-2xl",
    badgeBg: "bg-orange-600",
    category: "Bán lẻ & Gia dụng",
  },
  {
    id: "indigo-purple",
    name: "Tím Công Nghệ (Hi-Tech & SaaS)",
    description: "Tím tương lai & Hồng Neon. Đẳng cấp cho Phần mềm, Thiết bị số thông minh.",
    primaryColor: "#7C3AED",
    primaryDark: "#2E1065",
    primaryLight: "#F5F3FF",
    accentColor: "#DB2777",
    accentHover: "#BE185D",
    fontFamily: "Inter",
    borderRadius: "rounded-2xl",
    badgeBg: "bg-purple-600",
    category: "Công nghệ số",
  },
  {
    id: "charcoal-luxury",
    name: "Đen Than Sang Trọng (Luxury)",
    description: "Đen than tối giản & Vàng kim hoàng gia. Thích hợp Hàng hiệu, Nội thất cao cấp.",
    primaryColor: "#18181B",
    primaryDark: "#09090B",
    primaryLight: "#F4F4F5",
    accentColor: "#CA8A04",
    accentHover: "#A16207",
    fontFamily: "Plus Jakarta Sans",
    borderRadius: "rounded-lg",
    badgeBg: "bg-zinc-800",
    category: "Cao cấp & Sang trọng",
  },
  {
    id: "cyan-nordic",
    name: "Xanh Cyan Bắc Âu (Minimalist)",
    description: "Xanh Cyan thanh thoát & Xám khói. Phong cách Bắc Âu tinh tế, thoáng đãng.",
    primaryColor: "#0891B2",
    primaryDark: "#164E63",
    primaryLight: "#ECFEFF",
    accentColor: "#059669",
    accentHover: "#047857",
    fontFamily: "Inter",
    borderRadius: "rounded-xl",
    badgeBg: "bg-cyan-600",
    category: "Tối giản Bắc Âu",
  },
  {
    id: "rose-elegance",
    name: "Hồng Quý Phái (Spa & Mỹ Phẩm)",
    description: "Hồng đào dịu ngọt & Tím đậm. Thích hợp Mỹ phẩm, Spa làm đẹp, Quà tặng.",
    primaryColor: "#E11D48",
    primaryDark: "#4C0519",
    primaryLight: "#FFF1F2",
    accentColor: "#9333EA",
    accentHover: "#7E22CE",
    fontFamily: "Montserrat",
    borderRadius: "rounded-3xl",
    badgeBg: "bg-rose-600",
    category: "Làm đẹp & Quà tặng",
  },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ initialCompany }) => {
  const [isPending, startTransition] = useTransition();

  // Form states
  const [selectedPreset, setSelectedPreset] = useState<string>(
    initialCompany.themePreset || "ocean-blue"
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialCompany.primaryColor || "#075FA8"
  );
  const [primaryDark, setPrimaryDark] = useState(
    initialCompany.primaryDark || "#0B1F33"
  );
  const [primaryLight, setPrimaryLight] = useState(
    initialCompany.primaryLight || "#EBF3FA"
  );
  const [accentColor, setAccentColor] = useState(
    initialCompany.accentColor || "#F47A20"
  );
  const [accentHover, setAccentHover] = useState(
    initialCompany.accentHover || "#E06912"
  );
  const [fontFamily, setFontFamily] = useState(
    initialCompany.fontFamily || "Be Vietnam Pro"
  );
  const [borderRadius, setBorderRadius] = useState(
    initialCompany.borderRadius || "rounded-xl"
  );
  const [customCss, setCustomCss] = useState(initialCompany.customCss || "");

  // UI state
  const [activeTab, setActiveTab] = useState<"presets" | "colors" | "typography" | "advanced" | "preview">("presets");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("mobile");
  const [previewPage, setPreviewPage] = useState<"home" | "product" | "checkout">("home");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Apply Preset
  const handleApplyPreset = (preset: ThemePreset) => {
    setSelectedPreset(preset.id);
    setPrimaryColor(preset.primaryColor);
    setPrimaryDark(preset.primaryDark);
    setPrimaryLight(preset.primaryLight);
    setAccentColor(preset.accentColor);
    setAccentHover(preset.accentHover);
    setFontFamily(preset.fontFamily);
    setBorderRadius(preset.borderRadius);
    setStatusMessage({
      type: "success",
      text: `Đã chọn mẫu "${preset.name}". Nhấn "Lưu & Áp Dụng" để kích hoạt.`,
    });
  };

  // Smart Color Harmonizer
  const handleSmartHarmonize = (baseHex: string) => {
    setPrimaryColor(baseHex);
    setSelectedPreset("custom");
    const darkHex = shadeColor(baseHex, -55);
    const lightHex = shadeColor(baseHex, 92);
    setPrimaryDark(darkHex);
    setPrimaryLight(lightHex);
    setStatusMessage({
      type: "info",
      text: "Đã tự động phối màu Header và màu nền phụ hài hòa từ màu chủ đạo.",
    });
  };

  // Color shade helper
  function shadeColor(color: string, percent: number) {
    let num = parseInt(color.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  // Export JSON
  const handleExportJson = () => {
    const config = {
      themePreset: selectedPreset,
      primaryColor,
      primaryDark,
      primaryLight,
      accentColor,
      accentHover,
      fontFamily,
      borderRadius,
      customCss,
      exportedAt: new Date().toISOString(),
      company: initialCompany.shortName || initialCompany.brandName,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-config-${(initialCompany.shortName || "brand").toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.primaryColor) setPrimaryColor(json.primaryColor);
        if (json.primaryDark) setPrimaryDark(json.primaryDark);
        if (json.primaryLight) setPrimaryLight(json.primaryLight);
        if (json.accentColor) setAccentColor(json.accentColor);
        if (json.accentHover) setAccentHover(json.accentHover);
        if (json.fontFamily) setFontFamily(json.fontFamily);
        if (json.borderRadius) setBorderRadius(json.borderRadius);
        if (json.themePreset) setSelectedPreset(json.themePreset);
        if (json.customCss) setCustomCss(json.customCss);
        setStatusMessage({
          type: "success",
          text: "Đã nạp cấu hình JSON thành công! Kiểm tra bản xem trước và bấm Lưu.",
        });
      } catch {
        setStatusMessage({
          type: "error",
          text: "File JSON không hợp lệ!",
        });
      }
    };
    reader.readAsText(file);
  };

  // Reset to original Defaults
  const handleResetToDefault = () => {
    const defaultPreset = PRESET_LIST[0];
    handleApplyPreset(defaultPreset);
  };

  // Save Settings to Database
  const handleSaveTheme = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await updateThemeSettingsAction({
        themePreset: selectedPreset,
        primaryColor,
        primaryDark,
        primaryLight,
        accentColor,
        accentHover,
        fontFamily,
        borderRadius,
        customCss,
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "🎉 Lưu cấu hình giao diện thành công! Hệ thống đã cập nhật nhận diện mới.",
        });
        document.documentElement.style.setProperty("--color-primary", primaryColor);
        document.documentElement.style.setProperty("--color-primary-dark", primaryDark);
        document.documentElement.style.setProperty("--color-primary-light", primaryLight);
        document.documentElement.style.setProperty("--color-accent", accentColor);
        document.documentElement.style.setProperty("--color-accent-hover", accentHover);
        document.documentElement.style.setProperty("--theme-border-radius", getRadiusValue(borderRadius));
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Có lỗi xảy ra khi lưu giao diện!",
        });
      }
    });
  };

  const currentRadiusValue = useMemo(() => getRadiusValue(borderRadius), [borderRadius]);

  return (
    <div className="space-y-3 w-full mx-auto text-left pb-16 px-1 sm:px-0">
      {/* 1. COMPACT HEADER BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] p-3 sm:p-4 text-white shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {/* Title & Brand */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-200 uppercase tracking-wide truncate">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{initialCompany.shortName || "Theme Studio"}</span>
            </div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-white leading-tight truncate">
              Tùy Biến Theme &amp; Giao Diện
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Secondary actions dropdown / quick icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer !min-h-0"
                title="Xuất file JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden md:inline ml-1">Xuất JSON</span>
              </button>

              <label className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer !min-h-0">
                <Upload className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden md:inline ml-1">Nhập JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-bold border border-white/15 transition-all cursor-pointer !min-h-0"
                title="Khôi phục mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline ml-1">Mặc định</span>
              </button>
            </div>

            {/* Primary Save Button */}
            <button
              type="button"
              onClick={handleSaveTheme}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#F47A20] hover:bg-[#E06912] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 !min-h-0 shrink-0"
            >
              {isPending ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isPending ? "Lưu..." : "Lưu"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Toast */}
      {statusMessage && (
        <div
          className={`p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs font-bold border shadow-2xs transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : statusMessage.type === "error"
              ? "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
              : "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : statusMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            )}
            <span className="truncate">{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-[10px] opacity-70 hover:opacity-100 cursor-pointer !min-h-0 shrink-0 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. UNIFIED TAB BAR (Single clean row on Mobile & Desktop) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex-1 min-w-[65px] py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap !min-h-0 ${
            activeTab === "presets"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Palette className="w-3.5 h-3.5 shrink-0" />
          <span>Mẫu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("colors")}
          className={`flex-1 min-w-[65px] py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap !min-h-0 ${
            activeTab === "colors"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
          <span>Màu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={`flex-1 min-w-[70px] py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap !min-h-0 ${
            activeTab === "typography"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Type className="w-3.5 h-3.5 shrink-0" />
          <span>Font/Góc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("advanced")}
          className={`flex-1 min-w-[60px] py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap !min-h-0 ${
            activeTab === "advanced"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>CSS</span>
        </button>

        {/* 5th Tab: Preview on Mobile (< xl) */}
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 min-w-[75px] py-2 px-1.5 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap !min-h-0 xl:hidden ${
            activeTab === "preview"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
          <span>Xem thử</span>
        </button>
      </div>

      {/* 3. MAIN CONTENT: TABS CONTENT & DESKTOP CANVAS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className={`xl:col-span-5 space-y-3 ${activeTab === "preview" ? "hidden xl:block" : "block"}`}>

          {/* TAB 1: PRESET LIST */}
          {activeTab === "presets" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Danh Sách Theme Mẫu ({PRESET_LIST.length} mẫu)
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Chọn mẫu phù hợp với màu nhận diện thương hiệu của doanh nghiệp.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-0.5 sm:pr-1 no-scrollbar">
                {PRESET_LIST.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group !min-h-0 flex flex-col gap-1.5 ${
                        isSelected
                          ? "border-[#075FA8] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs"
                          : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {preset.category}
                        </span>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#075FA8] text-white flex items-center justify-center shadow-xs shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                          {preset.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      {/* 4 Swatch Dots */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-md shadow-2xs border border-white/20 shrink-0"
                            style={{ backgroundColor: preset.primaryColor }}
                            title={`Chủ đạo: ${preset.primaryColor}`}
                          />
                          <div
                            className="w-5 h-5 rounded-md shadow-2xs border border-white/20 shrink-0"
                            style={{ backgroundColor: preset.primaryDark }}
                            title={`Header: ${preset.primaryDark}`}
                          />
                          <div
                            className="w-5 h-5 rounded-md shadow-2xs border border-slate-300 shrink-0"
                            style={{ backgroundColor: preset.primaryLight }}
                            title={`Nền phụ: ${preset.primaryLight}`}
                          />
                          <div
                            className="w-5 h-5 rounded-md shadow-2xs border border-white/20 shrink-0"
                            style={{ backgroundColor: preset.accentColor }}
                            title={`Nút CTA: ${preset.accentColor}`}
                          />
                        </div>

                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate max-w-[150px]">
                          {preset.fontFamily} • {preset.borderRadius}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED COLOR ROLES */}
          {activeTab === "colors" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Tùy Chỉnh Màu Sắc Chi Tiết
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Chọn màu trực quan hoặc nhập mã Hex theo hệ thống nhận diện.
                </p>
              </div>

              {/* 1. Primary Color */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-black text-slate-900 dark:text-white">
                    Màu Chủ Đạo (Primary)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSmartHarmonize(primaryColor)}
                    className="text-[11px] font-bold text-[#075FA8] dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer !min-h-0"
                    title="Tự động tính màu Header và Nền phụ"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tự phối màu</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setSelectedPreset("custom");
                    }}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-white shadow-xs shrink-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setSelectedPreset("custom");
                    }}
                    className="font-mono text-xs uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 flex-1 font-bold"
                  />
                </div>

                {/* Quick Swatches */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">Màu gợi ý:</span>
                  {[
                    "#075FA8",
                    "#0284C7",
                    "#059669",
                    "#10B981",
                    "#DC2626",
                    "#E11D48",
                    "#EA580C",
                    "#D97706",
                    "#7C3AED",
                    "#4F46E5",
                    "#18181B",
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handleSmartHarmonize(hex)}
                      className="w-5 h-5 rounded-md border border-white shadow-2xs hover:scale-125 transition-transform cursor-pointer !min-h-0"
                      style={{ backgroundColor: hex }}
                      title={`Chọn ${hex}`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Secondary Shades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Header Dark */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <label className="text-xs font-black text-slate-900 dark:text-white block">
                    Màu Tối / Header (Dark)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryDark}
                      onChange={(e) => {
                        setPrimaryDark(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="w-8 h-8 rounded-md cursor-pointer border border-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryDark}
                      onChange={(e) => {
                        setPrimaryDark(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="font-mono text-xs uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 flex-1 font-bold"
                    />
                  </div>
                </div>

                {/* Light Tint */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <label className="text-xs font-black text-slate-900 dark:text-white block">
                    Màu Nền Nhạt (Light)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryLight}
                      onChange={(e) => {
                        setPrimaryLight(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="w-8 h-8 rounded-md cursor-pointer border border-white shadow-2xs shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryLight}
                      onChange={(e) => {
                        setPrimaryLight(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="font-mono text-xs uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 flex-1 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Accent CTA Color */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <label className="text-xs font-black text-slate-900 dark:text-white block">
                  Màu Điểm Nhấn / Nút Mua Ngay (Accent CTA)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="w-8 h-8 rounded-md cursor-pointer border border-white shadow-2xs shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-slate-400 block">Màu chính:</span>
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setSelectedPreset("custom");
                        }}
                        className="font-mono text-xs uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 text-slate-900 dark:text-slate-100 w-full font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentHover}
                      onChange={(e) => {
                        setAccentHover(e.target.value);
                        setSelectedPreset("custom");
                      }}
                      className="w-8 h-8 rounded-md cursor-pointer border border-white shadow-2xs shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-slate-400 block">Khi rê chuột:</span>
                      <input
                        type="text"
                        value={accentHover}
                        onChange={(e) => {
                          setAccentHover(e.target.value);
                          setSelectedPreset("custom");
                        }}
                        className="font-mono text-xs uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 text-slate-900 dark:text-slate-100 w-full font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & CORNER RADIUS */}
          {activeTab === "typography" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Kiểu Chữ &amp; Độ Bo Góc
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tùy chỉnh phông chữ thương hiệu và góc bo của các thành phần giao diện.
                </p>
              </div>

              {/* Font selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 dark:text-white block">
                  Phông Chữ Toàn Trang
                </label>
                <div className="space-y-1.5">
                  {FONT_OPTIONS.map((font) => (
                    <label
                      key={font.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                        fontFamily === font.id
                          ? "border-[#075FA8] dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30"
                          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="radio"
                          name="fontFamily"
                          value={font.id}
                          checked={fontFamily === font.id}
                          onChange={() => setFontFamily(font.id)}
                          className="w-3.5 h-3.5 text-[#075FA8] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                            {font.name}
                          </span>
                        </div>
                      </div>
                      {fontFamily === font.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0 ml-1" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Radius selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-black text-slate-900 dark:text-white block">
                  Độ Bo Góc Nút &amp; Khung Thẻ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BORDER_RADIUS_OPTIONS.map((radius) => {
                    const isSelected = borderRadius === radius.id;
                    return (
                      <button
                        key={radius.id}
                        type="button"
                        onClick={() => setBorderRadius(radius.id)}
                        className={`p-2 rounded-xl border-2 text-center transition-all cursor-pointer !min-h-0 flex flex-col items-center gap-1 ${
                          isSelected
                            ? "border-[#075FA8] dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 text-[#075FA8] dark:text-blue-400 font-extrabold"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                        }`}
                      >
                        <div
                          className="w-8 h-4 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"
                          style={{ borderRadius: radius.value }}
                        />
                        <span className="text-[10px] truncate max-w-full">{radius.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED CSS */}
          {activeTab === "advanced" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Tùy Biến CSS Mở Rộng
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dành cho quản trị viên kỹ thuật muốn thêm các đoạn CSS tùy chỉnh.
                </p>
              </div>

              <textarea
                rows={8}
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="/* Ví dụ: */&#10;.custom-class { color: var(--color-primary); }"
                className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#075FA8]"
              />
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE DEVICE CANVAS ================= */}
        <div className={`xl:col-span-7 space-y-3 ${activeTab === "preview" ? "block" : "hidden xl:block"}`}>
          {/* Top Control Bar of Canvas */}
          <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer !min-h-0 ${
                  previewDevice === "desktop"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer !min-h-0 ${
                  previewDevice === "tablet"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer !min-h-0 ${
                  previewDevice === "mobile"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Page View Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setPreviewPage("home")}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer !min-h-0 ${
                  previewPage === "home"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Trang Chủ
              </button>
              <button
                type="button"
                onClick={() => setPreviewPage("product")}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer !min-h-0 ${
                  previewPage === "product"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Chi Tiết SP
              </button>
              <button
                type="button"
                onClick={() => setPreviewPage("checkout")}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer !min-h-0 ${
                  previewPage === "checkout"
                    ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-blue-300 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Giỏ Hàng
              </button>
            </div>
          </div>

          {/* Canvas Screen */}
          <div className="flex justify-center items-start w-full bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[480px]">
            <div
              className={`bg-white dark:bg-slate-900 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col overflow-hidden text-left w-full ${
                previewDevice === "desktop"
                  ? "max-w-[800px]"
                  : previewDevice === "tablet"
                  ? "max-w-[500px]"
                  : "max-w-[340px]"
              }`}
              style={{
                ["--color-primary" as any]: primaryColor,
                ["--color-primary-dark" as any]: primaryDark,
                ["--color-primary-light" as any]: primaryLight,
                ["--color-accent" as any]: accentColor,
                ["--color-accent-hover" as any]: accentHover,
                ["--theme-border-radius" as any]: currentRadiusValue,
              }}
            >
              {/* Browser bar */}
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white dark:bg-slate-900 px-3 py-0.5 rounded-md text-[10px] font-mono text-slate-500 border border-slate-200 dark:border-slate-700 truncate max-w-[160px] sm:max-w-[200px]">
                  https://{(initialCompany.shortName || "cuahang").toLowerCase().replace(/\s+/g, "")}.com
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  {previewDevice === "desktop" ? "Desktop" : previewDevice === "tablet" ? "Tablet" : "Mobile"}
                </div>
              </div>

              {/* Preview Content Area */}
              <div className="p-3 sm:p-4 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
                {/* 1. Top Bar */}
                <div
                  className="px-3 py-1 rounded-xl text-[10px] text-slate-200 flex items-center justify-between shadow-2xs transition-colors"
                  style={{ backgroundColor: primaryDark }}
                >
                  <span className="truncate">Kho: {initialCompany.address || "123 Đường Số 1, Đà Nẵng"}</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1 shrink-0">
                    <Phone className="w-3 h-3" />
                    {initialCompany.hotline || "0905.000.000"}
                  </span>
                </div>

                {/* 2. Header Bar */}
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-[10px] shadow-2xs shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      LOGO
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                        {initialCompany.shortName || "VẬT TƯ ĐÔNG KHA"}
                      </div>
                      <div className="text-[8px] text-slate-400 uppercase tracking-widest font-bold truncate">
                        {initialCompany.tagline || "ĐẠI LÝ CHÍNH HÃNG"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Search className="w-3 h-3" />
                      <span>Tìm kiếm...</span>
                    </div>
                    <div
                      className="p-1.5 rounded-lg text-white shadow-2xs flex items-center gap-1 text-[10px] font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span className="hidden sm:inline">Giỏ (2)</span>
                    </div>
                  </div>
                </div>

                {/* PAGE 1: HOME PREVIEW */}
                {previewPage === "home" && (
                  <div className="space-y-3">
                    {/* Hero */}
                    <div
                      className="p-3.5 sm:p-4 rounded-xl text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
                        borderRadius: currentRadiusValue,
                      }}
                    >
                      <div className="space-y-1">
                        <span
                          className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded inline-block shadow-2xs text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          Chính hãng 100%
                        </span>
                        <h4 className="text-xs sm:text-sm font-black leading-tight">
                          Tổng Kho Vật Tư Điện Lạnh Chính Hãng
                        </h4>
                        <p className="text-[10px] text-slate-200/90 line-clamp-1">
                          Hàng sẵn kho, giá sỉ tốt nhất, bảo hành chính hãng.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[10px] sm:text-[11px] font-black text-white shadow-xs cursor-pointer !min-h-0"
                          style={{
                            backgroundColor: accentColor,
                            borderRadius: currentRadiusValue,
                          }}
                        >
                          Xem Báo Giá
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs cursor-pointer !min-h-0"
                          style={{ borderRadius: currentRadiusValue }}
                        >
                          Liên Hệ Zalo
                        </button>
                      </div>
                    </div>

                    {/* Product Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-2"
                        style={{ borderRadius: currentRadiusValue }}
                      >
                        <div className="space-y-1">
                          <div
                            className="h-16 sm:h-20 w-full rounded-lg flex items-center justify-center font-bold text-[9px] sm:text-[10px] border border-slate-100 dark:border-slate-800"
                            style={{ backgroundColor: primaryLight, color: primaryColor }}
                          >
                            Ống Đồng Thái Lan
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[8px] font-extrabold px-1 py-0.5 rounded"
                              style={{ backgroundColor: primaryLight, color: primaryColor }}
                            >
                              Bán chạy
                            </span>
                            <span className="text-[9px] text-slate-400 line-through">550.000đ</span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            Ống Đồng Ø6.35
                          </h5>
                          <div className="font-black text-xs text-red-600">
                            420.000đ
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-full py-1.5 text-white text-[10px] sm:text-[11px] font-black shadow-2xs flex items-center justify-center gap-1 cursor-pointer !min-h-0"
                          style={{
                            backgroundColor: primaryColor,
                            borderRadius: currentRadiusValue,
                          }}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Thêm giỏ</span>
                        </button>
                      </div>

                      <div
                        className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-2"
                        style={{ borderRadius: currentRadiusValue }}
                      >
                        <div className="space-y-1">
                          <div
                            className="h-16 sm:h-20 w-full rounded-lg flex items-center justify-center font-bold text-[9px] sm:text-[10px] border border-slate-100 dark:border-slate-800"
                            style={{ backgroundColor: primaryLight, color: primaryColor }}
                          >
                            Gas Lạnh R32
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[8px] font-extrabold px-1 py-0.5 rounded text-white"
                              style={{ backgroundColor: accentColor }}
                            >
                              -15% SALE
                            </span>
                            <span className="text-[9px] text-slate-400 line-through">1.200.000đ</span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            Gas R32 Daikin 3kg
                          </h5>
                          <div className="font-black text-xs text-red-600">
                            990.000đ
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-full py-1.5 text-white text-[10px] sm:text-[11px] font-black shadow-2xs flex items-center justify-center gap-1 cursor-pointer !min-h-0"
                          style={{
                            backgroundColor: accentColor,
                            borderRadius: currentRadiusValue,
                          }}
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Báo giá Zalo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: PRODUCT DETAIL PREVIEW */}
                {previewPage === "product" && (
                  <div
                    className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5"
                    style={{ borderRadius: currentRadiusValue }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div
                        className="h-28 sm:h-36 rounded-lg flex items-center justify-center font-extrabold text-xs border"
                        style={{ backgroundColor: primaryLight, color: primaryColor, borderRadius: currentRadiusValue }}
                      >
                        Ảnh Sản Phẩm
                      </div>
                      <div className="space-y-1">
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: primaryLight, color: primaryColor }}
                        >
                          Vật tư điện lạnh
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                          Block Nén Daikin 1HP Inverter
                        </h4>
                        <div className="font-black text-sm text-red-600">
                          1.850.000đ
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[9px] text-slate-400 font-bold block">Quy cách:</span>
                          <div className="flex items-center gap-1">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              1.0 HP
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              1.5 HP
                            </span>
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            className="w-full py-1.5 text-white font-black text-[11px] shadow-2xs cursor-pointer !min-h-0 flex items-center justify-center gap-1"
                            style={{ backgroundColor: accentColor, borderRadius: currentRadiusValue }}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Mua ngay</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 3: CHECKOUT PREVIEW */}
                {previewPage === "checkout" && (
                  <div
                    className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
                    style={{ borderRadius: currentRadiusValue }}
                  >
                    <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      <span>Giỏ Hàng (2 món)</span>
                    </h4>

                    <div className="space-y-1 border-y border-slate-100 dark:border-slate-800 py-1.5 text-[10px] sm:text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Ống đồng Thái Lan Ø6.35</span>
                        <span className="font-bold text-slate-900 dark:text-white">420.000đ</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Gas lạnh R32 Daikin 3kg</span>
                        <span className="font-bold text-slate-900 dark:text-white">990.000đ</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Tổng tiền:</span>
                      <span className="text-xs sm:text-sm font-black text-red-600">1.410.000đ</span>
                    </div>

                    <button
                      type="button"
                      className="w-full py-1.5 sm:py-2 text-white font-black text-xs shadow-2xs cursor-pointer !min-h-0 flex items-center justify-center gap-1"
                      style={{ backgroundColor: primaryColor, borderRadius: currentRadiusValue }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Đặt Hàng Ngay</span>
                    </button>
                  </div>
                )}

                {/* Floating Badges */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <div
                    className="w-7 h-7 rounded-full text-white shadow-2xs flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: "#0068FF" }}
                    title="Zalo"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className="w-7 h-7 rounded-full text-white shadow-2xs flex items-center justify-center animate-pulse cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                    title="Hotline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
