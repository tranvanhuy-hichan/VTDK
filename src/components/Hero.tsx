import React from "react";
import { Phone, MapPin, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";

interface HeroProps {
  company: CompanyContact;
}

export const Hero: React.FC<HeroProps> = ({ company }) => {
  return (
    <section id="trang-chu" className="relative isolate overflow-hidden bg-[#f7f9fc] pb-8 pt-4 transition-colors duration-300 dark:bg-slate-950 sm:pb-10 sm:pt-6 lg:pb-12 lg:pt-6 xl:pt-8">
      {/* Decorative Light Background Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-orange-100/40 dark:bg-orange-900/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <div className="mb-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#075FA8] dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            Công ty TNHH Vật tư Đông Kha
          </div>

          <h1 className="max-w-sm text-[1.7rem] font-extrabold leading-[1.12] tracking-[-0.04em] text-slate-950 dark:text-white min-[390px]:text-[1.95rem]">
            Giải pháp vật tư điện lạnh <span className="text-[#075FA8] dark:text-blue-400">đáng tin cậy.</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Chuyên ống đồng và linh kiện điện lạnh chính hãng — tư vấn đúng nhu cầu, báo giá nhanh.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <a href={`tel:${company.hotlineRaw}`} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#075FA8] px-3 py-3 text-xs font-extrabold text-white min-[390px]:text-sm shadow-lg shadow-blue-800/20 active:scale-[0.98]">
              <Phone className="h-4 w-4 fill-current" /> Gọi báo giá
            </a>
            <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-3 py-3 text-xs font-extrabold text-[#075FA8] min-[390px]:text-sm shadow-sm active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
              <MessageSquare className="h-4 w-4" /> Nhắn Zalo
            </a>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-[0_18px_45px_-18px_rgba(7,95,168,0.55)] ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="aspect-[16/10]">
              <ImageCarousel
                images={[company.image, ...company.images]}
                alt="Cửa hàng Vật tư Điện lạnh Đông Kha tại Đà Nẵng"
                className="h-full w-full"
                imgClassName="transition-transform duration-700"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2.5 text-white shadow-lg backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F47A20]">
                <MapPin className="h-4 w-4 fill-white" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-200">Cửa hàng Đông Kha</span>
                <span className="block text-xs font-extrabold">400 Phạm Hùng, Đà Nẵng</span>
              </div>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-extrabold text-[#075FA8] shadow-md">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F47A20]" /> Có sẵn tại kho
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5 rounded-2xl [&>div:last-child]:col-span-2 [&>div:last-child]:justify-center bg-white/75 p-3.5 ring-1 ring-slate-200/80 dark:bg-slate-900/70 dark:ring-slate-800">
            {["Nguồn gốc rõ ràng", "Giá sỉ cho thợ", "Tư vấn đúng mã"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs font-bold leading-4 text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> {item}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-8 lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-12">

          {/* Left Column (55% on desktop -> 7 cols) */}
          <div className="order-2 flex flex-col text-left lg:order-1 lg:col-span-6">

            {/* Small Corporate Intro Line */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-[#075FA8] dark:text-amber-400 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                CÔNG TY TNHH VẬT TƯ ĐÔNG KHA • ĐÀ NẴNG
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-[600px] text-[clamp(2.55rem,3.25vw,3.2rem)] font-black leading-[1.08] tracking-[-0.04em] text-slate-950 dark:text-white">
              Vật tư &amp; linh kiện
              <span className="mt-1 block text-[#075FA8] dark:text-blue-400">
                điện lạnh <span className="underline decoration-[#F47A20] underline-offset-8">đáng tin cậy</span>
              </span>
              <span className="mt-1 block">tại Đà Nẵng</span>
            </h1>

            {/* Secondary Description */}
            <p className="mt-5 max-w-2xl text-base font-normal leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8 xl:text-xl">
              Chuyên sỉ &amp; lẻ ống đồng, linh kiện điều hòa – tủ lạnh – máy giặt cùng giải pháp thi công điện lạnh dân dụng &amp; công nghiệp giá tốt nhất.
            </p>

            {/* CTAs Group: Contact & Zalo in 1 row on mobile */}
            <div className="mt-7 grid gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {/* Primary CTA: Call */}
              <a
                href={`tel:${company.hotlineRaw}`}
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#075FA8] px-6 py-3.5 text-center text-base font-extrabold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B1F33] hover:shadow-xl dark:hover:bg-[#075FA8]/80 sm:text-lg"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white shrink-0" />
                <span className="truncate">Gọi: {company.hotline}</span>
              </a>

              {/* Secondary CTA: Zalo */}
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border border-blue-200 bg-white px-6 py-3.5 text-center text-base font-extrabold text-[#075FA8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0068FF] hover:text-[#0068FF] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 sm:text-lg"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">Nhắn Zalo ngay</span>
              </a>
            </div>

            {/* Trust Points (4 items grid on mobile) */}
            <div className="pt-3.5 sm:pt-6 border-t border-slate-200/80 dark:border-slate-850 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100% Chính hãng</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sỉ &amp; lẻ giá kho</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Tư vấn kỹ thuật</span>
              </div>
            </div>

          </div>

          {/* Right Column (45% on desktop -> 5 cols) */}
          <div className="relative order-1 mx-auto w-full max-w-2xl lg:order-2 lg:col-span-6 lg:mt-0 lg:max-w-none">
            <div className="relative mx-auto max-w-lg lg:max-w-none">

              {/* Outer decorative border frame */}
              <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-[#075FA8] to-[#F47A20] rounded-2xl sm:rounded-3xl opacity-25 blur-md sm:blur-lg transform -rotate-1 group-hover:rotate-0 transition-transform" />

              {/* Main Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border-[5px] border-white bg-slate-900 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.55)] dark:border-slate-800 sm:aspect-[16/11] sm:rounded-[1.75rem] lg:aspect-[16/11] xl:aspect-[16/10]">
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
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#F47A20] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-600" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#075FA8] dark:text-amber-400 uppercase tracking-wide">Địa chỉ cửa hàng</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {company.address}
                    </span>
                  </div>
                </div>

                {/* Floating Badge Top Right: Support Hotline */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#075FA8] text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-md text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 border border-blue-400/30">
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
