import React from "react";
import "../index.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FloatingContact } from "../components/FloatingContact";

export const metadata = {
  title: "Công ty TNHH Vật Tư Đông Kha",
  description:
    "Chuyên sỉ và lẻ vật tư điện lạnh tại Đà Nẵng: Ống đồng, gas lạnh R32/R410A, linh kiện điều hòa, tủ lạnh, máy giặt. Thi công trọn gói hệ thống điện lạnh tại 400 Phạm Hùng, Hòa Xuân. Hotline: 0905 487 441.",
  keywords:
    "vật tư điện lạnh Đà Nẵng, vật tư điện lạnh Hòa Xuân, ống đồng Đà Nẵng, gas lạnh Đà Nẵng, linh kiện điều hòa Đà Nẵng, linh kiện tủ lạnh Đà Nẵng, linh kiện máy giặt Đà Nẵng, cửa hàng vật tư điện lạnh Đà Nẵng, Đông Kha Đà Nẵng",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
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
              "@id": "https://vattudienlanhdongkha.vn",
              "url": "https://vattudienlanhdongkha.vn",
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
      <body className="bg-[#F6F8FA] text-slate-800 antialiased selection:bg-[#075FA8] selection:text-white">
        <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-slate-800 antialiased font-sans">
          <Header />
          <main className="flex-1">{children}</main>
          <FloatingContact />
          <Footer />
        </div>
      </body>
    </html>
  );
}
