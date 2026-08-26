"use client";

import React, { useState, useMemo } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageSquare,
  X,
  ShieldCheck,
} from "lucide-react";
import type { CartItem } from "../../types/cart";
import { formatCurrency } from "../../lib/format";

interface ShareCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  companyName?: string;
  hotline?: string;
}

export interface SharedCartPayload {
  items: {
    k: string; // key
    n: string; // name
    s: string; // slug
    p: number; // price
    q: number; // quantity
    img: string; // image
    vl?: string; // variantLabel
  }[];
  t: number; // timestamp
  by?: string; // sender note
}

/**
 * Encode cart items into a compact, URL-safe base64 string
 */
export function encodeCartForSharing(items: CartItem[], senderName?: string): string {
  try {
    const payload: SharedCartPayload = {
      items: items.map((i) => ({
        k: i.key,
        n: i.name,
        s: i.slug,
        p: i.price,
        q: i.qty,
        img: i.image,
        vl: i.variantLabel || undefined,
      })),
      t: Date.now(),
      by: senderName || undefined,
    };
    const json = JSON.stringify(payload);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch (e) {
    console.error("Failed to encode cart for sharing:", e);
    return "";
  }
}

/**
 * Decode cart payload from base64 string
 */
export function decodeCartFromSharing(encodedStr: string): CartItem[] | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
    const parsed: SharedCartPayload = JSON.parse(json);
    if (!parsed || !Array.isArray(parsed.items)) return null;

    return parsed.items.map((i) => ({
      key: i.k || `${i.s}-${i.vl || "default"}`,
      name: i.n,
      slug: i.s,
      price: i.p,
      qty: Math.max(1, i.q || 1),
      image: i.img,
      variantLabel: i.vl,
    }));
  } catch (e) {
    console.error("Failed to decode cart from sharing:", e);
    return null;
  }
}

export const ShareCartModal: React.FC<ShareCartModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [copied, setCopied] = useState(false);
  const [senderNote] = useState("");

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || items.length === 0) return "";
    const encoded = encodeCartForSharing(items, senderNote);
    return `${window.location.origin}/gio-hang?share=${encoded}`;
  }, [items, senderNote]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.getElementById("share-url-input") as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleShareZalo = () => {
    if (!shareUrl) return;
    const itemsSummary = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} - SL: ${i.qty} x ${formatCurrency(i.price)}`
      )
      .join("\n");

    const message = `📋 BÁO GIÁ / DANH SÁCH VẬT TƯ:\n${itemsSummary}\n\n👉 TỔNG TIỀN: ${formatCurrency(totalAmount)}\n🔗 Xem giỏ hàng & đặt mua trực tiếp: ${shareUrl}`;

    navigator.clipboard.writeText(message);
    window.open(
      `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(
        `Danh sách vật tư điện lạnh (${items.length} món) - Tổng ${formatCurrency(totalAmount)}`
      )}`,
      "_blank"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-slate-50 dark:from-slate-800/60 dark:to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#075FA8] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Chia Sẻ Giỏ Hàng &amp; Báo Giá
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gửi liên kết cho chủ nhà, thợ hoặc khách hàng duyệt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer !min-h-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Summary Preview Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Danh sách vật tư ({items.length} món)</span>
              <span className="text-[#075FA8] dark:text-blue-400 font-extrabold">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-[10px] text-slate-400 truncate">{item.variantLabel}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-slate-500">x{item.qty}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white ml-2">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Link Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Đường dẫn xem giỏ hàng trực tiếp</span>
              <span className="text-[10px] text-slate-400 font-normal">
                (Người nhận không cần đăng nhập vẫn xem được)
              </span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="share-url-input"
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer !min-h-0 ${
                  copied
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-[#075FA8] hover:bg-[#0B1F33] text-white shadow-xs"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Đã chép!" : "Sao chép"}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShareZalo}
              className="inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gửi qua Zalo</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy link gửi tin nhắn</span>
            </button>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-[#075FA8] dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Lợi ích khi chia sẻ giỏ hàng:</span>
            </div>
            <p>
              • Người nhận bấm vào link sẽ thấy nguyên danh sách vật tư đã chọn với giá sỉ chuẩn.
            </p>
            <p>• Họ có thể bấm <b>"Thanh toán ngay"</b> hoặc <b>"Tải báo giá PDF"</b> trực tiếp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
