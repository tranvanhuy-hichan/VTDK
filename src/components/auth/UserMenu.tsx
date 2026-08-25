"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogIn, ShoppingBag, ShieldCheck, LogOut, ChevronDown, Moon, Sun, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const UserMenu: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />;
  }

  if (!user) {
    return (
      <Link
        href="/dang-nhap"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#075FA8]/10 dark:bg-blue-500/20 hover:bg-[#075FA8]/20 dark:hover:bg-blue-500/30 text-[#075FA8] dark:text-blue-400 font-bold text-xs rounded-xl transition-all cursor-pointer !min-h-0 shrink-0 whitespace-nowrap"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đăng nhập</span>
      </Link>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayName = user.role === "ADMIN" ? user.name : (user.name.trim().split(/\s+/).slice(-2).join(" ") || user.name);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer !min-h-0 border border-slate-200/80 dark:border-slate-700"
      >
        <div className="w-6 h-6 rounded-full bg-[#075FA8] text-white flex items-center justify-center text-[10px] font-black shrink-0">
          {initials || <User className="w-3.5 h-3.5" />}
        </div>
        <span className="max-w-[120px] sm:max-w-[160px] truncate hidden sm:inline">{displayName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 text-left">
          {user.role === "ADMIN" ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-t-xl transition-colors group"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {user.name}
                </p>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold rounded-md">
                  Vào Admin →
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </Link>
          ) : (
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          )}

          <div className="py-1 space-y-0.5">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Trang quản trị (Admin)</span>
              </Link>
            )}

            <Link
              href="/tai-khoan/ho-so"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Thông tin tài khoản</span>
            </Link>

            <Link
              href="/tai-khoan/don-hang"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              href="/tai-khoan/cai-dat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>Cài đặt hệ thống</span>
            </Link>

            <div className="h-px bg-slate-100 dark:border-slate-800 my-1" />

            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                try {
                  await logout();
                } catch {}
                window.location.replace("/");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer !min-h-0 text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
