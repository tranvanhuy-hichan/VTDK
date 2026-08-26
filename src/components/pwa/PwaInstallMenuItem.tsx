"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaInstallMenuItemProps {
  onItemClick?: () => void;
  className?: string;
}

export const PwaInstallMenuItem: React.FC<PwaInstallMenuItemProps> = ({
  onItemClick,
  className = "",
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (PWA installed)
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture standard install prompt on Chrome/Android/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // If already installed and opened inside PWA standalone app, hide button
  if (isStandalone) {
    return null;
  }

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (deferredPrompt) {
      // Native Android/Chrome install prompt
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
      if (onItemClick) onItemClick();
    } else if (isIos) {
      // Show iOS step-by-step installation instructions
      setShowIosModal(true);
    } else {
      // Fallback instructions for mobile browsers
      setShowIosModal(true);
    }
  };

  return (
    <>
      {/* Nút cài đặt ứng dụng - Ẩn trên Desktop (md:hidden hoặc lg:hidden) */}
      <button
        type="button"
        onClick={handleInstallClick}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#075FA8] dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 transition-colors cursor-pointer !min-h-0 text-left md:hidden ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Smartphone className="w-4 h-4 text-[#075FA8] dark:text-cyan-400 shrink-0" />
          <span className="truncate">Cài đặt Ứng dụng (App)</span>
        </div>
        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#075FA8] text-white shrink-0">
          Cài đặt
        </span>
      </button>

      {/* iOS / Mobile Step-by-Step Installation Modal */}
      {showIosModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowIosModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-4 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#075FA8]/10 text-[#075FA8] dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Cài đặt Ứng dụng (App)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Thêm vào màn hình chính điện thoại
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Để cài đặt ứng dụng và mở toàn màn hình mà không cần App Store, bạn thực hiện 2 bước đơn giản:
              </p>

              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#075FA8] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="leading-snug">
                    <span>Nhấn vào biểu tượng </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      <Share className="w-3 h-3 text-[#075FA8] dark:text-cyan-400" /> Chia sẻ
                    </span>
                    <span> ở thanh dưới cùng của trình duyệt Safari/Chrome.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#075FA8] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="leading-snug">
                    <span>Cuộn xuống và chọn </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      <PlusSquare className="w-3 h-3 text-emerald-600" /> Thêm vào MH chính
                    </span>
                    <span> (Add to Home Screen).</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Mở App siêu tốc, đầy đủ chức năng và không tốn dung lượng!</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 px-4 bg-[#075FA8] hover:bg-[#0B3D66] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
