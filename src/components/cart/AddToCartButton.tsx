"use client";

import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, type AddableCartItem } from "../../context/CartContext";
import { flyToCart } from "../../lib/flyToCart";

interface AddToCartButtonProps {
  item: AddableCartItem;
  sizeClassName?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  sizeClassName = "w-10 h-10",
}) => {
  const { isInCart, addItem, removeItem } = useCart();
  const inCart = isInCart(item.key);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (inCart) {
          removeItem(item.key);
        } else {
          addItem(item);
          flyToCart(item.image, e.currentTarget);
          setJustAdded(true);
          window.setTimeout(() => setJustAdded(false), 400);
        }
      }}
      aria-label={inCart ? "Đã thêm vào giỏ, bấm để bỏ" : "Thêm vào giỏ"}
      title={inCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
      className={`${sizeClassName} shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer !min-h-0 ${
        justAdded ? "animate-cart-pop" : ""
      } ${
        inCart
          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#075FA8] hover:text-[#075FA8] dark:hover:text-blue-400"
      }`}
    >
      {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
    </button>
  );
};
