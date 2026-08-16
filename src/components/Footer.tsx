import React from "react";
import { Phone, MapPin, MessageSquare, ArrowUp } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1F33] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800 text-left">
          
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <a href="#trang-chu" className="flex items-center gap-3 mb-4">
              <img
                src={COMPANY_DATA.logoUrl}
                alt="Logo Vật Tư Điện Lạnh Đông Kha"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <span className="font-black text-xl text-white tracking-tight">
                ĐÔNG KHA <span className="text-[#F47A20] text-sm">ĐÀ NẴNG</span>
              </span>
            </a>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Chuyên cung cấp sỉ &amp; lẻ vật tư, linh kiện thay thế và giải pháp thi công hệ thống điện lạnh, điều hòa, thông gió, sưởi ấm đáng tin cậy tại Đà Nẵng.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={COMPANY_DATA.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Đông Kha"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={COMPANY_DATA.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo Đông Kha"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#0068FF] text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
              >
                Zalo
              </a>
              <a
                href={COMPANY_DATA.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Đông Kha"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#25D366] text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
              >
                WA
              </a>
            </div>
          </div>

          {/* Col 2: Products List (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-white text-base uppercase tracking-wider mb-4 border-l-4 border-[#075FA8] pl-2.5">
              Danh Mục Vật Tư
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Ống đồng điều hòa</a>
              </li>
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Gas lạnh chính hãng (R32, R410A)</a>
              </li>
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Linh kiện sửa chữa điều hòa</a>
              </li>
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Linh kiện tủ lạnh, tủ đông</a>
              </li>
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Linh kiện máy giặt cửa ngang/đứng</a>
              </li>
              <li>
                <a href="#san-pham" className="hover:text-[#F47A20] transition-colors">Nhớt lạnh, gen bảo ôn, đồ nghề</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-extrabold text-white text-base uppercase tracking-wider mb-4 border-l-4 border-[#F47A20] pl-2.5">
              Liên Kết
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#trang-chu" className="hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="#gioi-thieu" className="hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#dich-vu" className="hover:text-white transition-colors">Dịch vụ thi công</a></li>
              <li><a href="#hinh-anh" className="hover:text-white transition-colors">Hình ảnh thực tế</a></li>
              <li><a href="#lien-he" className="hover:text-white transition-colors">Địa chỉ cửa hàng</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Details (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-white text-base uppercase tracking-wider mb-4 border-l-4 border-emerald-500 pl-2.5">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F47A20] shrink-0 mt-1" />
                <span>{COMPANY_DATA.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${COMPANY_DATA.hotlineRaw}`} className="font-bold text-white hover:text-[#F47A20]">
                  {COMPANY_DATA.hotline}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#0068FF] shrink-0" />
                <span>Zalo: {COMPANY_DATA.hotline}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vật Tư Điện Lạnh Đông Kha Đà Nẵng. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
