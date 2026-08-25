"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Fan,
  Wind,
  ThermometerSun,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Wrench,
  Sparkles,
  Truck,
  FileCheck,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "../product/ImageCarousel";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  images: string[];
}

interface SolutionsViewProps {
  company: CompanyContact;
  services: ServiceItem[];
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ company, services }) => {
  const getServiceIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 sm:w-7 sm:h-7";
    switch (iconName) {
      case "Building2":
        return <Building2 className={`${iconClass} text-[#075FA8]`} />;
      case "Fan":
        return <Fan className={`${iconClass} text-sky-600 animate-spin-slow`} />;
      case "Wind":
        return <Wind className={`${iconClass} text-[#F47A20]`} />;
      default:
        return <ThermometerSun className={`${iconClass} text-amber-500`} />;
    }
  };

  return (
    <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-16">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] text-white py-6 sm:py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-blue-200 border border-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-amber-300" />
            <span>KỸ THUẬT &amp; THI CÔNG CHUYÊN NGHIỆP</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Giải Pháp Kỹ Thuật Điện Lạnh Toàn Diện
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto font-medium">
            Tư vấn, cung cấp vật tư đồng bộ và hỗ trợ thi công cho công trình dân dụng, tòa nhà &amp; nhà xưởng tại Đà Nẵng.
          </p>
        </div>
      </section>

      {/* 2. Main Content Services List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {services.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 text-slate-400">
            <p className="text-sm font-medium">Dữ liệu giải pháp kỹ thuật đang được cập nhật.</p>
          </div>
        ) : (
          services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Col */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                    <ImageCarousel
                      images={[service.image, ...service.images]}
                      alt={service.title}
                      className="w-full h-full"
                      imgClassName="hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs text-[10px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chuẩn kỹ thuật CO/CQ</span>
                    </div>
                  </div>
                </div>

                {/* Content Col */}
                <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"} space-y-3`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-100 dark:border-blue-900/60 shrink-0">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#F47A20] uppercase tracking-wider block">
                        Giải Pháp #{index + 1}
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullet features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-1">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-2.5 pt-2 flex-wrap sm:flex-nowrap">
                    <a
                      href={`tel:${company.hotlineRaw}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-black px-4 py-2.5 rounded-xl shadow-xs transition-colors text-xs cursor-pointer !min-h-0"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>Tư vấn kỹ thuật: {company.hotline}</span>
                    </a>

                    <a
                      href={company.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl shadow-2xs transition-colors text-xs cursor-pointer !min-h-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                      <span>Nhắn Zalo công trình</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Bottom Trust Guarantee */}
        <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs text-[#075FA8] shrink-0">
              <FileCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">CO / CQ Đầy Đủ</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">100% chứng chỉ xuất xưởng</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs text-amber-500 shrink-0">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Giao Hỏa Tốc</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Nội thành Đà Nẵng 1 - 2h</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs text-emerald-600 shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Chiết Khấu Thợ &amp; Dự Án</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Chính sách giá đại lý tốt nhất</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
