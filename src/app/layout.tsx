import React from "react";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "../index.css";
import { SITE_URL } from "../lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Vật Tư Điện Lạnh Đông Kha | Hotline 0905 487 441",
    template: "%s | Đông Kha",
  },

  description:
    "Nhà Phân Phối Vật Tư Điện Lạnh Chính Hãng Đà Nẵng - Chuyên sỉ & lẻ ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt. Hotline: 0905 487 441.",

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
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Vật Tư Điện Lạnh Đông Kha | Hotline: 0905 487 441",
    description:
      "Nhà Phân Phối Vật Tư Điện Lạnh Chính Hãng Đà Nẵng - Chuyên sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa - tủ lạnh - máy giặt tại 400 Phạm Hùng. Hotline: 0905 487 441.",
    url: SITE_URL,
    siteName: "Vật Tư Điện Lạnh Đông Kha",
    images: [
      {
        url: "/images/storefront.png",
        width: 1200,
        height: 630,
        alt: "Vật Tư Điện Lạnh Đông Kha Đà Nẵng - 400 Phạm Hùng",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vật Tư Điện Lạnh Đông Kha | Hotline: 0905 487 441",
    description:
      "Nhà Phân Phối Vật Tư Điện Lạnh Chính Hãng Đà Nẵng - Hotline: 0905 487 441.",
    images: ["/images/storefront.png"],
  },

  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },

  verification: {
    google: "hJVVfzb5gzb7XvuRBsk_vwtEsJMMs2itfryzF6gx9rM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              "name": "Công ty TNHH Vật Tư Đông Kha",
              "image": "/images/storefront.png",
              "logo": "/images/logo.png",
              "@id": SITE_URL,
              "url": SITE_URL,
              "telephone": "0905487441",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "400 Phạm Hùng, Phường Hòa Xuân",
                "addressLocality": "TP Đà Nẵng",
                "addressRegion": "Đà Nẵng",
                "postalCode": "550000",
                "addressCountry": "VN",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 16.024567,
                "longitude": 108.204561,
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                "opens": "07:00",
                "closes": "18:30",
              },
              "sameAs": [
                "https://zalo.me/0905487441",
                "https://www.facebook.com/vattudienlanhdongkha",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#F6F8FA] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 antialiased selection:bg-[#075FA8] selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
