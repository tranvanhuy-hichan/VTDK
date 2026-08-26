import type { CompanyContact } from "./company";

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  primaryDark: string;
  primaryLight: string;
  accentColor: string;
  accentHover: string;
  fontFamily: string;
  borderRadius: string;
  badgeBg: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ocean-blue",
    name: "Xanh Đại Dương (Mặc định)",
    description: "Tông xanh biển tin cậy & cam nổi bật - Thích hợp điện lạnh, điện máy, kỹ thuật.",
    primaryColor: "#075FA8",
    primaryDark: "#0B1F33",
    primaryLight: "#EBF3FA",
    accentColor: "#F47A20",
    accentHover: "#E06912",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-blue-500",
  },
  {
    id: "emerald-green",
    name: "Xanh Ngọc Lục Bảo (Eco)",
    description: "Tông xanh lá thịnh vượng & vàng hổ phách - Thích hợp thực phẩm, nông sản, dược phẩm.",
    primaryColor: "#059669",
    primaryDark: "#064E3B",
    primaryLight: "#ECFDF5",
    accentColor: "#D97706",
    accentHover: "#B45309",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-emerald-500",
  },
  {
    id: "ruby-red",
    name: "Đỏ Ruby (Năng Động)",
    description: "Tông đỏ mạnh mẽ & cam lửa - Thích hợp cơ khí, công nghiệp, xây dựng, xe cộ.",
    primaryColor: "#DC2626",
    primaryDark: "#7F1D1D",
    primaryLight: "#FEF2F2",
    accentColor: "#EA580C",
    accentHover: "#C2410C",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-xl",
    badgeBg: "bg-red-500",
  },
  {
    id: "sunset-orange",
    name: "Cam Hoàng Hôn (Ấm Áp)",
    description: "Tông cam tươi trẻ & xanh navy - Thích hợp bán lẻ, thời trang, nội thất gia đình.",
    primaryColor: "#EA580C",
    primaryDark: "#1E293B",
    primaryLight: "#FFF7ED",
    accentColor: "#0284C7",
    accentHover: "#0369A1",
    fontFamily: "Be Vietnam Pro",
    borderRadius: "rounded-2xl",
    badgeBg: "bg-orange-500",
  },
  {
    id: "indigo-purple",
    name: "Tím Công Nghệ (Modern)",
    description: "Tông tím hiện đại & hồng neon - Thích hợp thiết bị số, phần mềm, giải pháp cao cấp.",
    primaryColor: "#7C3AED",
    primaryDark: "#2E1065",
    primaryLight: "#F5F3FF",
    accentColor: "#DB2777",
    accentHover: "#BE185D",
    fontFamily: "Inter",
    borderRadius: "rounded-2xl",
    badgeBg: "bg-purple-500",
  },
  {
    id: "charcoal-luxury",
    name: "Đen Than Sang Trọng (Luxury)",
    description: "Tông đen than huyền bí & vàng kim - Thích hợp thiết bị cao cấp, sang trọng tối giản.",
    primaryColor: "#18181B",
    primaryDark: "#09090B",
    primaryLight: "#F4F4F5",
    accentColor: "#CA8A04",
    accentHover: "#A16207",
    fontFamily: "Plus Jakarta Sans",
    borderRadius: "rounded-lg",
    badgeBg: "bg-zinc-800",
  },
];

export const FONT_OPTIONS = [
  { id: "Be Vietnam Pro", name: "Be Vietnam Pro (Chuẩn tiếng Việt, thanh lịch)", cssVar: "var(--font-be-vietnam-pro)" },
  { id: "Inter", name: "Inter (Hiện đại, tối giản, quốc tế)", cssVar: "var(--font-inter)" },
  { id: "Roboto", name: "Roboto (Cân đối, phổ biến, rõ nét)", cssVar: "var(--font-roboto, sans-serif)" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans (Đẳng cấp công nghệ)", cssVar: "var(--font-jakarta, sans-serif)" },
  { id: "Montserrat", name: "Montserrat (Đậm đà, thương hiệu cá tính)", cssVar: "var(--font-montserrat, sans-serif)" },
];

export const BORDER_RADIUS_OPTIONS = [
  { id: "sharp", name: "Vuông Vức (0px)", value: "0px" },
  { id: "rounded-md", name: "Bo Nhẹ (6px)", value: "0.375rem" },
  { id: "rounded-lg", name: "Bo Vừa (8px)", value: "0.5rem" },
  { id: "rounded-xl", name: "Bo Chuẩn (12px - Mặc định)", value: "0.75rem" },
  { id: "rounded-2xl", name: "Bo Tròn Mềm (16px)", value: "1rem" },
  { id: "rounded-3xl", name: "Bo Tròn Lớn (24px)", value: "1.5rem" },
];

export function getRadiusValue(borderRadiusId?: string): string {
  const match = BORDER_RADIUS_OPTIONS.find((b) => b.id === borderRadiusId);
  return match ? match.value : "0.75rem";
}

export function generateThemeCss(company: Partial<CompanyContact>): string {
  const primary = company.primaryColor || "#075FA8";
  const primaryDark = company.primaryDark || "#0B1F33";
  const primaryLight = company.primaryLight || "#EBF3FA";
  const accent = company.accentColor || "#F47A20";
  const accentHover = company.accentHover || "#E06912";
  const radius = getRadiusValue(company.borderRadius);

  return `
    :root {
      --color-primary: ${primary};
      --color-primary-dark: ${primaryDark};
      --color-primary-light: ${primaryLight};
      --color-accent: ${accent};
      --color-accent-hover: ${accentHover};
      --theme-border-radius: ${radius};
    }
    ::selection {
      background-color: ${primary};
      color: #ffffff;
    }
    ${company.customCss ? company.customCss : ""}
  `.trim();
}
