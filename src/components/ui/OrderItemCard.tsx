"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export interface OrderItemCardProps {
  id?: string;
  title: string;
  variantTitle?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice?: number;
  unit?: string;
  image?: string | null;
  readOnly?: boolean;
  allowPriceEdit?: boolean;
  allowUnitEdit?: boolean;
  onQuantityChange?: (newQuantity: number) => void;
  onPriceChange?: (newPrice: number) => void;
  onUnitChange?: (newUnit: string) => void;
  onRemove?: () => void;
  className?: string;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  title,
  variantTitle,
  unitPrice,
  quantity,
  totalPrice,
  unit = "Cái",
  image,
  readOnly = false,
  allowPriceEdit = false,
  allowUnitEdit = false,
  onQuantityChange,
  onPriceChange,
  onUnitChange,
  onRemove,
  className = "",
}) => {
  const lineTotal = totalPrice !== undefined ? totalPrice : unitPrice * quantity;

  return (
    <div
      className={`bg-slate-50/90 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800/90 rounded-xl p-2 sm:p-2.5 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 transition-all shadow-2xs group text-left ${className}`}
    >
      {/* Row 1: Full Product Title + Variant Tag (Full width) + Remove Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {image !== undefined && (
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden relative shrink-0 flex items-center justify-center shadow-2xs mt-0.5">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4
              className="text-xs font-bold text-slate-900 dark:text-white leading-snug break-words"
              title={title}
            >
              {title}
            </h4>

            {variantTitle && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block truncate leading-tight mt-0.5">
                QC: {variantTitle}
              </span>
            )}
          </div>
        </div>

        {/* Delete Action Button on top right */}
        {!readOnly && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 p-1 rounded-md transition-colors cursor-pointer shrink-0 !min-h-0 -mr-0.5 -mt-0.5"
            title="Xóa mục này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Row 2: Unit Price (Left) <---> Quantity Stepper + Line Total (Right) */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {/* Left: Unit Price or Editable Price Input */}
        <div className="flex items-center gap-1.5 min-w-0">
          {allowPriceEdit && onPriceChange ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                step={1000}
                value={unitPrice}
                onChange={(e) => onPriceChange(Math.max(0, Number(e.target.value)))}
                className="w-20 text-left font-mono font-bold text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#075FA8]"
              />
              {allowUnitEdit && onUnitChange && (
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => onUnitChange(e.target.value)}
                  className="w-12 text-center text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded py-0.5"
                  title="Đơn vị tính"
                />
              )}
            </div>
          ) : (
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {formatCurrency(unitPrice)}
              {unit && <span className="text-slate-400 font-normal"> / {unit}</span>}
            </span>
          )}
        </div>

        {/* Right: Quantity Stepper + Line Total */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {!readOnly && onQuantityChange ? (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-5 h-5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors !min-h-0"
                title="Giảm số lượng"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>

              <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white font-mono select-none">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-5 h-5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors !min-h-0"
                title="Tăng số lượng"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
              x{quantity}
            </span>
          )}

          {/* Line Total */}
          <span className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white whitespace-nowrap min-w-[65px] sm:min-w-[80px] text-right">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
