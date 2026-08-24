"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ShoppingCart, Check, X, Minus, Plus, Zap } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { flyToCart } from "../../lib/flyToCart";
import { formatCurrency } from "../../lib/format";

interface VariantOption {
  id: string;
  label: string;
  price: number;
}

interface AddToCartOptionsButtonProps {
  product: {
    slug: string;
    name: string;
    image: string;
    price: number;
  };
  variants: VariantOption[];
  sizeClassName?: string;
  mode?: "icon" | "full" | "buy_now";
  label?: string;
}

export const AddToCartOptionsButton: React.FC<AddToCartOptionsButtonProps> = ({
  product,
  variants,
  sizeClassName = "w-10 h-10",
  mode = "icon",
  label = "Mua ngay",
}) => {
  const router = useRouter();
  const { addItem, setCheckoutItems } = useCart();
  const { user, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

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

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const unitPrice = selectedVariant ? selectedVariant.price : product.price;

  const triggerBuyNowAction = (chosenQty: number = qty, chosenVariant = selectedVariant) => {
    const price = chosenVariant ? chosenVariant.price : product.price;
    const variantLabel = chosenVariant?.label;
    const key = variantLabel ? `${product.slug}::${variantLabel}` : product.slug;

    const item = {
      key,
      slug: product.slug,
      name: product.name,
      variantLabel,
      price,
      image: product.image,
      qty: chosenQty,
    };

    setCheckoutItems([item]);
    setIsOpen(false);

    if (!user) {
      router.push("/dang-nhap?redirect=/thanh-toan");
    } else {
      router.push("/thanh-toan");
    }

  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.role === "ADMIN") {
      alert("Tài khoản Quản trị viên chỉ có quyền xem và quản lý, không thể đặt hàng.");
      return;
    }
    if (mode === "buy_now" && variants.length === 0) {
      triggerBuyNowAction(1, undefined);
      return;
    }
    setSelectedVariantId(variants[0]?.id ?? null);
    setQty(1);
    setIsOpen(true);
  };


  const handleAddToCart = () => {
    const price = unitPrice;
    const variantLabel = selectedVariant?.label;
    const key = variantLabel ? `${product.slug}::${variantLabel}` : product.slug;

    addItem(
      {
        key,
        slug: product.slug,
        name: product.name,
        variantLabel,
        price,
        image: product.image,
      },
      qty
    );

    if (triggerRef.current) {
      flyToCart(product.image, triggerRef.current);
    }

    setIsOpen(false);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    triggerBuyNowAction(qty, selectedVariant);
  };

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
          </div>
          <h3 className="flex-1 min-w-0 text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
            {product.name}
          </h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng"
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {variants.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quy cách / Phân loại
              </span>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`!min-h-0 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
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
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Số lượng
            </span>
            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Giảm số lượng"
                className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer !min-h-0"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Tăng số lượng"
                className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer !min-h-0"
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
                {formatCurrency(unitPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">
                Tổng cộng
              </span>
              <span className="text-base font-black text-orange-600 dark:text-orange-400">
                {unitPrice > 0 ? formatCurrency(unitPrice * qty) : "Liên hệ báo giá"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer !min-h-0"
            >
              <ShoppingCart className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <span>Thêm giỏ</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-3 px-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer !min-h-0"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Mua ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (mode === "buy_now") {
    return (
      <>
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className="flex-1 min-w-0 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer !min-h-0"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300 shrink-0" />
          <span>{label}</span>
        </button>
        {mounted && modalContent && createPortal(modalContent, document.body)}
      </>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-label="Thêm vào giỏ"
        title="Thêm vào giỏ"
        className={`${sizeClassName} shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer !min-h-0 ${
          justAdded
            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 animate-cart-pop"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#075FA8] hover:text-[#075FA8] dark:hover:text-blue-400"
        }`}
      >
        {justAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
