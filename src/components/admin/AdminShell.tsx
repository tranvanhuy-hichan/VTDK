"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Sun,
  Moon,
  User,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { logoutAction } from "../../app/admin/actions";
import type { UserProfile } from "../../types/auth";

interface AdminShellProps {
  children: React.ReactNode;
  companyName: string;
  adminUser?: UserProfile | null;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Trang chủ Admin", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/services", label: "Giải pháp", icon: Wrench },
  { href: "/admin/gallery", label: "Hình ảnh", icon: ImageIcon },
  { href: "/admin/company", label: "Thông tin công ty", icon: Building2 },
];

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  companyName,
  adminUser,
}) => {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const adminName = adminUser?.name || "Quản trị viên";
  const adminEmail = adminUser?.email || "vattudongkha@gmail.com";
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

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

  const toggleDarkMode = () => {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);
    if (nextIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const activeItem = NAV_ITEMS.find((item) => isActive(item.href));

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-3.5 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-sm border border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black tracking-tight text-white truncate">
              ĐÔNG KHA
            </h1>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60 shrink-0">
              ADMIN
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            Bảng quản trị hệ thống
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold transition-colors ${
                active
                  ? "bg-[#075FA8] text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold text-slate-300 hover:bg-red-700 hover:text-white transition-colors !min-h-0 cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-56 bg-slate-900 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative flex flex-col w-56 bg-slate-900 h-full shadow-lg animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Đóng menu"
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors !min-h-0"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Content Area */}
      <div className="lg:pl-56 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Mở menu"
                className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors !min-h-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {activeItem?.label ?? "Bảng quản trị"}
              </h2>
            </div>

            {/* Right: Admin User Profile Dropdown Menu */}
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="inline-flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer !min-h-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#075FA8] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  {initials || <User className="w-4 h-4" />}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight truncate max-w-[100px]">
                    {adminName.trim().split(/\s+/).pop() || adminName}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold leading-none mt-0.5">
                    Quản trị viên
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
              </button>


              {/* Admin Dropdown Popover */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 text-left">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {adminName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {adminEmail}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/60 w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Quản trị viên hệ thống</span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {/* View Profile & Change Password */}
                    <Link
                      href="/tai-khoan/ho-so"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                      <span>Thông tin tài khoản</span>
                    </Link>

                    {/* View Customer Website Link */}
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ExternalLink className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                        <span>Xem trang chủ website</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Mở tab</span>
                    </Link>


                    {/* Dark/Light Mode Switcher */}
                    <button
                      type="button"
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {isDarkMode ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                        )}
                        <span>{isDarkMode ? "Giao diện Sáng" : "Giao diện Tối"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {isDarkMode ? "Bật" : "Tắt"}
                      </span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer !min-h-0 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất quản trị</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 w-full p-2.5 sm:p-3.5 lg:p-4">{children}</main>
      </div>
    </div>
  );
};
