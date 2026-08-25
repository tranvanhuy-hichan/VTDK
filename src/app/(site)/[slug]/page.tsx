import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/lib/site";
import { SeoLandingPage, SeoLandingConfig } from "@/components/product/SeoLandingPage";

export const revalidate = 3600; // 1 hour ISR, revalidated on-demand via Server Actions

interface DynamicCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    const baseSlugs = categories.map((c) => ({ slug: c.slug }));
    const extraSlugs = [
      { slug: "vat-tu-dien-lanh" },
      { slug: "vat-tu-dien-lanh-da-nang" },
      ...categories.map((c) => ({ slug: `${c.slug}-da-nang` })),
      ...categories.map((c) => ({ slug: `${c.slug}-may-lanh-da-nang` })),
      ...categories.map((c) => ({ slug: `${c.slug}-dieu-hoa-da-nang` })),
    ];
    return [...baseSlugs, ...extraSlugs];
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

/**
 * Helper to match category by slug, accounting for optional local SEO suffixes (-da-nang, -may-lanh-da-nang)
 */
const resolveCategory = cache(async (rawSlug: string) => {
  const cleanSlug = rawSlug.toLowerCase().trim();

  if (cleanSlug === "vat-tu-dien-lanh-da-nang" || cleanSlug === "vat-tu-dien-lanh") {
    return {
      isGeneralStore: true,
      category: null,
    };
  }

  try {
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
  } catch (error) {
    console.warn("resolveCategory DB error:", error);
    return null;
  }
});

