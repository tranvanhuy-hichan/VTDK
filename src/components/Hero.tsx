import React from "react";
import { Phone, MapPin, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";

interface HeroProps {
  company: CompanyContact;
}

export const Hero: React.FC<HeroProps> = ({ company }) => {
  return (
    <section id="trang-chu" className="relative bg-gradient-to-b from-slate-50 via-white to-[#F6F8FA] dark:from-slate-900 dark:via-slate-950 dark:to-[#0F172A] pt-6 sm:pt-16 lg:pt-20 pb-8 sm:pb-20 overflow-hidden transition-colors duration-300">
      {/* Decorative Light Background Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-orange-100/40 dark:bg-orange-900/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column (55% on desktop -> 7 cols) */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Small Corporate Intro Line */}
            <span className="text-[11px] sm:text-sm font-extrabold text-[#075FA8] dark:text-amber-400 tracking-widest uppercase mb-2 sm:mb-4 block">
              Công ty TNHH Vật Tư Đông Kha
            </span>
            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-[1.18] mb-2.5 sm:mb-6">
              Giải pháp vật tư điện lạnh{" "}
              <span className="text-[#075FA8] dark:text-blue-400 underline decoration-[#F47A20] underline-offset-4 sm:underline-offset-8">
                đáng tin cậy
              </span>{" "}
              tại Đà Nẵng
            </h1>

            {/* Secondary Description */}
            <p className="text-xs sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-4 sm:mb-8 max-w-2xl">
              Chuyên sỉ &amp; lẻ ống đồng, gas lạnh, linh kiện điều hòa – tủ lạnh – máy giặt cùng giải pháp thi công điện lạnh dân dụng và công nghiệp.
            </p>

            {/* CTAs Group */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 mb-5 sm:mb-10">
              {/* Primary CTA: Call */}
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex items-center justify-center gap-2.5 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-[#075FA8]/80 text-white font-bold text-sm sm:text-lg px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-xl transition-all duration-300"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white" />
                <span>Gọi tư vấn: {company.hotline}</span>
              </a>

              {/* Secondary CTA: Zalo */}
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-base px-4 py-2.5 sm:px-5 sm:py-4 rounded-xl shadow-md transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nhắn Zalo ngay</span>
              </a>

              {/* Tertiary CTA: Address Link */}
              <a
                href="#dia-chi"
                className="inline-flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-amber-400 font-bold text-xs sm:text-base px-3 py-2 sm:px-4 sm:py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-center"
              >
                <span>Xem địa chỉ</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>

            {/* Trust Points (3 items) */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 dark:border-slate-850 grid grid-cols-3 gap-1.5 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-200 font-semibold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-455 shrink-0" />
                <span>Sỉ &amp; lẻ giá tốt</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-200 font-semibold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-455 shrink-0" />
                <span>Tư vấn kỹ thuật</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 dark:text-slate-200 font-semibold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-455 shrink-0" />
                <span>Giao hàng nhanh</span>
              </div>
            </div>

          </div>

          {/* Right Column (45% on desktop -> 5 cols) */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative border frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#075FA8] to-[#F47A20] rounded-3xl opacity-25 blur-lg transform -rotate-1 group-hover:rotate-0 transition-transform" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-900 aspect-[16/10] sm:aspect-[16/11]">
                <ImageCarousel
                  images={[company.image, ...company.images]}
                  alt="Mặt tiền cửa hàng Vật Tư Điện Lạnh Đông Kha tại 400 Phạm Hùng Đà Nẵng"
                  className="w-full h-full"
                  imgClassName="hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge Bottom Left: Address */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#F47A20] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-600" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[10px] font-bold text-[#075FA8] dark:text-amber-400 uppercase tracking-wide">Địa chỉ cửa hàng</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {company.address}
                    </span>
                  </div>
                </div>

                {/* Floating Badge Top Right: Support Hotline */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#075FA8] text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-md text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 border border-blue-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span>Sỉ &amp; Lẻ Sẵn Kho</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
