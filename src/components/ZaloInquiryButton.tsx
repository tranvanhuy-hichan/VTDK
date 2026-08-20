"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPortal } from "react-dom";
import { MessageSquare, X, Check, Minus, Plus } from "lucide-react";
import { ZaloMessageConfirm } from "./ZaloMessageConfirm";
import { useCart, type AddableCartItem } from "../context/CartContext";

interface VariantOption {
  id: string;
  label: string;
  price: number;
}

interface PickerConfig {
  product: { slug: string; name: string; image: string; price: number };
  variants: VariantOption[];
}

interface PickedOption {
  variantLabel?: string;
  price: number;
  qty: number;
}

interface ZaloInquiryButtonProps {
  buildMessage: (picked?: PickedOption) => string;
  checkoutItem?: AddableCartItem;
  picker?: PickerConfig;
  zaloUrl: string;
  className: string;
  label?: string;
  mobileLabel?: string;
  iconOnly?: boolean;
  requireBuyerInfo?: boolean;
}

export const ZaloInquiryButton: React.FC<ZaloInquiryButtonProps> = ({
  buildMessage,
  checkoutItem,
  picker,
  zaloUrl,
  className,
  label = "Liên hệ ngay",
  mobileLabel,
  iconOnly = false,
  requireBuyerInfo = false,
}) => {
  const router = useRouter();
  const { setCheckoutItems } = useCart();
  const [view, setView] = useState<"closed" | "picker" | "confirm">("closed");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(picker?.variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (view === "closed") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView("closed");
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [view]);

  const selectedVariant = picker?.variants.find((v) => v.id === selectedVariantId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (picker) {
      setSelectedVariantId(picker.variants[0]?.id ?? null);
      setQty(1);
      setView("picker");
      return;
    }
    if (requireBuyerInfo && checkoutItem) {
      setCheckoutItems([{ ...checkoutItem, qty: 1 }]);
      router.push("/thanh-toan");
      return;
    }
    setMessage(buildMessage());
    setView("confirm");
  };

  const handlePickerContinue = () => {
    if (!picker) return;
    const price = selectedVariant ? selectedVariant.price : picker.product.price;
    const variantLabel = selectedVariant?.label;
    const key = variantLabel ? `${picker.product.slug}::${variantLabel}` : picker.product.slug;

    if (requireBuyerInfo) {
      setCheckoutItems([
        {
          key,
          slug: picker.product.slug,
          name: picker.product.name,
          variantLabel,
          price,
          image: picker.product.image,
          qty,
        },
      ]);
      router.push("/thanh-toan");
      setView("closed");
      return;
    }

    setMessage(buildMessage({ variantLabel, price, qty }));
    setView("confirm");
  };

  const modalContent =
    view !== "closed" ? (
      <div
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left"
        onClick={() => setView("closed")}
      >
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            {view === "picker" && picker && (
              <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <Image src={picker.product.image} alt={picker.product.name} fill sizes="56px" className="object-cover" />
              </div>
            )}
            <h3 className="flex-1 min-w-0 text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
              {view === "picker" && picker ? picker.product.name : "Hỏi giá qua Zalo"}
            </h3>
            <button
              type="button"
              onClick={() => setView("closed")}
              aria-label="Đóng"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {view === "picker" && picker ? (
              <div className="space-y-4">
                {picker.variants.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Quy cách / Phân loại
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {picker.variants.map((variant) => {
                        const isSelected = variant.id === selectedVariantId;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={`!min-h-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-950/80 border-2 border-[#075FA8] dark:border-blue-500 text-[#075FA8] dark:text-blue-300 shadow-2xs"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            <span>{variant.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Số lượng
                  </span>
                  <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Giảm số lượng"
                      className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Tăng số lượng"
                      className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer !min-h-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
                      Đơn giá
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {(selectedVariant ? selectedVariant.price : picker.product.price) > 0
                        ? `${(selectedVariant ? selectedVariant.price : picker.product.price).toLocaleString("vi-VN")}đ`
                        : "Liên hệ báo giá"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
                      Thành tiền
                    </span>
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                      {(selectedVariant ? selectedVariant.price : picker.product.price) > 0
                        ? `${((selectedVariant ? selectedVariant.price : picker.product.price) * qty).toLocaleString("vi-VN")}đ`
                        : "Liên hệ báo giá"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePickerContinue}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98"
                >
                  <span>Tiếp tục</span>
                </button>
              </div>
            ) : (
              <ZaloMessageConfirm message={message} zaloUrl={zaloUrl} onOpened={() => setView("closed")} />
            )}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button type="button" onClick={handleClick} aria-label={label} className={className}>
        <MessageSquare className="w-4 h-4 fill-current shrink-0" />
        {!iconOnly &&
          (mobileLabel ? (
            <>
              <span className="sm:hidden">{mobileLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            <span>{label}</span>
          ))}
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
