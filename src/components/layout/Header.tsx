"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  Menu,
  X,
  MapPin,
  ChevronRight,
  Shield,
  ShieldCheck,
  Search,
  Sun,
  Moon,
  Home,
  Package,
  Sparkles,
  Wrench,
  Building2,
  Store,
} from "lucide-react";
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

  // Lock body scroll when mobile sidebar drawer is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMobileMenuOpen]);

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
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          const sectionIds = ["trang-chu", "san-pham", "thuong-hieu", "dich-vu", "gioi-thieu", "hinh-anh", "lien-he"];
          const scrollPosition = window.scrollY + 160;

          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && scrollPosition >= el.offsetTop) {
              setActiveSectionState(sectionIds[i]);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const rawNavLinks = [
    { name: "Trang chủ", href: "/", hash: "#trang-chu", icon: Home },
    { name: "Sản phẩm", href: "/san-pham", hash: "#san-pham", icon: Package },
    { name: "Giải pháp", href: "/giai-phap", hash: "#dich-vu", icon: Wrench },
    { name: "Kho & Cửa hàng", href: isHomePage ? "#hinh-anh" : "/#hinh-anh", hash: "#hinh-anh", icon: Store },
    { name: "Liên hệ", href: "/lien-he", hash: "#lien-he", icon: Phone },
  ];

  return (
    <>
      {/* Top Banner Notice for Local Customers */}
      <div className="bg-[#0B1F33] text-slate-200 text-[11px] sm:text-xs py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Kho Đà Nẵng: 400 Phạm Hùng, Hòa Phước, Hòa Vang</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Chính hãng CO/CQ</span>
            </span>
            <a
              href={`tel:${company.hotlineRaw}`}
              className="hover:text-white transition-colors font-bold text-amber-400 flex items-center gap-1 cursor-pointer !min-h-0"
            >
              <Phone className="w-3 h-3" />
              <span>{company.hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Sticky Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 select-none border-b ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs border-slate-200/90 dark:border-slate-800"
            : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs"
        }`}
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-13 sm:h-15 lg:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Mở menu danh mục"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden !min-h-0 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
              <Image
                src={COMPANY_DATA.logoUrl}
                alt="Đông Kha Logo"
                width={36}
                height={36}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 rounded-lg shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-black text-xs sm:text-base lg:text-lg tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  VẬT TƯ ĐÔNG KHA
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block leading-none mt-0.5">
                  VẬT TƯ ĐIỆN LẠNH ĐÀ NẴNG
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Real-time Search Input Box (Centered) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md xl:max-w-xl mx-2 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm vật tư, ống đồng, linh kiện, gas lạnh..."
              className="w-full text-xs lg:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Xóa từ khóa tìm kiếm"
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
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : link.href === "/san-pham"
                    ? pathname.startsWith("/san-pham")
                    : link.href === "/giai-phap"
                    ? pathname.startsWith("/giai-phap")
                    : link.href === "/lien-he"
                    ? pathname.startsWith("/lien-he")
                    : isHomePage && activeSectionState === link.hash.replace("#", "");

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs 2xl:text-sm font-bold transition-all px-2.5 2xl:px-3 py-1.5 rounded-lg relative whitespace-nowrap shrink-0 ${
                      isActive
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

        {/* Search Dropdown Popover */}
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
      </header>

      {/* Mobile Off-Canvas Sidebar Drawer (Isolated from Header with Background Scroll Lock) */}
      {isMobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200"
          style={{ touchAction: "none" }}
        >
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer */}
          <aside
            className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200 z-10 text-left"
            style={{ touchAction: "auto" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 min-w-0"
              >
                <Image
                  src={COMPANY_DATA.logoUrl}
                  alt="Logo"
                  width={36}
                  height={36}
                  className="h-8 w-auto object-contain rounded-lg shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight block truncate">
                    VẬT TƯ ĐÔNG KHA
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block truncate mt-0.5">
                    Vật tư điện lạnh Đà Nẵng
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Đóng menu"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors !min-h-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              <div className="px-2 pb-1.5 text-[9px] font-black tracking-wider uppercase text-slate-400 dark:text-slate-500">
                DANH MỤC ĐIỀU HƯỚNG
              </div>

              {rawNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : link.href === "/san-pham"
                    ? pathname.startsWith("/san-pham")
                    : link.href === "/giai-phap"
                    ? pathname.startsWith("/giai-phap")
                    : link.href === "/lien-he"
                    ? pathname.startsWith("/lien-he")
                    : isHomePage && activeSectionState === link.hash.replace("#", "");
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all group ${
                      isActive
                        ? "bg-[#075FA8] text-white font-extrabold shadow-md shadow-blue-900/20"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#075FA8] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-[#075FA8] dark:group-hover:text-blue-400"
                        }`}
                      />
                      <span className="truncate">{link.name}</span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white/80" : "text-slate-400"
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Admin Dashboard Item (Identical style, placed at the end of the list) */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all group text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#075FA8] dark:hover:text-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-transform group-hover:scale-110" />
                    <span className="truncate">Trang quản trị (Admin)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
                </Link>
              )}
            </div>

            {/* Footer Address */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#F47A20] shrink-0 mt-0.5" />
                <span className="leading-tight">{company.address}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
