import { prisma } from "../lib/prisma";
import { formatCompanyInfo, invalidateCompanyCache } from "../lib/company";
import { revalidateDomain } from "./cache.service";

function revalidateCompanyData() {
  invalidateCompanyCache();
  revalidateDomain(["company-info", "theme"]);
}

export async function getCompanyInfo() {
  const company = await prisma.companyInfo.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  return company ? formatCompanyInfo(company) : null;
}

export async function updateCompanyInfo(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || "Doanh Nghiệp Mới";
  const fullName = (formData.get("fullName") as string)?.trim() || name;
  const shortName = (formData.get("shortName") as string)?.trim() || name;
  const brandName = (formData.get("brandName") as string)?.trim() || name;
  const tagline = (formData.get("tagline") as string)?.trim() || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const address = (formData.get("address") as string)?.trim() || "";
  const hotline = (formData.get("hotline") as string)?.trim() || "";
  const hotlineRaw = (formData.get("hotlineRaw") as string)?.trim() || hotline;
  const zaloUrl = (formData.get("zaloUrl") as string)?.trim() || "";
  const whatsAppUrl = (formData.get("whatsAppUrl") as string)?.trim() || "";
  const facebookUrl = (formData.get("facebookUrl") as string)?.trim() || "";
  const googleMapsUrl = (formData.get("googleMapsUrl") as string)?.trim() || "";
  const googleMapsEmbed = (formData.get("googleMapsEmbed") as string)?.trim() || "";
  const workingHours = (formData.get("workingHours") as string)?.trim() || "07:30 - 18:00";

  const hasDelivery = formData.get("hasDelivery") === "true";
  const shippingFeeDanang = Math.max(0, parseInt(formData.get("shippingFeeDanang") as string) || 0);
  const shippingFeeProvince = Math.max(0, parseInt(formData.get("shippingFeeProvince") as string) || 0);
  const freeshipThreshold = Math.max(0, parseInt(formData.get("freeshipThreshold") as string) || 0);

  let freeshipProvinces: string[] = [];
  const rawFreeship = formData.get("freeshipProvinces") as string | null;
  if (rawFreeship) {
    try {
      const parsed = JSON.parse(rawFreeship);
      if (Array.isArray(parsed)) {
        freeshipProvinces = parsed.map(String).map((c) => c.trim()).filter(Boolean);
      }
    } catch {}
  }

  const shippingNote = (formData.get("shippingNote") as string)?.trim() || null;
  const enablePosModule = formData.get("enablePosModule") !== "false";

  const data: any = {
    name,
    fullName,
    shortName,
    brandName,
    tagline,
    city,
    address,
    hotline,
    hotlineRaw,
    zaloUrl,
    whatsAppUrl,
    facebookUrl,
    googleMapsUrl,
    googleMapsEmbed,
    workingHours,
    hasDelivery,
    shippingFeeDanang,
    shippingFeeProvince,
    freeshipThreshold,
    freeshipProvinces,
    shippingNote,
    enablePosModule,
  };

  const existing = await prisma.companyInfo.findFirst();
  let savedCompany;

  if (existing) {
    savedCompany = await prisma.companyInfo.update({
      where: { id: existing.id },
      data,
    });
  } else {
    savedCompany = await prisma.companyInfo.create({ data });
  }

  revalidateCompanyData();
  return formatCompanyInfo(savedCompany);
}

export async function updateCompanyShipping(input: {
  hasDelivery: boolean;
  shippingFeeDanang: number;
  shippingFeeProvince: number;
  freeshipThreshold: number;
  freeshipProvinces: string[];
  shippingNote?: string | null;
  enablePosModule?: boolean;
}) {
  const existing = await prisma.companyInfo.findFirst();
  if (!existing) {
    throw new Error("Không tìm thấy thông tin doanh nghiệp!");
  }

  const savedCompany = await prisma.companyInfo.update({
    where: { id: existing.id },
    data: {
      hasDelivery: Boolean(input.hasDelivery),
      shippingFeeDanang: Math.max(0, Math.trunc(Number(input.shippingFeeDanang) || 0)),
      shippingFeeProvince: Math.max(0, Math.trunc(Number(input.shippingFeeProvince) || 0)),
      freeshipThreshold: Math.max(0, Math.trunc(Number(input.freeshipThreshold) || 0)),
      freeshipProvinces: Array.isArray(input.freeshipProvinces)
        ? input.freeshipProvinces.map(String).map((c) => c.trim()).filter(Boolean)
        : [],
      shippingNote: input.shippingNote?.trim() || null,
      enablePosModule: input.enablePosModule !== false,
    },
  });

  revalidateCompanyData();
  return formatCompanyInfo(savedCompany);
}

export async function updateThemeSettings(themeData: {
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
}) {
  const existing = (await prisma.companyInfo.findFirst()) as any;
  const data = {
    primaryColor: themeData.primaryColor?.trim() || "#075FA8",
    primaryDark: themeData.primaryDark?.trim() || "#0B1F33",
    primaryLight: themeData.primaryLight?.trim() || "#EBF3FA",
    accentColor: themeData.accentColor?.trim() || "#F47A20",
    accentHover: themeData.accentHover?.trim() || "#E06912",
    fontFamily: themeData.fontFamily?.trim() || "Be Vietnam Pro",
    borderRadius: themeData.borderRadius?.trim() || "rounded-xl",
    headerStyle: themeData.headerStyle?.trim() || "standard",
    themePreset: themeData.themePreset?.trim() || "ocean-blue",
    customCss: themeData.customCss ? themeData.customCss.trim() : null,
    homepageSections: themeData.homepageSections ?? undefined,
  };

  if (existing) {
    await prisma.companyInfo.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.companyInfo.create({
      data: {
        name: "Doanh Nghiệp Mới",
        fullName: "Doanh Nghiệp Mới",
        shortName: "DOANH NGHIỆP",
        brandName: "Thương Hiệu",
        tagline: "Cung cấp sản phẩm chính hãng",
        city: "Việt Nam",
        address: "Địa chỉ doanh nghiệp",
        hotline: "0900000000",
        hotlineRaw: "0900000000",
        zaloUrl: "https://zalo.me/0900000000",
        whatsAppUrl: "https://wa.me/84900000000",
        facebookUrl: "",
        googleMapsUrl: "",
        googleMapsEmbed: "",
        workingHours: "07:30 - 18:00",
        ...data,
      },
    });
  }

  revalidateCompanyData();
}
