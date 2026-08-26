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
  logoUrl: string;
  image: string;
  images: string[];
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
  hasDelivery: false,
  logoUrl: COMPANY_DATA.logoUrl,
  image: COMPANY_DATA.storefrontUrl,
  images: [],
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
};

const globalForCompany = globalThis as unknown as {
  __companyInfoBackup?: CompanyContact | null;
};

export function invalidateCompanyCache() {
  globalForCompany.__companyInfoBackup = null;
}

export const getCompanyInfo = unstable_cache(
  async (): Promise<CompanyContact> => {
    try {
      const info = (await prisma.companyInfo.findFirst()) as any;
      if (!info) {
        return globalForCompany.__companyInfoBackup || FALLBACK;
      }

      const formatted: CompanyContact = {
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
        hasDelivery: Boolean(info.hasDelivery),
        logoUrl: info.logoUrl || FALLBACK.logoUrl,
        image: info.image || FALLBACK.image,
        images: Array.isArray(info.images) ? info.images : [],
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
      };

      globalForCompany.__companyInfoBackup = formatted;
      return formatted;
    } catch (e) {
      console.warn("getCompanyInfo database query failed, using memory backup or fallback:", e);
      return globalForCompany.__companyInfoBackup || FALLBACK;
    }
  },
  ["company-info"],
  { revalidate: 300, tags: ["company-info"] }
);
