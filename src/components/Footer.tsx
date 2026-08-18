"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, MessageSquare, Globe, ArrowUp, Lock } from "lucide-react";
import type { CompanyContact } from "../lib/company";

interface FooterProps {
  company: CompanyContact;
}

export const Footer: React.FC<FooterProps> = ({ company }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1F33] text-slate-200 pt-6 sm:pt-8 pb-24 md:pb-8 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-5 text-left">

          {/* Left Column: Company Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-tight mb-2">
                CÔNG TY TNHH VẬT TƯ ĐÔNG KHA
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-2 sm:mb-3">
                Chuyên phân phối sỉ &amp; lẻ ống đồng, gas lạnh, linh kiện điều hòa – tủ lạnh – máy giặt chính hãng từ những thương hiệu hàng đầu thế giới tại Đà Nẵng &amp; khu vực Miền Trung.
              </p>

              <p className="hidden sm:block text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Với phương châm luôn đồng hành cùng Quý khách hàng - &quot;<strong className="text-white font-extrabold">CHẤT LƯỢNG TỐT NHẤT - UY TÍN HÀNG ĐẦU</strong>&quot;.
              </p>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-extrabold text-white text-xs sm:text-sm">Kết nối với chúng tôi:</span>
              <div className="flex items-center gap-2">
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Đông Kha"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={company.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo Đông Kha"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0068FF] hover:bg-blue-700 text-white flex items-center justify-center font-black text-xs transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                </a>
                <a
                  href={company.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Địa chỉ Google Maps Đông Kha"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EA4335] hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 fill-current stroke-none" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Information */}
          <div className="lg:col-span-6 lg:border-l lg:border-slate-800 lg:pl-8 flex flex-col space-y-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
            <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">
              THÔNG TIN LIÊN HỆ
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              {/* Trụ sở & Kho hàng */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-900/60 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5 border border-blue-700/50">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-white">Địa chỉ cửa hàng &amp; kho hàng:</p>
                  <p className="text-slate-300 font-medium">{company.address}</p>
                </div>
              </div>

              {/* Hotline & Zalo */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-orange-950/60 text-[#F47A20] flex items-center justify-center shrink-0 mt-0.5 border border-orange-800/50">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-white">Hotline &amp; Zalo hỗ trợ 24/7:</p>
                  <a href={`tel:${company.hotlineRaw}`} className="text-base sm:text-lg font-black text-[#F47A20] hover:underline">
                    {company.hotline}
                  </a>
                </div>
              </div>

              {/* Thời gian phục vụ */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-800/50">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-white">Thời gian làm việc:</p>
                  <p className="text-slate-300 font-medium">{company.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex items-center justify-center gap-1.5 bg-[#F47A20] hover:bg-[#E06912] text-white font-extrabold py-2.5 px-3 rounded-xl shadow-xs transition-all text-xs sm:text-sm active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Gọi tư vấn</span>
              </a>
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-600 text-white font-extrabold py-2.5 px-3 rounded-xl shadow-xs transition-all text-xs sm:text-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Nhắn Zalo</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/login"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Quản trị</span>
            </Link>
            <span>•</span>
            <p>© 2026 | Designed by Tran Van Huy</p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer !min-h-0 text-[11px]"
          >
            <span>Đầu trang</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
};
