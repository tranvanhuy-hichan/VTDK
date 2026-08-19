import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/lib/site";
import { SeoLandingPage, SeoLandingConfig } from "@/components/SeoLandingPage";

interface DynamicCategoryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Helper to match category by slug, accounting for optional local SEO suffixes (-da-nang, -may-lanh-da-nang)
 */
async function resolveCategory(rawSlug: string) {
  const cleanSlug = rawSlug.toLowerCase().trim();

  if (cleanSlug === "vat-tu-dien-lanh-da-nang" || cleanSlug === "vat-tu-dien-lanh") {
    return {
      isGeneralStore: true,
      category: null,
    };
  }

  // 1. Try exact match first
  let category = await prisma.category.findUnique({
    where: { slug: cleanSlug },
  });

  // 2. Try stripping common Local SEO suffixes (e.g. "ong-dong-may-lanh-da-nang" -> "ong-dong")
  if (!category) {
    const candidates = [
      cleanSlug.replace(/-da-nang$/, ""),
      cleanSlug.replace(/-may-lanh-da-nang$/, ""),
      cleanSlug.replace(/-dieu-hoa-da-nang$/, ""),
    ];

    for (const candidate of candidates) {
      category = await prisma.category.findUnique({
        where: { slug: candidate },
      });
      if (category) break;
    }
  }

  // 3. Fallback: fuzzy match against existing category slugs
  if (!category) {
    const allCategories = await prisma.category.findMany();
    category =
      allCategories.find((cat) => {
        const catSlug = cat.slug.toLowerCase();
        return (
          cleanSlug.includes(catSlug) ||
          catSlug.includes(cleanSlug.replace(/-da-nang$/, ""))
        );
      }) || null;
  }

  if (!category) {
    return null;
  }

  return {
    isGeneralStore: false,
    category,
  };
}

