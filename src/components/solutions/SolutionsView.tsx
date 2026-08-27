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
  Wrench,
  Sparkles,
  Truck,
  FileCheck,
  Headphones,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "../product/ImageCarousel";
import { Breadcrumb } from "../common/Breadcrumb";
import { Pagination } from "../product/Pagination";

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

const PAGE_SIZE = 6;

export const SolutionsView: React.FC<SolutionsViewProps> = ({ company, services }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const pagedServices = services.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const getServiceIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 sm:w-7 sm:h-7";
    switch (iconName) {
      case "Building2":
        return <Building2 className={`${iconClass} text-[#075FA8] dark:text-blue-400`} />;
      case "Fan":
        return <Fan className={`${iconClass} text-sky-600 dark:text-sky-400 animate-spin-slow`} />;
      case "Wind":
        return <Wind className={`${iconClass} text-[#F47A20] dark:text-orange-400`} />;
      default:
        return <ThermometerSun className={`${iconClass} text-amber-500 dark:text-amber-400`} />;
    }
  };

  return (
    <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-16">
      {/* 1. Sleek Compact Header (Không chiếm diện tích) */}
      <section className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] text-white pt-0 pb-5 sm:pb-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto">
          {/* Seamless Banner Breadcrumb */}
          <Breadcrumb items={[{ label: "Giải pháp kỹ thuật" }]} variant="banner" />
        </div>

        <div className="max-w-4xl mx-auto space-y-2 text-center pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-blue-100 border border-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-amber-300" />
            <span>KỸ THUẬT &amp; THI CÔNG CHUYÊN NGHIỆP</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Giải Pháp Kỹ Thuật Điện Lạnh Toàn Diện
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto font-medium">
            Tư vấn thiết kế, cung cấp vật tư đồng bộ và hỗ trợ kỹ thuật thi công cho công trình dân dụng, tòa nhà &amp; nhà xưởng tại Đà Nẵng.
          </p>

          {/* Quick Badges in Header */}
          <div className="pt-1.5 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-blue-100">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Chuẩn CO/CQ</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Giao tận công trình 1 - 2h</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Headphones className="w-4 h-4 text-cyan-300" />
              <span>Báo giá sỉ cho thợ</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Services List - Nổi Bật & Tương Phản Cao */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {services.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 text-slate-400">
            <p className="text-sm font-medium">Dữ liệu giải pháp kỹ thuật đang được cập nhật.</p>
          </div>
        ) : (
          pagedServices.map((service, index) => {
            const isEven = index % 2 === 0;
            const itemNumber = ((currentPage - 1) * PAGE_SIZE + index + 1).toString().padStart(2, "0");

            return (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 hover:border-[#075FA8] dark:hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
              >
                {/* Accent Top Glowing Line */}
                <div className="h-1 w-full bg-gradient-to-r from-[#075FA8] via-cyan-400 to-[#F47A20]" />

                <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Image Col */}
                  <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <ImageCarousel
                        images={[service.image, ...service.images]}
                        alt={service.title}
                        className="w-full h-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-[10px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kỹ thuật 100% CO/CQ</span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                        {1 + service.images.length} hình ảnh
                      </div>
                    </div>
                  </div>

                  {/* Content Col */}
                  <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"} space-y-3.5 text-left`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black bg-[#075FA8] text-white px-2.5 py-1 rounded-lg shadow-xs">
                        HẠNG MỤC #{itemNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã triển khai thực tế</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center border border-blue-100 dark:border-blue-900/60 shrink-0 mt-0.5 shadow-2xs">
                        {getServiceIcon(service.icon)}
                      </div>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {service.description}
                    </p>

                    {/* Bullet features pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pb-1">
                      {service.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTAs (Cân bằng kích thước, ngắn gọn trên Mobile) */}
                    <div className="grid grid-cols-2 sm:flex items-center gap-2.5 pt-2">
                      <a
                        href={`tel:${company.hotlineRaw}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#064B85] text-white font-bold px-3.5 sm:px-5 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer !min-h-0 active:scale-95 whitespace-nowrap text-center"
                      >
                        <Phone className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse-subtle" />
                        <span className="sm:hidden">Gọi tư vấn</span>
                        <span className="hidden sm:inline">Tư vấn kỹ thuật: {company.hotline}</span>
                      </a>

                      <a
                        href={company.zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-bold px-3.5 sm:px-5 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer !min-h-0 active:scale-95 whitespace-nowrap text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span className="sm:hidden">Gửi Zalo</span>
                        <span className="hidden sm:inline">Gửi bản vẽ qua Zalo</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Solutions Pagination */}
        {totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* 3. Bottom Project Quote CTA Banner */}
        <div className="bg-gradient-to-br from-[#063B66] via-[#075FA8] to-[#0A2239] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              <Sparkles className="w-3 h-3" />
              <span>Chính Sách Nhà Thầu &amp; Thợ Cơ Điện</span>
            </div>
            <h3 className="text-base sm:text-xl font-black tracking-tight leading-snug">
              Bạn Cần Báo Giá Trọn Gói Vật Tư Cho Dự Án?
            </h3>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Gửi ngay file thiết kế hoặc danh mục vật tư (BOQ) để nhận mức chiết khấu sỉ độc quyền tốt nhất thị trường Miền Trung.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 relative z-10 w-full md:w-auto shrink-0">
            <a
              href={`tel:${company.hotlineRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F47A20] hover:bg-orange-600 text-white font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs active:scale-95 cursor-pointer !min-h-0"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Hotline: {company.hotline}</span>
            </a>

            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-5 py-3 rounded-xl shadow-lg transition-all text-xs active:scale-95 cursor-pointer !min-h-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0068FF]" />
              <span>Nhắn Zalo Báo Giá</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
