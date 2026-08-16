import React, { useState, useEffect } from "react";
import { Phone, Menu, X, MapPin, ChevronRight, Shield } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "#trang-chu" },
    { name: "Giới thiệu", href: "#gioi-thieu" },
    { name: "Sản phẩm", href: "#san-pham" },
    { name: "Dịch vụ", href: "#dich-vu" },
    { name: "Hình ảnh", href: "#hinh-anh" },
    { name: "Liên hệ", href: "#lien-he" },
  ];

  return (
    <>
      {/* Top Banner Notice for Local Customers */}
      <div className="bg-[#0B1F33] text-slate-200 text-xs sm:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-[#F47A20] shrink-0" />
            <span className="truncate">
              <strong>Cửa hàng:</strong> 400 Phạm Hùng, Hòa Xuân, Đà Nẵng
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Sỉ &amp; Lẻ Vật Tư Điện Lạnh Chuẩn Kỹ Thuật
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Mở cửa: {COMPANY_DATA.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200"
            : "bg-white py-3 sm:py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Area */}
          <a href="#trang-chu" className="flex items-center gap-2.5 group">
            <img
              src={COMPANY_DATA.logoUrl}
              alt="Logo Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
              className="h-11 sm:h-14 lg:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <div className="font-black text-slate-900 tracking-tight text-base sm:text-xl leading-none flex items-center gap-1">
                <span>ĐÔNG KHA</span>
                <span className="text-[#F47A20] text-xs sm:text-sm font-bold bg-orange-50 text-[#F47A20] px-1.5 py-0.5 rounded border border-orange-200">
                  ĐÀ NẴNG
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wide mt-1 uppercase">
                Vật Tư Điện Lạnh Chuyên Nghiệp
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-[#075FA8] font-semibold text-base transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#075FA8] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Hotline CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#075FA8] to-[#0868B2] hover:from-[#0B1F33] hover:to-[#075FA8] text-white font-bold px-5 py-2.5 sm:py-3 rounded-xl shadow-md shadow-blue-700/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4 text-white fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-blue-100 font-semibold leading-none">
                  Hotline tư vấn
                </span>
                <span className="text-base sm:text-lg font-extrabold leading-tight text-white">
                  {COMPANY_DATA.hotline}
                </span>
              </div>
            </a>
          </div>

          {/* Mobile Right Controls: Mini Phone + Hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              aria-label="Gọi hotline"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#075FA8] text-white font-bold shadow"
            >
              <Phone className="w-5 h-5 fill-current" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Mở menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-800 font-bold text-lg hover:bg-slate-50 hover:text-[#075FA8] transition-colors border-b border-slate-100 last:border-0"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-3">
              <a
                href={`tel:${COMPANY_DATA.hotlineRaw}`}
                className="w-full flex items-center justify-center gap-3 bg-[#075FA8] text-white font-bold py-3.5 px-4 rounded-xl shadow text-lg"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Gọi Hotline: {COMPANY_DATA.hotline}</span>
              </a>
              
              <a
                href={COMPANY_DATA.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0068FF] text-white font-bold py-3 px-4 rounded-xl text-base"
              >
                <span>💬 Nhắn Zalo tư vấn</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
