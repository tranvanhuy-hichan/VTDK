import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { COMPANY_DATA } from "../data/company";

export { COMPANY_DATA };

export interface CompanyContact {
  id?: string;
  name: string;
  fullName: string;
  shortName: string;
  brandName: string;
  tagline: string;
  city: string;
  address: string;
  hotline: string;
  hotlineRaw: string;
  email?: string | null;
  taxCode?: string | null;
  zaloUrl: string;
  whatsAppUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  workingHours: string;
  hasDelivery: boolean;
  shippingFeeDanang: number;
  shippingFeeProvince: number;
  freeshipThreshold: number;
  freeshipProvinces?: string[];
  shippingNote?: string | null;
  logoUrl: string;
  image: string;
  images: string[];
  // POS Module Setting
  enablePosModule?: boolean;
  // Theme & Styling Customization
  primaryColor?: string;
  primaryDark?: string;
  primaryLight?: string;
  accentColor?: string;
  accentHover?: string;
  fontFamily?: string;
  borderRadius?: string;
  headerStyle?: string;
  themePreset?: string;
  customCss?: string | null;
  homepageSections?: string | null;
}

const FALLBACK: CompanyContact = {
  name: COMPANY_DATA.fullName,
  fullName: COMPANY_DATA.fullName,
  shortName: COMPANY_DATA.shortName,
  brandName: COMPANY_DATA.brandName,
  tagline: COMPANY_DATA.tagline,
  city: COMPANY_DATA.city,
  address: COMPANY_DATA.address,
  hotline: COMPANY_DATA.hotline,
  hotlineRaw: COMPANY_DATA.hotlineRaw,
  email: COMPANY_DATA.email,
  taxCode: COMPANY_DATA.taxCode,
  zaloUrl: COMPANY_DATA.zaloUrl,
  whatsAppUrl: COMPANY_DATA.whatsAppUrl,
  facebookUrl: COMPANY_DATA.facebookUrl,
  googleMapsUrl: COMPANY_DATA.googleMapsUrl,
  googleMapsEmbed: COMPANY_DATA.googleMapsEmbed,
  workingHours: COMPANY_DATA.workingHours,
  hasDelivery: true,
  shippingFeeDanang: 30000,
  shippingFeeProvince: 50000,
  freeshipThreshold: 2000000,
  freeshipProvinces: ["ALL"],
  shippingNote:
    "Miễn phí giao hàng toàn quốc cho đơn từ 2.000.000đ. Đơn dưới 2.000.000đ áp dụng cước chuẩn: Đà Nẵng 30.000đ, tỉnh khác 50.000đ.",
  logoUrl: COMPANY_DATA.logoUrl,
  image: COMPANY_DATA.storefrontUrl,
  images: [],
  enablePosModule: true,
  primaryColor: "#075FA8",
  primaryDark: "#0B1F33",
  primaryLight: "#EBF3FA",
  accentColor: "#F47A20",
  accentHover: "#E06912",
  fontFamily: "Be Vietnam Pro",
  borderRadius: "rounded-xl",
  headerStyle: "standard",
  themePreset: "ocean-blue",
  customCss: null,
  homepageSections: null,
};

const globalForCompany = globalThis as unknown as {
  __companyInfoBackup?: CompanyContact | null;
};

export function invalidateCompanyCache() {
  globalForCompany.__companyInfoBackup = null;
}

