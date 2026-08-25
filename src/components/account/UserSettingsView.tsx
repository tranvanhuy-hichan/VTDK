"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Sun,
  Moon,
  CheckCircle2,
  Bell,
  ShieldCheck,
  User,
  ShoppingBag,
  HelpCircle,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ProductDetailHeader } from "../product/ProductDetailHeader";

export const UserSettingsView: React.FC = () => {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [emailNotification, setEmailNotification] = useState(true);

  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");

      const notifPref = localStorage.getItem("user_email_notif");
      if (notifPref === "false") {
        setEmailNotification(false);
      }
    } catch {}
  }, []);

  const handleToggleTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleToggleNotif = () => {
    const next = !emailNotification;
    setEmailNotification(next);
    localStorage.setItem("user_email_notif", next ? "true" : "false");
  };

  if (isAuthLoading) {
    return (
      <section className="pt-2 sm:pt-4 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
          <ProductDetailHeader productName="Cài đặt hệ thống" />
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 text-[#075FA8] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="pt-2 sm:pt-4 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 text-left">
          <ProductDetailHeader productName="Cài đặt hệ thống" />
          <div className="max-w-md mx-auto text-center pt-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Đăng nhập để tùy chỉnh cài đặt
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vui lòng đăng nhập để lưu cấu hình giao diện và thông báo của bạn.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-0 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 text-left">
        {/* Navigation Breadcrumb */}
        <ProductDetailHeader productName="Cài đặt hệ thống" />

        {/* Compact Settings Content Container */}
        <div className="max-w-2xl space-y-3 pt-1">
          {/* Section 1: Cài đặt hệ thống */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-black shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Tùy Chọn Hệ Thống
                </h2>
                <p className="text-[10px] text-slate-400">
                  Giao diện và thông báo theo tài khoản
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Theme Toggle Row */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {theme === "light" ? (
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Giao diện hiển thị
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {theme === "light" ? "Đang chọn: Giao diện sáng" : "Đang chọn: Giao diện tối"}
                    </div>
                  </div>
                </div>

                {/* Compact Segmented Control */}
                <div className="flex items-center bg-slate-200/80 dark:bg-slate-700/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("light")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer !min-h-0 ${
                      theme === "light"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Sáng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTheme("dark")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer !min-h-0 ${
                      theme === "dark"
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-white"
                    }`}
                  >
                    <Moon className="w-3 h-3 text-slate-300" />
                    <span>Tối</span>
                  </button>
                </div>
              </div>

              {/* Notification Toggle Row */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#075FA8] dark:text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Thông báo đơn hàng
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Cập nhật tiến độ giao hàng & xác nhận
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNotif}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer !min-h-0 ${
                    emailNotification
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {emailNotification ? "Đang bật" : "Tắt"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Hỗ trợ khách hàng */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Trung Tâm Hỗ Trợ
                </h2>
                <p className="text-[10px] text-slate-400">
                  Liên hệ khi cần trợ giúp về đơn hàng hoặc kỹ thuật
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:0909123456"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Hotline</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    0909.123.456
                  </div>
                </div>
              </a>

              <a
                href="mailto:support@vattudongkha.io.vn"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Email Hỗ Trợ</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    support@vattudongkha.io.vn
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
