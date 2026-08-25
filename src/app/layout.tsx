import React from "react";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "../index.css";
import { SITE_URL } from "../lib/site";
import { getCompanyInfo } from "../lib/company";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();

  const title = `${company.shortName || company.fullName} ${company.city || "Đà Nẵng"} | Sỉ & Lẻ Chính Hãng Giá Tốt`;
  const description = `Đại lý vật tư điện lạnh ${company.city || "Đà Nẵng"} - ${company.brandName}: sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt chính hãng. Hàng sẵn kho, giá tốt.`;
  
  const rawImage = company.image || "/images/storefront.png";
  const shareImage = rawImage.startsWith("http")
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: title,
      template: `%s | ${company.brandName}`,
    },

    description,

    keywords: [
      `vật tư điện lạnh ${company.city || "Đà Nẵng"}`,
      `vật tư điều hòa ${company.city || "Đà Nẵng"}`,
      "ống đồng điều hòa",
      "gas lạnh R32 R410A",
      `linh kiện điều hòa ${company.city || "Đà Nẵng"}`,
      `linh kiện tủ lạnh ${company.city || "Đà Nẵng"}`,
      `linh kiện máy giặt ${company.city || "Đà Nẵng"}`,
      `cửa hàng vật tư điện lạnh ${company.city || "Đà Nẵng"}`,
      company.brandName,
      company.shortName,
      "đại lý vật tư điện lạnh",
    ],

    authors: [{ name: company.fullName || company.name, url: SITE_URL }],
    creator: company.fullName || company.name,
    publisher: company.fullName || company.name,
    category: "Vật tư điện lạnh",

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    alternates: {
      canonical: "/",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/images/logo.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },

    manifest: "/manifest.webmanifest",

    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: company.fullName || company.name,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${company.fullName || company.name} - ${company.address}`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },

    verification: {
      google: "VuUoxkscuwFqN-g7nu1LiMRrDT7St2nw8x1VBbylh3E",
    },

    other: {
      "geo.region": "VN",
      "geo.placename": company.city || "Đà Nẵng",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyInfo();

  const logoUrl = company.logoUrl?.startsWith("http")
    ? company.logoUrl
    : `${SITE_URL}${company.logoUrl?.startsWith("/") ? "" : "/"}${company.logoUrl || "images/logo.png"}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.fullName || company.name,
        alternateName: [company.shortName, company.brandName, company.fullName].filter(Boolean),
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/san-pham?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": ["HVACBusiness", "Store", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: company.fullName || company.name,
        description: `Chuyên sỉ & lẻ vật tư điện lạnh, ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt uy tín tại ${company.city || "Đà Nẵng"}.`,
        image: company.image || "/images/storefront.png",
        logo: logoUrl,
        url: SITE_URL,
        telephone: company.hotlineRaw,
        hasMap: company.googleMapsUrl,
        priceRange: "$$",
        currenciesAccepted: "VND",
        paymentAccepted: "Cash, Bank Transfer",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: company.hotlineRaw,
          contactType: "sales & technical support",
          areaServed: "VN",
          availableLanguage: ["Vietnamese"],
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: company.city || "Đà Nẵng",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: company.address,
          addressLocality: `TP ${company.city || "Đà Nẵng"}`,
          addressRegion: company.city || "Đà Nẵng",
          postalCode: "550000",
          addressCountry: "VN",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "07:00",
          closes: "18:30",
        },
        sameAs: [
          company.zaloUrl,
          company.facebookUrl,
        ].filter(Boolean),
      },
    ],
  };

  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      <body className="bg-[#F6F8FA] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 antialiased selection:bg-[#075FA8] selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
