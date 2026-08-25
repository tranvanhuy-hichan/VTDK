"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingBag, Wrench, Phone } from "lucide-react";

export const MobileBottomBar: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom bar on admin pages and auth pages
  if (pathname.startsWith("/admin") || pathname === "/dang-nhap" || pathname === "/dang-ky") {
    return null;
  }

  const isHomePage = pathname === "/";

  const navItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Sản phẩm",
      href: "/san-pham",
      icon: Package,
      isActive: pathname.startsWith("/san-pham"),
    },
    {
      label: "Đơn hàng",
      href: "/tai-khoan/don-hang",
      icon: ShoppingBag,
      isActive: pathname.startsWith("/tai-khoan/don-hang") || pathname.startsWith("/don-hang"),
    },
    {
      label: "Giải pháp",
      href: "/giai-phap",
      icon: Wrench,
      isActive: pathname.startsWith("/giai-phap"),
    },
    {
      label: "Liên hệ",
      href: "/lien-he",
      icon: Phone,
      isActive: pathname.startsWith("/lien-he"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)] transition-colors"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 relative transition-colors cursor-pointer select-none !min-h-0 py-1.5 ${
                item.isActive
                  ? "text-[#075FA8] dark:text-blue-400 font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  item.isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] tracking-tight truncate max-w-full font-medium">
                {item.label}
              </span>

              {item.isActive && (
                <span className="absolute top-0 inset-x-3.5 h-0.5 bg-[#075FA8] dark:bg-blue-400 rounded-full shadow-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
