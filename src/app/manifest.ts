import type { MetadataRoute } from "next";
import { getCompanyInfo } from "../lib/company";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const company = await getCompanyInfo();

  return {
    name: company.fullName || company.name,
    short_name: company.shortName || company.brandName,
    description: `Nhà Phân Phối Vật Tư Điện Lạnh Chính Hãng ${company.city || "Đà Nẵng"}`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#075FA8",
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