export async function generateMetadata({ params }: DynamicCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveCategory(slug);

  if (!resolved) {
    return {};
  }

  const company = await getCompanyInfo();
  const rawImage = company.image || "/images/storefront.png";
  const shareImage = rawImage.startsWith("http")
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  if (resolved.isGeneralStore) {
    const title = "Vật Tư Điện Lạnh Đà Nẵng | Đại Lý Sỉ & Lẻ Chính Hãng Giá Kho";
    const description = "Kho vật tư điện lạnh Đông Kha tại Đà Nẵng: sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt chính hãng. Hàng sẵn kho, giá tốt.";
    return {
      title,
      description,
      keywords: ["vật tư điện lạnh Đà Nẵng", "đại lý vật tư điện lạnh Đà Nẵng", "Đông Kha Đà Nẵng"],
      alternates: { canonical: `${SITE_URL}/${slug}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${slug}`,
        siteName: company.name,
        locale: "vi_VN",
        type: "website",
        images: [{ url: shareImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [shareImage],
      },
    };
  }

  const cat = resolved.category!;
  const title = cat.seoTitle || `${cat.name} Đà Nẵng | Đại Lý Sỉ & Lẻ Chính Hãng Giá Kho`;
  const description = cat.seoDesc || `Kho sỉ & lẻ ${cat.name.toLowerCase()} chính hãng tại Đà Nẵng (400 Phạm Hùng). Đầy đủ mẫu mã, giá sỉ ưu đãi thợ, hàng sẵn tại kho. Hotline: ${company.hotline}.`;

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
      canonical: `${SITE_URL}/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${slug}`,
      siteName: company.name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: shareImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
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
      description: "Đại lý phân phối vật tư & linh kiện điện lạnh giá sỉ tại Đà Nẵng. Hàng sẵn kho 400 Phạm Hùng, tư vấn kỹ thuật nhanh.",
      features: [
        "100% Hàng linh kiện chính hãng",
        "Giá sỉ trực tiếp cho thợ",
        "Hàng sẵn kho 400 Phạm Hùng",
        "Đầy đủ chứng chỉ CO/CQ",
      ],
      richContent: [
        {
          heading: "Đại Lý Vật Tư & Linh Kiện Điện Lạnh Uy Tín Hàng Đầu Tại Đà Nẵng",
          body: `Công ty TNHH Vật Tư Đông Kha tự hào là trung tâm phân phối sỉ & lẻ vật tư, linh kiện điện lạnh hàng đầu tại khu vực Đà Nẵng và miền Trung. Với địa điểm kho nằm tại mặt tiền số 400 Phạm Hùng (Hòa Xuân, Đà Nẵng), chúng tôi chuyên cung cấp phụ tùng linh kiện thay thế cho thợ sửa chữa, đại lý và tổ đội thi công công trình.`,
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
          q: "Cửa hàng có cho xem & thử linh kiện trực tiếp không?",
          a: "Có! Bạn có thể ghé trực tiếp kho cửa hàng Đông Kha tại 400 Phạm Hùng, Hòa Xuân, Đà Nẵng để kiểm tra, đối chiếu mã zin và thử bo mạch.",
        },
        {
          q: "Thợ sửa chữa mua linh kiện nhiều có được giá sỉ không?",
          a: "Đông Kha luôn áp dụng chính sách giá sỉ ưu đãi riêng cho anh em thợ điện lạnh và công ty thi công khi mua số lượng nhiều hoặc làm đối tác lâu dài.",
        },
      ],
    };

    const breadcrumbSchema = buildBreadcrumbSchema(config.title, slug);
    const faqSchema = buildFaqSchema(config.faqs);

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        )}
        <SeoLandingPage config={config} company={company} products={products} />
      </>
    );
  }

  // Category specific landing page
  const cat = resolved.category!;
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { categoryId: cat.id, active: true },
      include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Category products fetch DB error:", error);
  }

  // Ensure category title explicitly highlights "Linh Kiện" / "Vật Tư"
  const isComponentCat = cat.name.includes("Linh Kiện") || cat.name.includes("Vật Tư") || cat.name.includes("Ống Đồng") || cat.name.includes("Gas");
  const defaultH1 = isComponentCat 
    ? `${cat.name} Đà Nẵng – Sỉ & Lẻ Phụ Tùng Chính Hãng`
    : `Linh Kiện ${cat.name} Đà Nẵng – Sỉ & Lẻ Phụ Tùng Chính Hãng`;

  const config: SeoLandingConfig = {
    slug,
    title: isComponentCat ? cat.name : `Linh Kiện ${cat.name}`,
    h1: cat.seoH1 || defaultH1,
    subtitle: cat.seoDesc || `Kho sỉ & lẻ phụ tùng ${cat.name.toLowerCase()} chính hãng cho thợ & công trình tại Đà Nẵng. Hàng sẵn kho 400 Phạm Hùng, tư vấn kỹ thuật tận tâm.`,
    description: cat.seoDesc || `Mua linh kiện phụ tùng ${cat.name.toLowerCase()} giá rẻ uy tín tại Đà Nẵng.`,
    features: cat.features.length > 0 ? cat.features : [
      "100% Linh kiện chính hãng",
      "Giá sỉ ưu đãi thợ điện lạnh",
      "Thử bo mạch trực tiếp tại kho",
      "Đầy đủ chứng chỉ CO/CQ",
    ],
    richContent: [
      {
        heading: `Địa Chỉ Kho Phụ Tùng Linh Kiện ${cat.name} Uy Tín Tại Đà Nẵng`,
        body: cat.seoContent || `Cửa hàng Vật Tư Điện Lạnh Đông Kha tại số 400 Phạm Hùng (Hòa Xuân, Đà Nẵng) chuyên cung cấp sỉ & lẻ phụ tùng linh kiện ${cat.name.toLowerCase()} chuẩn chất lượng nhà máy, đáp ứng nhu cầu sửa chữa và thay thế của thợ kỹ thuật.`,
      },
    ],
    faqs: [
      {
        q: `Địa chỉ mua linh kiện ${cat.name} ở đâu tại Đà Nẵng?`,
        a: `Bạn có thể ghé trực tiếp kho cửa hàng Đông Kha tại 400 Phạm Hùng, Hòa Xuân, Đà Nẵng hoặc liên hệ Hotline/Zalo ${company.hotline} để được tư vấn báo giá.`,
      },
      {
        q: `Anh em thợ mua linh kiện ${cat.name} có được chiết khấu giá sỉ không?`,
        a: `Đông Kha luôn có chính sách chiết khấu tốt nhất cho thợ kỹ thuật, cửa hàng đại lý và nhà thầu cơ điện tại Đà Nẵng & miền Trung.`,
      },
    ],
  };

  const breadcrumbSchema = buildBreadcrumbSchema(config.title, slug);
  const faqSchema = buildFaqSchema(config.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <SeoLandingPage config={config} company={company} products={products} />
    </>
  );
}

function buildBreadcrumbSchema(title: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/${slug}` },
    ],
  };
}

function buildFaqSchema(faqs: SeoLandingConfig["faqs"]) {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
