"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ImageIcon,
  Wrench,
  Building2,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Settings,
  Palette,
  FileSpreadsheet,
} from "lucide-react";
import { logoutAction } from "../../app/admin/actions";
import { AdminNotificationCenter } from "./AdminNotificationCenter";
import type { UserProfile } from "../../types/auth";
import { COMPANY_DATA } from "../../data/company";

interface AdminShellProps {
  children: React.ReactNode;
  companyName?: string;
  adminUser?: UserProfile | null;
}

interface NavSection {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Tổng quan",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
      { href: "/admin/quote", label: "Báo Giá", icon: FileSpreadsheet, badge: "B2B" },
    ],
  },
  {
    title: "Quản lý dữ liệu",
    items: [
      { href: "/admin/products", label: "Sản phẩm", icon: Package },
      { href: "/admin/services", label: "Giải pháp", icon: Wrench },
      { href: "/admin/gallery", label: "Thư viện ảnh", icon: ImageIcon },
    ],
  },
  {
    title: "Cài đặt & Nhận diện",
    items: [
      { href: "/admin/theme", label: "Theme & Giao diện", icon: Palette, badge: "NEW" },
      { href: "/admin/company", label: "Doanh nghiệp", icon: Building2 },
      { href: "/admin/settings", label: "Cấu hình hệ thống", icon: Settings },
    ],
  },
];

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  companyName,
  adminUser,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const adminName = adminUser?.name || companyName || COMPANY_DATA.brandName || "Admin";
  const adminEmail = adminUser?.email || COMPANY_DATA.email || "admin@example.com";
  const initials = adminName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch {}
    window.location.replace("/");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : href === "/" ? pathname === "/" : pathname.startsWith(href);

  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const currentActiveItem = allItems.find((item) => isActive(item.href));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#081524] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-800/90 bg-[#06101c]/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-sm border border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img src={COMPANY_DATA.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-black tracking-tight text-white uppercase truncate">
                {COMPANY_DATA.shortName || "HỆ THỐNG"}
              </span>
              <span className="text-[8px] font-black uppercase text-cyan-400 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800/60 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-1 leading-none">
              Quản trị Doanh nghiệp
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-2.5 py-3 space-y-5 overflow-y-auto custom-scrollbar">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-2.5 text-[9px] font-black tracking-wider uppercase text-slate-400">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, badge }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 group ${
                      active
                        ? "bg-gradient-to-r from-[#075FA8] to-[#0B3D66] text-white shadow-md shadow-blue-900/30 font-extrabold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          active ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{label}</span>
                    </div>

                    {badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-2.5 border-t border-slate-800/80 bg-[#06101c]/60 space-y-1.5">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Supabase</span>
          </div>
          <span className="text-emerald-400 font-extrabold text-[10px]">Online</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/50 border border-red-900/30 transition-colors !min-h-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-56 border-r border-slate-800/80 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative flex flex-col w-56 h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            <button
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Đóng menu"
              className="absolute top-3.5 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors !min-h-0 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="lg:pl-56 flex flex-col min-h-screen">
        {/* Modern Compact Topbar Header */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2">
            {/* Left: Mobile Toggle & Centered Breadcrumbs */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Mở menu"
                className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors !min-h-0 cursor-pointer"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Quay lại trang trước"
                className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-[#075FA8] dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer !min-h-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                <span className="hidden sm:inline text-xs">Quay lại</span>
              </button>

              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

              <nav

                aria-label="Breadcrumb"
                className="flex items-center flex-nowrap whitespace-nowrap gap-1.5 text-xs leading-none text-slate-500 dark:text-slate-400 min-w-0 overflow-hidden"
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center font-bold hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 !min-h-0"
                >
                  Admin
                </Link>
                {currentActiveItem && currentActiveItem.href !== "/admin" && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="inline-flex items-center font-extrabold text-slate-900 dark:text-white truncate shrink-0">
                      {currentActiveItem.label}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* Right: Notifications, Store Link & User Profile Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Notification Center Bell */}
              <AdminNotificationCenter />

              {/* External Client Store Link */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all !min-h-0 cursor-pointer"
              >
                <span>Xem Website</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              {/* Admin Profile Dropdown (With Config Inside) */}
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer !min-h-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#075FA8] to-cyan-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    {initials || <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-extrabold leading-tight text-slate-900 dark:text-white max-w-[130px] truncate">
                      {adminName}
                    </div>
                    <div className="text-[9px] text-blue-600 dark:text-blue-400 font-extrabold leading-none mt-0.5">
                      Quản trị viên
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Admin User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in zoom-in-95 text-left space-y-1.5">
                    {/* User Info Header */}
                    <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#075FA8] to-cyan-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                          {initials || <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {adminName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {adminEmail}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/60 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Quản trị viên toàn quyền</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/tai-khoan/ho-so"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        <span>Hồ sơ &amp; Đổi mật khẩu</span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        <span>Cài đặt hệ thống</span>
                      </Link>

                      <Link
                        href="/admin/company"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        <span>Thông tin doanh nghiệp</span>
                      </Link>

                      <div className="h-px bg-slate-100 dark:border-slate-800 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer !min-h-0 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Workspace Content - Full Width & Clean */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
