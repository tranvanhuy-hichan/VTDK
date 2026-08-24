import React from "react";
import { Phone, MapPin, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "../product/ImageCarousel";

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
        {/* Mobile Hero (Modern, Sleek, High-end) */}
        <div className="lg:hidden text-center flex flex-col items-center space-y-2">
          {/* Branded Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 text-[#075FA8] dark:text-blue-300 text-[11px] font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tổng Kho Vật Tư Điện Lạnh Đà Nẵng</span>
          </div>

          {/* Main Clean Headline */}
          <h1 className="text-2xl min-[380px]:text-[1.65rem] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Vật Tư Điện Lạnh <span className="text-[#075FA8] dark:text-blue-400">Đông Kha</span>
            <span className="block text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Phân Phối Sỉ &amp; Lẻ • Giá Tốt Cho Thợ
            </span>
          </h1>

          {/* Clean Subtitle */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
            Ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh &amp; máy giặt chính hãng. Báo giá nhanh, giao hàng hỏa tốc.
          </p>

          {/* 2 Quick CTA Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs pt-1">
            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#075FA8] hover:bg-[#0B1F33] text-white px-3 py-2.5 text-xs font-bold shadow-sm active:scale-98 !min-h-0 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Gọi báo giá</span>
            </a>
            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#075FA8] dark:text-blue-300 hover:bg-slate-50 px-3 py-2.5 text-xs font-bold shadow-2xs active:scale-98 !min-h-0 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Nhắn Zalo</span>
            </a>
          </div>

          {/* Carousel image banner */}
          <div className="relative mt-2 overflow-hidden rounded-2xl bg-slate-900 shadow-md ring-1 ring-slate-200 dark:ring-slate-800 w-full text-left">
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
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2 text-white shadow-lg backdrop-blur-md">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F47A20]">
                <MapPin className="h-4 w-4 fill-white" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-orange-200">Kho Hàng Đông Kha</span>
                <span className="block text-xs font-bold truncate">{company.address}</span>
              </div>
            </div>
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#075FA8] shadow-md">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F47A20]" /> Có sẵn tại kho
            </div>
          </div>

          {/* 3 Quick USPs */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 p-2.5 ring-1 ring-slate-200/80 dark:ring-slate-800 w-full text-center">
            {["Chính hãng 100%", "Giá sỉ cho thợ", "Tư vấn đúng mã"].map((item) => (
              <div key={item} className="flex flex-col sm:flex-row items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Hero Layout */}
        <div className="hidden items-center gap-8 lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-12">

          {/* Left Column (55% on desktop -> 6 cols) */}
          <div className="order-2 flex flex-col text-left lg:order-1 lg:col-span-6">

            {/* Small Corporate Intro Line */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-[#075FA8] dark:text-amber-400 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                CÔNG TY TNHH VẬT TƯ ĐÔNG KHA • ĐÀ NẴNG
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-[620px] text-[clamp(2.3rem,3vw,3.1rem)] font-black leading-[1.1] tracking-[-0.04em] text-slate-950 dark:text-white">
              Vật Tư Điện Lạnh
              <span className="mt-1 block text-[#075FA8] dark:text-blue-400">
                Đông Kha Đà Nẵng <span className="underline decoration-[#F47A20] underline-offset-8">– Sỉ &amp; Lẻ</span>
              </span>
              <span className="mt-1 block text-slate-900 dark:text-slate-100">Chính Hãng Giá Tốt</span>
            </h1>

            {/* Secondary Description */}
            <p className="mt-5 max-w-2xl text-base font-normal leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8 xl:text-xl">
              Chuyên sỉ &amp; lẻ ống đồng, linh kiện điều hòa – tủ lạnh – máy giặt cùng vật tư phục vụ điện lạnh dân dụng &amp; công nghiệp giá tốt nhất.
            </p>

            {/* Trust Badges Minimal */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nguồn gốc rõ ràng</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giá sỉ thợ &amp; công trình</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tư vấn đúng linh kiện</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${company.hotlineRaw}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075FA8] hover:bg-[#0B1F33] text-white px-6 py-3.5 text-sm font-extrabold shadow-lg shadow-blue-800/20 transition-all active:scale-[0.98] cursor-pointer !min-h-0"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Gọi Báo Giá: {company.hotline}</span>
              </a>
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-[#075FA8] dark:text-blue-300 border border-blue-200 dark:border-slate-700 px-6 py-3.5 text-sm font-extrabold shadow-sm transition-all active:scale-[0.98] cursor-pointer !min-h-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Nhắn Zalo Ngay</span>
              </a>
            </div>
          </div>

          {/* Right Column Carousel Showcase (6 cols) */}
          <div className="order-1 lg:order-2 lg:col-span-6 w-full">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="aspect-[4/3] w-full">
                <ImageCarousel
                  images={[company.image, ...company.images]}
                  alt="Cửa hàng Vật tư Điện lạnh Đông Kha tại Đà Nẵng"
                  className="h-full w-full"
                  priority
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/70 p-3 text-white shadow-lg backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F47A20]">
                  <MapPin className="h-5 w-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-orange-200">Kho Hàng Trực Tiếp</span>
                  <span className="block text-xs sm:text-sm font-extrabold truncate">{company.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
