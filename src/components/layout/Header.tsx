"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Phone, Menu, X, MapPin, ChevronRight, Shield, Search, Sun, Moon } from "lucide-react";
import { COMPANY_DATA } from "../../data/company";
import type { CompanyContact } from "../../lib/company";
import { CartButton } from "../cart/CartButton";
import { UserMenu } from "../auth/UserMenu";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  activeSection?: string;
  company: CompanyContact;
}

export const Header: React.FC<HeaderProps> = ({ company }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isHomePage = pathname === "/";


  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSectionState, setActiveSectionState] = useState<string>("trang-chu");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-search-toggle]")) return;
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(target)) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMobileSearchOpen]);

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

      const sectionIds = ["trang-chu", "san-pham", "thuong-hieu", "dich-vu", "gioi-thieu", "hinh-anh", "lien-he"];
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
    { name: "Sản phẩm", hash: "#san-pham" },
    { name: "Thương hiệu", hash: "#thuong-hieu" },
    { name: "Giải pháp", hash: "#dich-vu" },
    { name: "Giới thiệu", hash: "#gioi-thieu" },
    { name: "Kho & cửa hàng", hash: "#hinh-anh" },
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
      {/* Top Banner Notice for Local Customers */}
      <div className="bg-[#0B1F33] text-slate-200 text-[11px] sm:text-xs py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#F47A20] shrink-0" />
            <span className="truncate">
              <strong>Cửa hàng:</strong> {company.address}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300 shrink-0">
            <span>⚡ Giao hàng hỏa tốc nội thành</span>
            <span>📞 Hotline: {company.hotline}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200 dark:border-slate-800"
            : "bg-white dark:bg-slate-900 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800"
          }`}
      >
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">

          {/* Left: Mobile Hamburger Button + Logo Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold transition-colors !min-h-0 cursor-pointer xl:hidden shrink-0"
              aria-label="Mở Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#075FA8] dark:text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo Area - Links to Home / */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <Image
                src={COMPANY_DATA.logoUrl}
                alt="Logo Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
                width={56}
                height={56}
                priority
                className="h-9 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 rounded-xl"
              />
              <div className="flex flex-col">
                <div className="font-black text-slate-900 dark:text-white tracking-tight text-sm sm:text-lg leading-none flex items-center gap-1">
                  <span>ĐÔNG KHA</span>
                </div>
                <span className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider mt-0.5 sm:mt-1 uppercase whitespace-nowrap">
                  Vật Tư Điện Lạnh
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Search Bar on Desktop & Tablet */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm 2xl:max-w-md mx-2 2xl:mx-4 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm ống đồng, gas lạnh, linh kiện..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-8 py-2 text-xs 2xl:text-sm rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:border-[#075FA8] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer !min-h-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Navigation Links, Cart & User Menu */}
          <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 shrink-0 justify-end">
            <nav className="flex items-center gap-1 2xl:gap-1.5">
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
                    className={`text-xs 2xl:text-sm font-bold transition-all px-2.5 2xl:px-3 py-1.5 rounded-lg relative whitespace-nowrap shrink-0 ${isActive
                        ? "text-[#075FA8] dark:text-[#F47A20] bg-blue-50 dark:bg-slate-800 font-extrabold shadow-2xs after:content-[''] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-[#075FA8] dark:after:bg-[#F47A20]"
                        : "text-slate-700 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-[#F47A20] hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />
            <CartButton />
            <UserMenu />
            {/* Show standalone theme toggle ONLY when user is NOT logged in */}
            {!user && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !min-h-0 shrink-0"
                aria-label="Đổi giao diện"
              >
                {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
              </button>
            )}
          </div>


          {/* Mobile & Tablet Right Controls: Search + Cart + User (User on the FAR RIGHT) */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:hidden shrink-0">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              data-search-toggle="true"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors !min-h-0 cursor-pointer"
              aria-label="Mở tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            <CartButton />

            <UserMenu />
          </div>
        </div>

        {/* Search Dropdown Popover — floats near the search icon, doesn't push the page down */}
        {isMobileSearchOpen && (
          <div
            ref={searchDropdownRef}
            className="absolute top-full right-3 sm:right-6 z-30 mt-2 w-[min(92vw,380px)] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8]"
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
                    className={`flex items-center justify-between p-3 rounded-xl font-bold text-base transition-colors ${isActive
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
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-750"
                aria-label="Chuyển giao diện sáng tối"
              >
                <span className="flex items-center gap-3">
                  {theme === "light" ? <Moon className="h-5 w-5 text-[#075FA8]" /> : <Sun className="h-5 w-5 text-amber-400" />}
                  {theme === "light" ? "Giao diện tối" : "Giao diện sáng"}
                </span>
                <span className="text-xs font-semibold text-slate-400">Chuyển</span>
              </button>
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
