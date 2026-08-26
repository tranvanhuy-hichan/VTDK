export interface SectionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "hero" | "marketing" | "products" | "content" | "contact";
}

export const DEFAULT_HOMEPAGE_SECTIONS: SectionItem[] = [
  {
    id: "hero",
    name: "Banner Hero & Giới Thiệu",
    description: "Khối banner trượt mở đầu, khẩu hiệu và nút kêu gọi hành động (CTA).",
    enabled: true,
    category: "hero",
  },
  {
    id: "brands",
    name: "Thương Hiệu Đối Tác (Brand Slider)",
    description: "Dải logo các thương hiệu đối tác chính hãng (Daikin, Panasonic, LG...).",
    enabled: true,
    category: "marketing",
  },
  {
    id: "products",
    name: "Danh Mục & Sản Phẩm Nổi Bật",
    description: "Khối danh mục vật tư, bộ lọc tabs và lưới thẻ sản phẩm bán chạy.",
    enabled: true,
    category: "products",
  },
  {
    id: "customerTypes",
    name: "Đối Tượng Khách Hàng / Giải Pháp",
    description: "Phân loại giải pháp cho Thợ điện lạnh, Công trình, Đại lý và Khách lẻ.",
    enabled: true,
    category: "marketing",
  },
  {
    id: "services",
    name: "Dịch Vụ Kỹ Thuật & Lắp Đặt",
    description: "Bảng dịch vụ thi công, bảo trì, lắp đặt và sửa chữa tận nơi.",
    enabled: true,
    category: "content",
  },
  {
    id: "whyChooseUs",
    name: "Vì Sao Chọn Chúng Tôi (6 Cam Kết)",
    description: "Các lợi thế cạnh tranh: Hàng chính hãng, Giá sỉ, Giao hỏa tốc, Bảo hành.",
    enabled: true,
    category: "marketing",
  },
  {
    id: "gallery",
    name: "Kho Hàng & Hình Ảnh Thực Tế",
    description: "Bộ sưu tập hình ảnh thực tế kho bãi, quy trình đóng gói và hàng về kho.",
    enabled: true,
    category: "content",
  },
  {
    id: "location",
    name: "Bản Đồ & Vị Trí Kho Hàng",
    description: "Khung bản đồ Google Maps và thông tin liên hệ kho trực tiếp.",
    enabled: true,
    category: "contact",
  },
];

/**
 * Parse JSON string from database into ordered SectionItem list,
 * merging with defaults if new sections were added in the codebase.
 */
export function parseHomepageSections(rawJson?: string | null): SectionItem[] {
  if (!rawJson) {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }

  try {
    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) {
      return DEFAULT_HOMEPAGE_SECTIONS;
    }

    const defaultMap = new Map(DEFAULT_HOMEPAGE_SECTIONS.map((s) => [s.id, s]));
    const result: SectionItem[] = [];
    const seenIds = new Set<string>();

    // 1. Process configured items in order
    for (const item of parsed) {
      if (item && typeof item.id === "string" && defaultMap.has(item.id)) {
        const def = defaultMap.get(item.id)!;
        result.push({
          ...def,
          enabled: typeof item.enabled === "boolean" ? item.enabled : def.enabled,
        });
        seenIds.add(item.id);
      }
    }

    // 2. Append any missing default sections
    for (const def of DEFAULT_HOMEPAGE_SECTIONS) {
      if (!seenIds.has(def.id)) {
        result.push(def);
      }
    }

    return result;
  } catch {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

/**
 * Serialize SectionItem list to a compact JSON string for database storage
 */
export function stringifyHomepageSections(sections: SectionItem[]): string {
  const compact = sections.map((s) => ({
    id: s.id,
    enabled: s.enabled,
  }));
  return JSON.stringify(compact);
}
