"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Volume2,
  VolumeX,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Play,
  ShieldCheck,
  Server,
  Database,
  Globe,
  Zap,
} from "lucide-react";
import { playAdminChimeSound } from "./AdminNotificationCenter";

export const AdminSettingsManager: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");

      const soundPref = localStorage.getItem("admin_order_sound");
      if (soundPref === "false") {
        setIsSoundEnabled(false);
      }

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission) {
        setPermission(Notification.permission);
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

  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    localStorage.setItem("admin_order_sound", next ? "true" : "false");
    if (next) {
      playAdminChimeSound();
    }
  };

  const handleTestSound = () => {
    setIsTestingSound(true);
    playAdminChimeSound();
    setTimeout(() => setIsTestingSound(false), 1000);
  };

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushStatusMsg({
        type: "error",
        text: "Trình duyệt không hỗ trợ Web Notification API.",
      });
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        playAdminChimeSound();
        setPushStatusMsg({
          type: "success",
          text: "Đã cấp quyền thông báo thành công!",
        });
      } else {
        setPushStatusMsg({
          type: "error",
          text: "Quyền thông báo bị từ chối.",
        });
      }
    } catch (e) {
      setPushStatusMsg({
        type: "error",
        text: "Không thể yêu cầu quyền thông báo.",
      });
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 text-left animate-in fade-in duration-200 max-w-4xl">
      {/* Header Banner - Compact */}
      <div className="bg-gradient-to-r from-[#075FA8] to-[#043E70] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[10px] font-extrabold uppercase tracking-wider text-cyan-200 border border-white/10">
              <Settings className="w-3 h-3" />
              <span>Cấu Hình Trung Tâm</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">Cài Đặt Hệ Thống</h1>
            <p className="text-xs text-blue-100/90">
              Tùy chỉnh giao diện, âm thanh báo đơn mới và hạ tầng quản trị.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>Đông Kha PRO Engine</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Âm thanh & Thông báo đơn */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-black shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Âm Thanh &amp; Thông Báo Đơn
              </h2>
              <p className="text-[10px] text-slate-400">
                Chuông báo Web Audio khi có đơn mới
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {/* Sound Switcher */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {isSoundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Chuông báo đơn mới</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Phát chuông Web Audio khi có khách đặt hàng
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTestSound}
                  disabled={isTestingSound}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer !min-h-0"
                >
                  <Play className={`w-2.5 h-2.5 text-[#075FA8] dark:text-blue-400 ${isTestingSound ? "animate-spin" : ""}`} />
                  <span>{isTestingSound ? "Đang phát..." : "Thử chuông"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer !min-h-0 ${
                    isSoundEnabled
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {isSoundEnabled ? "Bật" : "Tắt"}
                </button>
              </div>
            </div>

            {/* Web Push Notification */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                    <span>Thông báo Web Push</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Nhận thông báo nổi kể cả khi chuyển tab
                  </p>
                </div>

                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    permission === "granted"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : permission === "denied"
                      ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {permission === "granted" ? "Đã cấp" : permission === "denied" ? "Từ chối" : "Chưa cấp"}
                </span>
              </div>

              {permission !== "granted" && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full py-1.5 px-2 rounded-lg bg-[#075FA8] hover:bg-[#0B3D66] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer !min-h-0 shadow-xs"
                >
                  <Bell className="w-3 h-3" />
                  <span>Kích hoạt quyền thông báo</span>
                </button>
              )}

              {pushStatusMsg && (
                <div
                  className={`p-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                    pushStatusMsg.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                  }`}
                >
                  {pushStatusMsg.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{pushStatusMsg.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Giao diện sáng / tối */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center font-black shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Giao Diện Hệ Thống
              </h2>
              <p className="text-[10px] text-slate-400">
                Tùy chỉnh chế độ hiển thị Admin
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Light Mode Option */}
            <button
              type="button"
              onClick={() => handleToggleTheme("light")}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer space-y-1.5 !min-h-0 ${
                theme === "light"
                  ? "border-[#075FA8] bg-blue-50/50 dark:bg-blue-950/30 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                {theme === "light" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Giao diện sáng
                </div>
                <p className="text-[10px] text-slate-400">Tông màu trắng sáng</p>
              </div>
            </button>

            {/* Dark Mode Option */}
            <button
              type="button"
              onClick={() => handleToggleTheme("dark")}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer space-y-1.5 !min-h-0 ${
                theme === "dark"
                  ? "border-[#075FA8] bg-blue-50/50 dark:bg-blue-950/30 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                {theme === "dark" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Giao diện tối
                </div>
                <p className="text-[10px] text-slate-400">Dịu mắt ban đêm</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Hạ tầng & Kết nối */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              Hạ Tầng &amp; Kết Nối
            </h2>
            <p className="text-[10px] text-slate-400">
              Trạng thái máy chủ và cơ sở dữ liệu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Cơ sở dữ liệu</div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Online</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Tên miền</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                vattudongkha.io.vn
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Phiên bản</div>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                Đông Kha PRO v2.5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