export async function generateMetadata({ params }: DynamicCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveCategory(slug);

  if (!resolved) {
    return {};
  }

  const company = await getCompanyInfo();

  if (resolved.isGeneralStore) {
    const title = "Vật Tư Điện Lạnh Đà Nẵng | Đại Lý Sỉ & Lẻ Chính Hãng Giá Kho";
    const description = `Kho tổng Vật Tư Điện Lạnh Đông Kha tại Đà Nẵng (400 Phạm Hùng). Phân phối sỉ & lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt. Gọi báo giá: ${company.hotline}.`;
    return {
      title,
      description,
      keywords: ["vật tư điện lạnh Đà Nẵng", "đại lý vật tư điện lạnh Đà Nẵng", "Đông Kha Đà Nẵng"],
      alternates: { canonical: `/${slug}` },
      openGraph: { title, description, url: `${SITE_URL}/${slug}`, siteName: company.name, locale: "vi_VN", type: "website" },
    };
  }

  const cat = resolved.category!;
  const title = cat.seoTitle || `${cat.name} Đà Nẵng | Đại Lý Sỉ & Lẻ Chính Hãng Giá Kho`;
  const description = cat.seoDesc || `Kho sỉ & lẻ ${cat.name.toLowerCase()} chính hãng tại Đà Nẵng (400 Phạm Hùng). Đầy đủ mẫu mã, giá sỉ ưu đãi thợ, giao nhanh 30 phút. Hotline: ${company.hotline}.`;

  return {
    title,
    description,
    keywords: [
      cat.name,
      `${cat.name} Đà Nẵng`,
      `mua ${cat.name} Đà Nẵng`,
      `bảng giá ${cat.name}`,
      "vật tư điện lạnh Đà Nẵng",
    ],
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${slug}`,
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function DynamicCategorySEOPage({ params }: DynamicCategoryPageProps) {
  const { slug } = await params;
  const resolved = await resolveCategory(slug);

  if (!resolved) {
    notFound();
  }

  const company = await getCompanyInfo();

  // If General Store landing page
  if (resolved.isGeneralStore) {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 16,
    });

    const config: SeoLandingConfig = {
      slug,
      title: "Vật Tư & Linh Kiện Điện Lạnh Đà Nẵng",
      h1: "Vật Tư & Linh Kiện Điện Lạnh Đà Nẵng – Phân Phối Sỉ & Lẻ Cho Thợ",
      subtitle: "Chuyên sỉ & lẻ ống đồng, gas lạnh R32/R410A, bo mạch, block nén, phụ tùng linh kiện điều hòa, tủ lạnh, máy giặt sẵn kho 400 Phạm Hùng, Đà Nẵng.",
      description: "Đại lý phân phối vật tư & linh kiện điện lạnh giá sỉ tại Đà Nẵng. Hàng sẵn kho 400 Phạm Hùng, giao nhanh 30-60 phút.",
      features: [
        "100% Hàng linh kiện chính hãng",
        "Giá sỉ trực tiếp cho thợ",
        "Giao siêu tốc 30-60 phút tại ĐN",
        "Đầy đủ chứng chỉ CO/CQ",
      ],
      richContent: [
        {
          heading: "Đại Lý Vật Tư & Linh Kiện Điện Lạnh Uy Tín Hàng Đầu Tại Đà Nẵng",
          body: `Công ty TNHH Vật Tư Đông Kha tự hào là trung tâm phân phối sỉ & lẻ vật tư, linh kiện điện lạnh hàng đầu tại khu vực Đà Nẵng và miền Trung. Với địa điểm kho nằm tại mặt tiền số 400 Phạm Hùng (Hòa Xuân, Cẩm Lệ), chúng tôi chuyên cung cấp phụ tùng linh kiện thay thế cho thợ sửa chữa, đại lý và tổ đội thi công công trình.`,
        },
        {
          heading: "Danh Mục Phụ Tùng Linh Kiện Chủ Lực Tại Kho Đông Kha",
          body: `- Ống Đồng Máy Lạnh: Ống cuộn Thái Lan Luvata, Hailiang, Toàn Phát phi 6, 10, 12, 16, 19 cùng gen cách nhiệt Superlon.
- Gas Lạnh Nhập Khẩu: Gas R32 Chemours, R410A Honeywell, R134a, R22 tinh khiết > 99.9%.
- Linh Kiện Điều Hòa: Block máy nén Daikin, Panasonic, bo mạch Inverter, tụ quạt, remote đa năng.
- Linh Kiện Tủ Lạnh & Máy Giặt: Rơ le defrost, sò lạnh, van cấp nước, phao áp lực, dây curoa.`,
        },
      ],
      faqs: [
        {
          q: "Cửa hàng có giao linh kiện tận nhà / công trình tại Đà Nẵng không?",
          a: "Có! Đông Kha hỗ trợ giao linh kiện siêu tốc trong 30-60 phút tới tất cả các quận Cẩm Lệ, Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Liên Chiểu.",
        },
        {
          q: "Thợ sửa chữa mua linh kiện nhiều có được giá sỉ không?",
          a: "Đông Kha luôn áp dụng chính sách giá sỉ ưu đãi riêng cho anh em thợ điện lạnh và công ty thi công khi mua số lượng nhiều hoặc làm đối tác lâu dài.",
        },
      ],
    };

    return <SeoLandingPage config={config} company={company} products={products} />;
  }

  // Category specific landing page
  const cat = resolved.category!;
  const products = await prisma.product.findMany({
    where: { categoryId: cat.id, active: true },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  // Ensure category title explicitly highlights "Linh Kiện" / "Vật Tư"
  const isComponentCat = cat.name.includes("Linh Kiện") || cat.name.includes("Vật Tư") || cat.name.includes("Ống Đồng") || cat.name.includes("Gas");
  const defaultH1 = isComponentCat 
    ? `${cat.name} Đà Nẵng – Sỉ & Lẻ Phụ Tùng Chính Hãng`
    : `Linh Kiện ${cat.name} Đà Nẵng – Sỉ & Lẻ Phụ Tùng Chính Hãng`;

  const config: SeoLandingConfig = {
    slug,
    title: isComponentCat ? cat.name : `Linh Kiện ${cat.name}`,
    h1: cat.seoH1 || defaultH1,
    subtitle: cat.seoDesc || `Kho sỉ & lẻ phụ tùng ${cat.name.toLowerCase()} chính hãng cho thợ & công trình tại Đà Nẵng. Hàng sẵn kho 400 Phạm Hùng, giao nhanh 30-60 phút.`,
    description: cat.seoDesc || `Mua linh kiện phụ tùng ${cat.name.toLowerCase()} giá rẻ uy tín tại Đà Nẵng.`,
    features: cat.features.length > 0 ? cat.features : [
      "100% Linh kiện chính hãng",
      "Giá sỉ ưu đãi thợ điện lạnh",
      "Giao siêu tốc 30-60 phút tại ĐN",
      "Đầy đủ chứng chỉ CO/CQ",
    ],
    richContent: [
      {
        heading: `Địa Chỉ Kho Phụ Tùng Linh Kiện ${cat.name} Uy Tín Tại Đà Nẵng`,
        body: cat.seoContent || `Cửa hàng Vật Tư Điện Lạnh Đông Kha tại số 400 Phạm Hùng (Cẩm Lệ, Đà Nẵng) chuyên cung cấp sỉ & lẻ phụ tùng linh kiện ${cat.name.toLowerCase()} chuẩn chất lượng nhà máy, đáp ứng nhu cầu sửa chữa và thay thế của thợ kỹ thuật.`,
      },
    ],
    faqs: [
      {
        q: `Địa chỉ mua linh kiện ${cat.name} ở đâu tại Đà Nẵng?`,
        a: `Bạn có thể ghé trực tiếp kho cửa hàng Đông Kha tại 400 Phạm Hùng, Cẩm Lệ, Đà Nẵng hoặc liên hệ Hotline/Zalo ${company.hotline} để được giao hàng tận nơi.`,
      },
      {
        q: `Anh em thợ mua linh kiện ${cat.name} có được chiết khấu giá sỉ không?`,
        a: `Đông Kha luôn có chính sách chiết khấu tốt nhất cho thợ kỹ thuật, cửa hàng đại lý và nhà thầu cơ điện tại Đà Nẵng & miền Trung.`,
      },
    ],
  };

  return <SeoLandingPage config={config} company={company} products={products} />;
}
