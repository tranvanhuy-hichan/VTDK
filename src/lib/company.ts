import { prisma } from "./prisma";
import { COMPANY_DATA } from "../data/company";

export interface CompanyContact {
  name: string;
  address: string;
  hotline: string;
  hotlineRaw: string;
  zaloUrl: string;
  whatsAppUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  workingHours: string;
  image: string;
}

const FALLBACK: CompanyContact = {
  name: COMPANY_DATA.name,
  address: COMPANY_DATA.address,
  hotline: COMPANY_DATA.hotline,
  hotlineRaw: COMPANY_DATA.hotlineRaw,
  zaloUrl: COMPANY_DATA.zaloUrl,
  whatsAppUrl: COMPANY_DATA.whatsAppUrl,
  facebookUrl: COMPANY_DATA.facebookUrl,
  googleMapsUrl: COMPANY_DATA.googleMapsUrl,
  googleMapsEmbed: COMPANY_DATA.googleMapsEmbed,
  workingHours: COMPANY_DATA.workingHours,
  image: COMPANY_DATA.storefrontUrl,
};

export async function getCompanyInfo(): Promise<CompanyContact> {
  const info = await prisma.companyInfo.findFirst();
  return info ?? FALLBACK;
}
