"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ImageIcon,
  Wrench,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "../../app/admin/actions";

interface AdminShellProps {
  children: React.ReactNode;
  companyName: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Sản phẩm", icon: Package },
  { href: "/admin/gallery", label: "Hình ảnh", icon: ImageIcon },
  { href: "/admin/services", label: "Giải pháp", icon: Wrench },
  { href: "/admin/company", label: "Thông tin công ty", icon: Building2 },
];

export const AdminShell: React.FC<AdminShellProps> = ({ children, companyName }) => {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const activeItem = NAV_ITEMS.find((item) => isActive(item.href));

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <img src="/images/logo.png" alt="Logo" className="h-9 w-auto shrink-0" />
        <div className="min-w-0">
          <h1 className="text-sm font-black tracking-tight leading-none text-white truncate">
            {companyName}
          </h1>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
            Bảng quản trị
          </span>
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

      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold text-slate-300 hover:bg-red-700 hover:text-white transition-colors !min-h-0"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-slate-900 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative flex flex-col w-64 bg-slate-900 h-full shadow-lg animate-in slide-in-from-left duration-200">
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
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3.5">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Mở menu"
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors !min-h-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {activeItem?.label ?? "Bảng quản trị"}
            </h2>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
