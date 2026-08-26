"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Bell,
  ShoppingBag,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";
import { adminCheckNewOrdersAction } from "../../actions/orderActions";
import type { OrderStatus } from "../../types/order";

interface OrderNotification {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// Synthesize pleasant chime using Web Audio API
export function playAdminChimeSound() {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

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

function timeAgo(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  } catch {
    return "Vừa xong";
  }
}

export const AdminNotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeAlert, setActiveAlert] = useState<OrderNotification | null>(null);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastKnownOrderIdRef = useRef<string | null>(null);
  const isInitialCheckRef = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-dismiss in-app toast after 10s
  useEffect(() => {
    if (!activeAlert) return;
    const t = setTimeout(() => {
      setActiveAlert(null);
    }, 10000);
    return () => clearTimeout(t);
  }, [activeAlert]);

  const triggerSystemNotification = useCallback((order: OrderNotification) => {
    try {
      const title = `📦 Đơn hàng mới: #${order.orderCode}`;
      const body = `Khách hàng: ${order.customerName} (${order.customerPhone}) • Tổng tiền: ${order.totalAmount.toLocaleString("vi-VN")} ₫`;

      if (typeof window !== "undefined" && "serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready
          .then((reg) => {
            return reg.showNotification(title, {
              body,
              icon: "/images/logo.png",
              badge: "/images/logo.png",
              data: { url: "/admin/orders" },
            });
          })
          .catch(() => {});
      } else if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          const notif = new Notification(title, {
            body,
            icon: "/images/logo.png",
          });
          notif.onclick = () => {
            window.focus();
            window.location.href = "/admin/orders";
          };
        } catch {}
      }
    } catch {}
  }, []);

  // Poll for new orders every 15 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkOrders = async () => {
      try {
        const res = await adminCheckNewOrdersAction();
        if (res.success) {
          setPendingCount(res.pendingCount);
          if (res.recentOrders) {
            setNotifications(res.recentOrders);
          }

          if (res.latestOrder) {
            const latest = res.latestOrder as OrderNotification;

            if (isInitialCheckRef.current) {
              lastKnownOrderIdRef.current = latest.id;
              isInitialCheckRef.current = false;
            } else if (lastKnownOrderIdRef.current && lastKnownOrderIdRef.current !== latest.id) {
              lastKnownOrderIdRef.current = latest.id;

              const isSoundOn = localStorage.getItem("admin_order_sound") !== "false";
              if (isSoundOn) {
                playAdminChimeSound();
              }

              triggerSystemNotification(latest);
              setActiveAlert(latest);
              document.title = `🔔 (${res.pendingCount} ĐƠN MỚI!) Quản Trị Đông Kha`;
            }
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
  }, [triggerSystemNotification]);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Bell Notification Center Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Trung tâm thông báo đơn hàng"
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer !min-h-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
      >
        <Bell className="w-4 h-4" />

        {/* Counter Badge */}
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-black text-[10px] shadow-sm animate-pulse">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer - Full Width on Mobile, Anchored on Desktop */}
      {isOpen && (
        <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 max-h-[calc(100vh-4.5rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[9999] animate-in fade-in zoom-in-95 overflow-hidden text-left">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Thông Báo Đơn Hàng
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  {pendingCount} Đơn mới
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white sm:hidden !min-h-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-bold">Chưa có thông báo đơn hàng nào</p>
              </div>
            ) : (
              notifications.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          order.status === "PENDING" ? "bg-amber-500 animate-ping" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate group-hover:text-[#075FA8] dark:group-hover:text-blue-400">
                          {order.customerName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          Đơn #{order.orderCode} • SĐT: {order.customerPhone}
                        </p>
                        <p className="text-xs font-black text-[#075FA8] dark:text-blue-400 mt-1">
                          {order.totalAmount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {timeAgo(order.createdAt)}
                      </span>
                      <span
                        className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                          order.status === "PENDING"
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {order.status === "PENDING" ? "Chờ duyệt" : "Đang xử lý"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer: View All Orders */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#075FA8] dark:text-blue-400 hover:underline py-1 w-full"
            >
              <span>Xem tất cả danh sách đơn hàng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Floating In-App Toast When New Order Arrives (Mounted to document.body via Portal) */}
      {activeAlert && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#075FA8] shadow-2xl p-3.5 sm:p-4 animate-in slide-in-from-bottom-5 duration-300 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#075FA8] to-cyan-500 text-white shadow-md animate-bounce shrink-0">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  Vừa đặt hàng!
                </span>
                <span className="text-xs font-bold text-slate-400">#{activeAlert.orderCode}</span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                {activeAlert.customerName}
              </h4>

              <p className="text-xs font-bold text-[#075FA8] dark:text-blue-400 mt-0.5 truncate">
                {activeAlert.totalAmount.toLocaleString("vi-VN")} ₫ • SĐT: {activeAlert.customerPhone}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href={`/admin/orders/${activeAlert.id}`}
                  onClick={() => {
                    setActiveAlert(null);
                    document.title = "Quản Trị Đông Kha";
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#075FA8] hover:bg-[#0B3D66] text-white text-xs font-extrabold py-1.5 px-3 rounded-xl transition-all shadow-xs active:scale-98 !min-h-0"
                >
                  <span>Xem đơn ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAlert(null);
                    document.title = "Quản Trị Đông Kha";
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
                document.title = "Quản Trị Đông Kha";
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 -mr-1 -mt-1 !min-h-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