export function formatCompanyInfo(info: any): CompanyContact {
  return {
    id: info.id,
    name: info.fullName || info.name || FALLBACK.fullName,
    fullName: info.fullName || info.name || FALLBACK.fullName,
    shortName: info.shortName || FALLBACK.shortName,
    brandName: info.brandName || FALLBACK.brandName,
    tagline: info.tagline || FALLBACK.tagline,
    city: info.city || FALLBACK.city,
    address: info.address || FALLBACK.address,
    hotline: info.hotline || FALLBACK.hotline,
    hotlineRaw: info.hotlineRaw || FALLBACK.hotlineRaw,
    email: info.email ?? FALLBACK.email,
    taxCode: info.taxCode ?? FALLBACK.taxCode,
    zaloUrl: info.zaloUrl || FALLBACK.zaloUrl,
    whatsAppUrl: info.whatsAppUrl || FALLBACK.whatsAppUrl,
    facebookUrl: info.facebookUrl || FALLBACK.facebookUrl,
    googleMapsUrl: info.googleMapsUrl || FALLBACK.googleMapsUrl,
    googleMapsEmbed: info.googleMapsEmbed || FALLBACK.googleMapsEmbed,
    workingHours: info.workingHours || FALLBACK.workingHours,
    hasDelivery: typeof info.hasDelivery === "boolean" ? info.hasDelivery : true,
    shippingFeeDanang:
      typeof info.shippingFeeDanang === "number"
        ? info.shippingFeeDanang
        : FALLBACK.shippingFeeDanang,
    shippingFeeProvince:
      typeof info.shippingFeeProvince === "number"
        ? info.shippingFeeProvince
        : FALLBACK.shippingFeeProvince,
    freeshipThreshold:
      typeof info.freeshipThreshold === "number"
        ? info.freeshipThreshold
        : FALLBACK.freeshipThreshold,
    freeshipProvinces:
      Array.isArray(info.freeshipProvinces)
        ? info.freeshipProvinces
        : FALLBACK.freeshipProvinces,
    shippingNote: info.shippingNote ?? FALLBACK.shippingNote,
    logoUrl: info.logoUrl || FALLBACK.logoUrl,
    image: info.image || FALLBACK.image,
    images: Array.isArray(info.images) ? info.images : [],
    enablePosModule: typeof info.enablePosModule === "boolean" ? info.enablePosModule : true,
    primaryColor: info.primaryColor || FALLBACK.primaryColor,
    primaryDark: info.primaryDark || FALLBACK.primaryDark,
    primaryLight: info.primaryLight || FALLBACK.primaryLight,
    accentColor: info.accentColor || FALLBACK.accentColor,
    accentHover: info.accentHover || FALLBACK.accentHover,
    fontFamily: info.fontFamily || FALLBACK.fontFamily,
    borderRadius: info.borderRadius || FALLBACK.borderRadius,
    headerStyle: info.headerStyle || FALLBACK.headerStyle,
    themePreset: info.themePreset || FALLBACK.themePreset,
    customCss: info.customCss ?? FALLBACK.customCss,
    homepageSections: info.homepageSections ?? FALLBACK.homepageSections,
  };
}

export async function getFreshCompanyInfo(): Promise<CompanyContact> {
  try {
    const info = (await prisma.companyInfo.findFirst()) as any;
    if (!info) {
      return globalForCompany.__companyInfoBackup || FALLBACK;
    }
    const formatted = formatCompanyInfo(info);
    globalForCompany.__companyInfoBackup = formatted;
    return formatted;
  } catch (e) {
    console.warn("getFreshCompanyInfo database query failed, using fallback:", e);
    return globalForCompany.__companyInfoBackup || FALLBACK;
  }
}

const getCachedCompanyInfo = unstable_cache(
  async (): Promise<CompanyContact> => getFreshCompanyInfo(),
  ["company-info"],
  { revalidate: 300, tags: ["company-info"] }
);

/**
 * Keep the cache boundary defensive. A stale deployment cache may contain an
 * empty value even though TypeScript declares a CompanyContact return type.
 * Normalizing here prevents pages from dereferencing fields on undefined.
 */
export async function getCompanyInfo(): Promise<CompanyContact> {
  try {
    const info = await getCachedCompanyInfo();

    if (!info || typeof info !== "object") {
      return globalForCompany.__companyInfoBackup || FALLBACK;
    }

    return formatCompanyInfo(info);
  } catch (e) {
    console.warn("getCompanyInfo cache read failed, using fallback:", e);
    return globalForCompany.__companyInfoBackup || FALLBACK;
  }
}
