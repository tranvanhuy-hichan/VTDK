"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X } from "lucide-react";
import { ZaloMessageConfirm } from "./ZaloMessageConfirm";

interface ZaloInquiryButtonProps {
  message: string;
  zaloUrl: string;
  className: string;
  label?: string;
}

export const ZaloInquiryButton: React.FC<ZaloInquiryButtonProps> = ({
  message,
  zaloUrl,
  className,
  label = "Liên hệ ngay",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Hỏi giá qua Zalo</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <ZaloMessageConfirm message={message} zaloUrl={zaloUrl} onOpened={() => setIsOpen(false)} />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={className}
      >
        <MessageSquare className="w-4 h-4 fill-current shrink-0" />
        <span>{label}</span>
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
