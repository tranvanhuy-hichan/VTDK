"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";

interface ZaloMessageConfirmProps {
  message: string;
  zaloUrl: string;
  onOpened?: () => void;
}

export const ZaloMessageConfirm: React.FC<ZaloMessageConfirmProps> = ({ message, zaloUrl, onOpened }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
    navigator.clipboard
      ?.writeText(message)
      .then(() => setCopied(true))
      .catch(() => {});
  }, [message]);

  const handleCopyAgain = () => {
    navigator.clipboard
      ?.writeText(message)
      .then(() => setCopied(true))
      .catch(() => {});
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Nội dung bên dưới {copied ? "đã được copy" : "sẽ được copy"} vào bộ nhớ tạm. Bấm{" "}
        <strong className="text-slate-700 dark:text-slate-200">Mở Zalo</strong>, sau đó{" "}
        <strong className="text-slate-700 dark:text-slate-200">dán (giữ hoặc Ctrl+V)</strong> vào khung chat rồi bấm
        Gửi.
      </p>

      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line max-h-40 overflow-y-auto">
        {message}
      </div>

      <button
        type="button"
        onClick={handleCopyAgain}
        className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:underline py-1 cursor-pointer !min-h-0"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? "Đã copy nội dung" : "Sao chép nội dung"}</span>
      </button>

      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpened}
        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98"
      >
        <MessageSquare className="w-4 h-4 fill-current shrink-0" />
        <span>Mở Zalo</span>
      </a>
    </div>
  );
};
