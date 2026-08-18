"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Phone, Menu, X, MapPin, ChevronRight, Shield, Search, Sun, Moon } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import type { CompanyContact } from "../lib/company";

interface HeaderProps {
  activeSection?: string;
  company: CompanyContact;
}

export const Header: React.FC<HeaderProps> = ({ company }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSectionState, setActiveSectionState] = useState<string>("trang-chu");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    router.push(q ? `/san-pham?q=${encodeURIComponent(q)}` : "/san-pham");
  };

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ["trang-chu", "gioi-thieu", "san-pham", "dich-vu", "hinh-anh", "lien-he"];
      const scrollPosition = window.scrollY + 160;

      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .sort((a, b) => a.offsetTop - b.offsetTop);

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop) {
          setActiveSectionState(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const rawNavLinks = [
    { name: "Trang chủ", hash: "#trang-chu" },
    { name: "Giới thiệu", hash: "#gioi-thieu" },
    { name: "Sản phẩm", hash: "#san-pham" },
    { name: "Dịch vụ", hash: "#dich-vu" },
    { name: "Hình ảnh", hash: "#hinh-anh" },
    { name: "Liên hệ", hash: "#lien-he" },
  ];

  const getTargetHref = (hash: string) => {
    if (hash === "#trang-chu") return "/";
    if (hash === "#san-pham") return "/san-pham";
    return isHomePage ? hash : `/${hash}`;
  };

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
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200 dark:border-slate-800"
            : "bg-white dark:bg-slate-900 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Area - Links to Home / */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={COMPANY_DATA.logoUrl}
              alt="Logo Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
              width={56}
              height={56}
              priority
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform group-hover:scale-105 rounded-xl"
            />
            <div className="flex flex-col">
              <div className="font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg leading-none flex items-center gap-1">
                <span>ĐÔNG KHA</span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-555 font-bold tracking-wider mt-1.5 uppercase">
                Vật Tư Điện Lạnh Chính Hãng
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#075FA8] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500 hover:text-[#075FA8] dark:hover:text-blue-400 !min-h-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center gap-1 sm:gap-1.5">
              {rawNavLinks.map((link) => {
                const targetHref = getTargetHref(link.hash);
                const sectionId = link.hash.replace("#", "");
                const isActive = isHomePage
                  ? activeSectionState === sectionId
                  : (pathname === "/san-pham" && link.hash === "#san-pham") ||
                    (pathname === "/" && link.hash === "#trang-chu");

                return (
                  <Link
                    key={link.hash}
                    href={targetHref}
                    className={`text-sm font-bold transition-all px-3 py-1.5 rounded-lg relative ${
                      isActive
                        ? "text-[#075FA8] dark:text-[#F47A20] bg-blue-50 dark:bg-slate-800 font-extrabold shadow-2xs after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#075FA8] dark:after:bg-[#F47A20]"
                        : "text-slate-700 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-[#F47A20] hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !min-h-0"
              aria-label="Đổi giao diện"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
          </div>

          {/* Mobile Right Controls: Search + Hamburger Menu */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors !min-h-0 cursor-pointer"
              aria-label="Mở tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !min-h-0"
              aria-label="Đổi giao diện"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold transition-colors !min-h-0 cursor-pointer"
              aria-label="Mở Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#075FA8] dark:text-blue-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {isMobileSearchOpen && (
          <div className="lg:hidden px-4 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-1 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8]"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-[#075FA8] !min-h-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {rawNavLinks.map((link) => {
                const targetHref = getTargetHref(link.hash);
                const sectionId = link.hash.replace("#", "");
                const isActive = isHomePage
                  ? activeSectionState === sectionId
                  : (pathname === "/san-pham" && link.hash === "#san-pham") ||
                    (pathname === "/" && link.hash === "#trang-chu");

                return (
                  <Link
                    key={link.hash}
                    href={targetHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl font-bold text-base transition-colors ${
                      isActive
                        ? "bg-[#075FA8]/10 dark:bg-blue-900/30 text-[#075FA8] dark:text-blue-400 font-extrabold border-l-4 border-[#075FA8] dark:border-blue-400"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-5 h-5 ${isActive ? "text-[#075FA8] dark:text-blue-400" : "text-slate-400"}`} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
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
