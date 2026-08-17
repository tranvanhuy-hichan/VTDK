"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, Menu, X, MapPin, ChevronRight, Shield, Search } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import type { CompanyContact } from "../lib/company";

interface HeaderProps {
  activeSection?: string;
  company: CompanyContact;
}

export const Header: React.FC<HeaderProps> = ({ company }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsMobileMenuOpen(false);
    router.push(q ? `/?q=${encodeURIComponent(q)}#san-pham` : "/#san-pham");
  };

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
      <div className="bg-[#0B1F33] text-slate-200 text-[11px] sm:text-xs py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#F47A20] shrink-0" />
            <span className="truncate">
              <strong>Cửa hàng:</strong> {company.address}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3.5 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3 h-3 text-emerald-400" /> Sỉ &amp; Lẻ Vật Tư Điện Lạnh Chuẩn Kỹ Thuật
            </span>
            <span className="text-slate-650">|</span>
            <span className="text-slate-300">Mở cửa: {company.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200"
            : "bg-white py-2.5 sm:py-3 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Area */}
          <a href="#trang-chu" className="flex items-center gap-2 group">
            <Image
              src={COMPANY_DATA.logoUrl}
              alt="Logo Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
              width={56}
              height={56}
              priority
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <div className="font-black text-slate-900 tracking-tight text-base sm:text-lg leading-none flex items-center gap-1">
                <span>ĐÔNG KHA</span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider mt-1.5 uppercase">
                Vật Tư Điện Lạnh Chính Hãng
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-[#075FA8] font-bold text-sm transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#075FA8] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-[#075FA8] !min-h-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile Right Controls: Hamburger Menu */}
          <div className="flex items-center lg:hidden">
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
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 hover:text-[#075FA8] !min-h-0"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </form>

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
                href={`tel:${company.hotlineRaw}`}
                className="w-full flex items-center justify-center gap-3 bg-[#075FA8] text-white font-bold py-3.5 px-4 rounded-xl shadow text-lg"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Gọi Hotline: {company.hotline}</span>
              </a>
              
              <a
                href={company.zaloUrl}
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
