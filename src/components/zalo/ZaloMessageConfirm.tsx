"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";

const renderMessageLine = (line: string, index: number) => {
  if (/^https?:\/\//.test(line.trim())) {
    return (
      <p key={index} className="text-[#0068FF] dark:text-blue-400 break-all">
        {line.trim()}
      </p>
    );
  }
  if (line.trim().endsWith(":")) {
    return (
      <p key={index} className="font-bold text-slate-900 dark:text-white">
        {line}
      </p>
    );
  }
  if (line.trim() === "") {
    return <div key={index} className="h-2" />;
  }
  return (
    <p key={index} className="text-slate-700 dark:text-slate-300">
      {line}
    </p>
  );
};

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

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="flex items-center gap-2 bg-[#0068FF] px-3 py-2">
          <MessageSquare className="w-3.5 h-3.5 text-white fill-current shrink-0" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wide">Xem trước tin nhắn</span>
        </div>
        <div className="bg-white dark:bg-slate-800 px-3.5 py-3 text-xs sm:text-sm leading-relaxed max-h-52 overflow-y-auto">
          {message.split("\n").map(renderMessageLine)}
        </div>
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
