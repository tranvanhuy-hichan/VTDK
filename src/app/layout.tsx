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

  const title = `${company.name} | Hotline: ${company.hotline}`;
  const description = `Nhà Phân Phối Vật Tư Điện Lạnh Chính Hãng Đà Nẵng - Chuyên sỉ & lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt tại ${company.address}. Hotline: ${company.hotline}.`;
  
  const rawImage = company.image || "/images/storefront.png";
  const shareImage = rawImage.startsWith("http")
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: title,
      template: "%s | Đông Kha",
    },

    description,

    keywords: [
      "vật tư điện lạnh Đà Nẵng",
      "vật tư điều hòa Đà Nẵng",
      "ống đồng điều hòa",
      "gas lạnh R32 R410A",
      "linh kiện điều hòa Đà Nẵng",
      "linh kiện tủ lạnh Đà Nẵng",
      "linh kiện máy giặt Đà Nẵng",
      "cửa hàng vật tư điện lạnh Đà Nẵng",
      "Đông Kha",
      "đại lý vật tư điện lạnh",
    ],

    authors: [{ name: company.name, url: SITE_URL }],
    creator: company.name,
    publisher: company.name,
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
      icon: [{ url: "/icon", sizes: "64x64", type: "image/png" }],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },

    manifest: "/manifest.webmanifest",

    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: company.name,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${company.name} - ${company.address}`,
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
      google: "hJVVfzb5gzb7XvuRBsk_vwtEsJMMs2itfryzF6gx9rM",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyInfo();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["HVACBusiness", "Store", "LocalBusiness"],
    name: company.name,
    description: `Chuyên sỉ & lẻ vật tư điện lạnh, ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt uy tín tại Đà Nẵng.`,
    image: company.image || "/images/storefront.png",
    logo: `${SITE_URL}/images/logo.png`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: company.hotlineRaw,
    priceRange: "$$",
    currenciesAccepted: "VND",
    paymentAccepted: "Cash, Bank Transfer",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Đà Nẵng",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: "TP Đà Nẵng",
      addressRegion: "Đà Nẵng",
      postalCode: "550000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 16.024567,
      longitude: 108.204561,
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
