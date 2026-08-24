"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  ShoppingBag,
  X,
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { adminCheckNewOrdersAction } from "../../actions/orderActions";

interface LatestOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  createdAt: string;
}

// Synthesize pleasant chime using Web Audio API
function playChimeSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2: 1320Hz (E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.15);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.log("Audio play error:", e);
  }
}

export const AdminOrderNotifier: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAlert, setActiveAlert] = useState<LatestOrder | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastKnownOrderIdRef = useRef<string | null>(null);
  const isInitialCheckRef = useRef(true);

  // Register Service Worker for PWA (iOS Home Screen & PC Web Push)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.log("Service Worker registration failed:", err);
        });
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerSystemNotification = useCallback((order: LatestOrder, isTest = false) => {
    const title = isTest
      ? "🔔 Thông Báo Mẫu: Đơn Hàng Mới!"
      : `📦 Đơn hàng mới: #${order.orderCode}`;
    const body = isTest
      ? "Hệ thống sẽ tự động gửi thông báo đến PC và iPhone iOS khi có khách đặt hàng."
      : `Khách hàng: ${order.customerName} (${order.customerPhone}) • Tổng tiền: ${order.totalAmount.toLocaleString("vi-VN")} ₫`;

    // Try service worker notification first (Best for iOS PWA and Android)
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/images/logo.png",
          badge: "/images/logo.png",
          data: { url: "/admin/orders" },
        });
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body,
          icon: "/images/logo.png",
        });
        notif.onclick = () => {
          window.focus();
          window.location.href = "/admin/orders";
        };
      } catch (e) {
        console.log("Standard notification error:", e);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Trình duyệt này không hỗ trợ Web Notification.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        playChimeSound();
        triggerSystemNotification(
          {
            id: "test",
            orderCode: "TEST-01",
            customerName: "Đông Kha Admin",
            customerPhone: "0905487441",
            totalAmount: 350000,
            createdAt: new Date().toISOString(),
          },
          true
        );
      }
    } catch (e) {
      console.log("Error requesting permission:", e);
    }
  };

  const handleTestAlert = () => {
    playChimeSound();
    const sampleOrder: LatestOrder = {
      id: "test-" + Date.now(),
      orderCode: "DK-" + Math.floor(1000 + Math.random() * 9000),
      customerName: "Nguyễn Văn Thử Nghiệm",
      customerPhone: "0905487441",
      totalAmount: 1250000,
      createdAt: new Date().toISOString(),
    };
    setActiveAlert(sampleOrder);
    triggerSystemNotification(sampleOrder, true);
  };

  // Poll for new orders every 15 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkOrders = async () => {
      try {
        const res = await adminCheckNewOrdersAction();
        if (res.success && res.latestOrder) {
          const latest = res.latestOrder;

          if (isInitialCheckRef.current) {
            lastKnownOrderIdRef.current = latest.id;
            isInitialCheckRef.current = false;
          } else if (lastKnownOrderIdRef.current && lastKnownOrderIdRef.current !== latest.id) {
            lastKnownOrderIdRef.current = latest.id;

            if (soundEnabled) {
              playChimeSound();
            }

            triggerSystemNotification(latest);
            setActiveAlert(latest);
            document.title = `🔔 (1 ĐƠN MỚI!) Bảng Quản Trị Đông Kha`;
          }
        }
      } catch (e) {
        console.log("Order check poll error:", e);
      }
    };

    checkOrders();
    timer = setInterval(checkOrders, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [soundEnabled, triggerSystemNotification]);

  const isGranted = permission === "granted";

  return (
    <div className="relative shrink-0" ref={menuRef}>
      {/* Smart Bell Icon Button */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Cài đặt thông báo đơn hàng"
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer !min-h-0 border ${
          isGranted
            ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            : "bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse"
        }`}
      >
        {isGranted ? (
          <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <BellRing className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
        )}

        <span className="hidden sm:inline">
          {isGranted ? "Thông báo đơn" : "Bật thông báo"}
        </span>

        {/* Status dot */}
        <span
          className={`w-2 h-2 rounded-full ${
            isGranted ? "bg-emerald-500" : "bg-amber-500 animate-ping"
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Thông Báo Đơn Hàng
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 !min-h-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Permission Status */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Trạng thái:</span>
              {isGranted ? (
                <span className="inline-flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã bật thông báo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Chưa cấp quyền
                </span>
              )}
            </div>

            {!isGranted && (
              <button
                type="button"
                onClick={requestPermission}
                className="w-full py-1.5 px-3 rounded-lg bg-[#075FA8] hover:bg-[#0B3D66] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer !min-h-0 text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Cho phép nhận thông báo</span>
              </button>
            )}
          </div>

          {/* Controls: Sound toggle & Test alert */}
          <div className="space-y-1.5">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0 text-left"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Chuông âm thanh</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  soundEnabled
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {soundEnabled ? "Bật" : "Tắt"}
              </span>
            </button>

            {/* Test Notification Button */}
            <button
              type="button"
              onClick={handleTestAlert}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0 text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Thử chuông &amp; thông báo</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Thử ngay ➔
              </span>
            </button>
          </div>

          {/* Guide Note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            💡 <strong>Mẹo:</strong> Nhấn <em>&quot;Thử chuông&quot;</em> để nghe âm thanh Ding-Dong và xem trước thông báo đơn hàng trên máy.
          </div>
        </div>
      )}

      {/* Floating In-App New Order Toast Alert */}
      {activeAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#075FA8] shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#075FA8] to-cyan-500 text-white shadow-md animate-bounce shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  Vừa đặt hàng!
                </span>
                <span className="text-xs font-bold text-slate-400">#{activeAlert.orderCode}</span>
              </div>

              <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                {activeAlert.customerName}
              </h4>

              <p className="text-xs font-bold text-[#075FA8] dark:text-blue-400 mt-0.5">
                {activeAlert.totalAmount.toLocaleString("vi-VN")} ₫ • SĐT: {activeAlert.customerPhone}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/admin/orders"
                  onClick={() => {
                    setActiveAlert(null);
                    document.title = "Bảng Quản Trị Đông Kha";
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#075FA8] hover:bg-[#0B3D66] text-white text-xs font-extrabold py-1.5 px-3 rounded-xl transition-all shadow-sm active:scale-98 !min-h-0"
                >
                  <span>Xem đơn ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAlert(null);
                    document.title = "Bảng Quản Trị Đông Kha";
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1.5 px-2 rounded-xl transition-colors cursor-pointer !min-h-0"
                >
                  Đóng
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveAlert(null);
                document.title = "Bảng Quản Trị Đông Kha";
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 -mr-1 -mt-1 !min-h-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
