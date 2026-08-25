"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, AlertCircle } from "lucide-react";

interface SystemNoticeBannerProps {
  storageKey?: string;
  defaultOpen?: boolean;
}

export const SystemNoticeBanner: React.FC<SystemNoticeBannerProps> = ({
  storageKey = "hide_beta_notice_v1",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem(storageKey);
      if (isDismissed === "true") {
        setIsVisible(false);
      }
    } catch {}
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 relative z-50 shadow-xs select-none animate-in fade-in duration-300">
      <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0 text-center">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md font-black text-[9px] sm:text-[10px] uppercase tracking-wider shrink-0 border border-white/30">
            <Sparkles className="w-3 h-3 text-amber-200 animate-spin-slow" />
            <span>BẢN THỬ NGHIỆM</span>
          </span>

          <p className="font-semibold text-white/95 truncate sm:overflow-visible">
            Hệ thống đang trong giai đoạn phát triển &amp; kiểm thử tính năng (Beta). Các đơn hàng thử nghiệm sẽ được xử lý nội bộ.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Đóng thông báo"
          title="Tắt thông báo phiên này"
          className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/15 transition-colors shrink-0 cursor-pointer !min-h-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
