"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ImageIcon,
  Wrench,
  Building2,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { logoutAction } from "../../app/admin/actions";

interface AdminShellProps {
  children: React.ReactNode;
  companyName: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Trang chủ Admin", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/services", label: "Giải pháp", icon: Wrench },
  { href: "/admin/gallery", label: "Hình ảnh", icon: ImageIcon },
  { href: "/admin/company", label: "Thông tin công ty", icon: Building2 },
];

export const AdminShell: React.FC<AdminShellProps> = ({ children, companyName }) => {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
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
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2">
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

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}
              title={isDarkMode ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 text-xs font-extrabold cursor-pointer !min-h-0 shadow-2xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Chế độ Sáng</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700 shrink-0" />
                  <span className="hidden sm:inline">Chế độ Tối</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 w-full p-2.5 sm:p-3.5 lg:p-4">{children}</main>
      </div>
    </div>
  );
};
