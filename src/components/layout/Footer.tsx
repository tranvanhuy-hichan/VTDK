"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, MessageSquare, Clock, Globe, Lock } from "lucide-react";
import type { CompanyContact } from "../../lib/company";

export interface CategoryLink {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  company: CompanyContact;
  categories?: CategoryLink[];
}

export const Footer: React.FC<FooterProps> = ({ company, categories = [] }) => {
  return (
    <footer className="bg-primary-dark text-slate-200 pt-5 sm:pt-7 pb-4 sm:pb-5 border-t border-slate-800/90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4 text-left">
        
        {/* Top Grid: Info & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          
          {/* Cột 1: Thông tin công ty */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight">
                {company.fullName || company.name}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Chính Hãng
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Tổng kho phân phối sỉ &amp; lẻ ống đồng, gas lạnh, linh kiện điều hòa, tủ lạnh, máy giặt uy tín hàng đầu tại {company.city || "Đà Nẵng & Miền Trung"}.
            </p>

            {company.taxCode && (
              <p className="text-xs text-slate-400">
                <span>Mã số thuế: </span>
                <strong className="text-slate-300 font-mono">{company.taxCode}</strong>
              </p>
            )}

            {/* Circular Social Badges */}
            <div className="flex items-center gap-3 pt-0.5">
              <span className="text-xs font-bold text-slate-400">Kết nối:</span>
              
              {/* Facebook Round Badge */}
              {company.facebookUrl && (
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook ${company.brandName}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer !min-h-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {/* Zalo Round Badge */}
              {company.zaloUrl && (
                <a
                  href={company.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Zalo ${company.brandName}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0068FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer !min-h-0"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                </a>
              )}

              {/* Map Round Badge */}
              {company.googleMapsUrl && (
                <a
                  href={company.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Địa chỉ Google Maps ${company.brandName}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EA4335] hover:bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer !min-h-0"
                >
                  <MapPin className="w-4 h-4 fill-current stroke-none" />
                </a>
              )}
            </div>
          </div>

          {/* Cột 2: Thông tin liên hệ trực tiếp */}
          <div className="lg:col-span-6 space-y-2.5 lg:border-l lg:border-slate-800 lg:pl-8">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider text-slate-400">
              THÔNG TIN LIÊN HỆ
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              {/* Địa chỉ */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-[#38BDF8] flex items-center justify-center shrink-0 border border-blue-400/30">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-300 leading-snug">
                  <strong className="text-white">Kho hàng: </strong>
                  <span>{company.address}</span>
                </p>
              </div>

              {/* Hotline & Zalo */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-accent flex items-center justify-center shrink-0 border border-orange-400/30">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-300 leading-snug">
                  <strong className="text-white">Hotline &amp; Zalo: </strong>
                  <a
                    href={`tel:${company.hotlineRaw}`}
                    className="font-bold text-accent hover:underline whitespace-nowrap"
                  >
                    {company.hotline}
                  </a>
                </p>
              </div>

              {/* Email nếu có */}
              {company.email && (
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/30">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-slate-300 leading-snug">
                    <strong className="text-white">Email: </strong>
                    <a href={`mailto:${company.email}`} className="text-slate-300 hover:text-white underline">
                      {company.email}
                    </a>
                  </p>
                </div>
              )}

              {/* Giờ làm việc */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-300 leading-snug">
                  <strong className="text-white">Thời gian làm việc: </strong>
                  <span>{company.workingHours}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Danh Mục Sản Phẩm & Trang Quan Trọng */}
        <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
            <span>Danh Mục &amp; Dịch Vụ Nổi Bật:</span>
            <span className="text-[10px] text-slate-500 font-normal sm:hidden">Vuốt sang ➔</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-left">
            <Link
              href="/san-pham"
              className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
            >
              Tất Cả Sản Phẩm
            </Link>
            <Link
              href="/giai-phap"
              className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
            >
              Giải Pháp Kỹ Thuật
            </Link>
            <Link
              href="/lien-he"
              className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
            >
              Liên Hệ Kho Hàng
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Bản quyền Căn Giữa */}
        <div className="pt-2 border-t border-slate-800/60 text-center text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-2">
          <p>
            © {new Date().getFullYear()} {company.fullName || company.name}. Tất cả quyền được bảo lưu.
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2 py-0.2 rounded-full">
            ● Hệ thống thử nghiệm (Beta)
          </span>
        </div>

      </div>
    </footer>
  );
};
