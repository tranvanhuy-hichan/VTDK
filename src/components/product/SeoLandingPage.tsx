"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, MessageSquare, MapPin, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, Home } from "lucide-react";
import type { CompanyContact } from "@/lib/company";
import { ProductCard } from "@/components/product/ProductCard";

import { Breadcrumb } from "@/components/common/Breadcrumb";

export interface SeoLandingConfig {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  description: string;
  categoryFilterSlugs?: string[];
  features: string[];
  richContent: {
    heading: string;
    body: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

interface SeoLandingPageProps {
  config: SeoLandingConfig;
  company: CompanyContact;
  products: any[];
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  config,
  company,
  products,
}) => {
  return (
    <div className="bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-12">
      {/* Hero Header Section - Compact Height */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-[#075FA8] to-[#0B1F33] text-white pt-0 pb-4 sm:pb-5">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Seamless Banner Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Sản phẩm", href: "/san-pham" },
              { label: config.title },
            ]}
            variant="banner"
          />
        </div>

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-400/40 text-orange-200 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
            <span>Kho Hàng Đông Kha • 400 Phạm Hùng, Đà Nẵng</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2 text-white max-w-4xl">
            {config.h1}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed mb-3 font-normal">
            {config.subtitle}
          </p>

          {/* Quick Feature Badges & Action Buttons in a Single Responsive Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {config.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
              <a
                href={`tel:${company.hotlineRaw}`}
                className="inline-flex items-center justify-center gap-1.5 bg-[#F47A20] hover:bg-orange-600 text-white text-xs sm:text-sm font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md transition-all active:scale-98 text-center"
              >
                <Phone className="w-3.5 h-3.5 fill-current shrink-0" />
                <span className="truncate">Báo Giá: {company.hotline}</span>
              </a>
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-white/95 hover:bg-white text-[#075FA8] text-xs sm:text-sm font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-all active:scale-98 text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#0068FF]" />
                <span>Nhắn Zalo</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8 sm:space-y-10">

        {/* Product Grid Catalog */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Danh Mục Sản Phẩm Có Sẵn Tại Kho ({products.length})
            </h2>
            <span className="self-start sm:self-auto text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Cập nhật mới nhất 2026
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} company={company} />
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Vui lòng liên hệ trực tiếp Hotline {company.hotline} để kiểm tra tồn kho mới nhất.
              </p>
            </div>
          )}
        </div>

        {/* Rich SEO Article Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-8 lg:p-10 shadow-sm space-y-6 text-left">
          {config.richContent.map((sec, idx) => (
            <div key={idx} className="space-y-2.5 sm:space-y-3">
              <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-l-4 border-[#075FA8] pl-2.5 sm:pl-3">
                {sec.heading}
              </h2>
              <div className="text-xs sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {sec.body}
              </div>
            </div>
          ))}

          {/* Local Store Guarantee Box */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#075FA8] dark:text-amber-400 font-extrabold text-xs sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Xem Hàng Trực Tiếp Tại Kho 400 Phạm Hùng, Đà Nẵng</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Đông Kha luôn sẵn kho số lượng lớn linh kiện &amp; vật tư điện lạnh. Anh em thợ có thể ghé cửa hàng đối chiếu mã zin và nhận báo giá sỉ tốt nhất.
              </p>
            </div>
            <a
              href={`tel:${company.hotlineRaw}`}
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Gọi Báo Giá Sỉ: {company.hotline}</span>
            </a>
          </div>
        </section>

        {/* FAQs Section */}
        {config.faqs.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <HelpCircle className="w-5 h-5 text-[#075FA8] dark:text-blue-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Câu Hỏi Thường Gặp (FAQ)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-start gap-2">
                    <span className="text-[#075FA8] dark:text-blue-400 font-black">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
