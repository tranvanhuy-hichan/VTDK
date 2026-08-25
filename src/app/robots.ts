import { MetadataRoute } from "next";
import { COMPANY_DATA } from "@/data/company";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    COMPANY_DATA.siteUrl ||
    "https://vattudongkha.io.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/admin/*",
          "/tai-khoan",
          "/tai-khoan/*",
          "/dang-nhap",
          "/dang-ky",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
