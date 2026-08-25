import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "../../../lib/company";
import { SITE_URL } from "../../../lib/site";
import { ContactView } from "../../../components/contact/ContactView";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = `Liên Hệ ${company.name} - Tổng Kho Vật Tư Điện Lạnh Đà Nẵng`;
  const description = `Địa chỉ: ${company.address}. Hotline: ${company.hotline}. Zalo: ${company.hotline}. Phân phối sỉ lẻ vật tư, linh kiện điện lạnh chính hãng tại Đà Nẵng.`;

  return {
    title,
    description,
    keywords: [
      "liên hệ vật tư điện lạnh Đông Kha",
      "địa chỉ kho vật tư điện lạnh Đà Nẵng",
      "hotline vật tư điện lạnh Đà Nẵng",
      company.name,
    ],
    alternates: {
      canonical: `${SITE_URL}/lien-he`,
    },
    openGraph: {
      title: `${title}`,
      description,
      url: `${SITE_URL}/lien-he`,
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const company = await getCompanyInfo();
  return <ContactView company={company} />;
}
