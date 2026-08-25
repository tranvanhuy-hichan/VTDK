import React from "react";
import type { Metadata } from "next";
import { prisma } from "../../../lib/prisma";
import { getCompanyInfo } from "../../../lib/company";
import { SITE_URL } from "../../../lib/site";
import { SolutionsView } from "../../../components/solutions/SolutionsView";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = "Giải Pháp Kỹ Thuật & Thi Công Điện Lạnh Đà Nẵng";
  const description = `Tư vấn, cung cấp vật tư đồng bộ và hỗ trợ kỹ thuật thi công hệ thống điều hòa VRV/VRF, ống gió, kho lạnh tại ${company.name}. Hotline: ${company.hotline}.`;

  return {
    title,
    description,
    keywords: [
      "giải pháp kỹ thuật điện lạnh",
      "thi công điều hòa trung tâm Đà Nẵng",
      "lắp đặt kho lạnh Đà Nẵng",
      "ống gió điều hòa",
      company.name,
    ],
    alternates: {
      canonical: `${SITE_URL}/giai-phap`,
    },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: `${SITE_URL}/giai-phap`,
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function SolutionsPage() {
  const [company, dbServices] = await Promise.all([
    getCompanyInfo(),
    prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const formattedServices = dbServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    features: s.features,
    icon: s.icon,
    image: s.image,
    images: s.images || [],
  }));

  return <SolutionsView company={company} services={formattedServices} />;
}
