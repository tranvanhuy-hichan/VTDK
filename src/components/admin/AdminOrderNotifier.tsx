"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell, BellRing, ShoppingBag, X, ArrowRight, Volume2, VolumeX } from "lucide-react";
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
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
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
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.log("Audio autoplay prevented or unsupported:", e);
  }
}

export const AdminOrderNotifier: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAlert, setActiveAlert] = useState<LatestOrder | null>(null);
  const lastKnownOrderIdRef = useRef<string | null>(null);
  const isInitialCheckRef = useRef(true);

  // Register Service Worker for PWA (iOS Home Screen & PC Web Push)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered for Admin Push:", reg.scope);
        })
        .catch((err) => {
          console.log("Service Worker registration failed:", err);
        });
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        triggerSystemNotification({
          id: "test",
          orderCode: "TEST-01",
          customerName: "Quản trị viên",
          customerPhone: "0905487441",
          totalAmount: 500000,
          createdAt: new Date().toISOString(),
        }, true);
      }
    } catch (e) {
      console.log("Error requesting notification permission:", e);
    }
  };

  const triggerSystemNotification = useCallback((order: LatestOrder, isTest = false) => {
    const title = isTest 
      ? "🔔 Thông Báo Đơn Hàng Đã Được Kích Hoạt!"
      : `📦 Đơn hàng mới: #${order.orderCode}`;
    const body = isTest
      ? "Hệ thống sẽ tự động gửi thông báo đến máy tính và điện thoại iOS khi có đơn hàng mới."
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
      // Fallback to standard browser notification
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

  // Poll for new orders every 15 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkOrders = async () => {
      try {
        const res = await adminCheckNewOrdersAction();
        if (res.success && res.latestOrder) {
          const latest = res.latestOrder;

          if (isInitialCheckRef.current) {
            // First run on page load: record the latest order without alerting
            lastKnownOrderIdRef.current = latest.id;
            isInitialCheckRef.current = false;
          } else if (lastKnownOrderIdRef.current && lastKnownOrderIdRef.current !== latest.id) {
            // A brand new order arrived!
            lastKnownOrderIdRef.current = latest.id;

            // 1. Play sound
            if (soundEnabled) {
              playChimeSound();
            }

            // 2. System / Web Push Notification
            triggerSystemNotification(latest);

            // 3. In-App Floating Toast Alert
            setActiveAlert(latest);

            // 4. Update Document Title with badge
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

  return (
    <>
      {/* Top Header Notification Status & Sound Toggle */}
      <div className="flex items-center gap-1.5">
        {permission !== "granted" ? (
          <button
            type="button"
            onClick={requestNotificationPermission}
            title="Bật chuông thông báo đơn hàng mới"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-extrabold transition-all cursor-pointer !min-h-0 animate-pulse"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bật chuông báo đơn</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Đang bật âm thanh đơn hàng" : "Đang tắt âm thanh"}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer !min-h-0 ${
              soundEnabled
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

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
    </>
  );
};
