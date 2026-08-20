"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calculator, X } from "lucide-react";
import { BTUCalculatorBox } from "./BTUCalculator";

interface BTUCalculatorModalProps {
  buttonClassName?: string;
}

export const BTUCalculatorModal: React.FC<BTUCalculatorModalProps> = ({ buttonClassName }) => {
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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-slate-50 dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              Tính công suất máy lạnh &amp; kích thước ống đồng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Giúp chủ nhà và anh em thợ chọn đúng quy cách ống đồng lắp đặt.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Đóng"
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-5">
          <BTUCalculatorBox />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ||
          "inline-flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-2xs transition-all cursor-pointer !min-h-0 w-full sm:w-auto"
        }
      >
        <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="sm:hidden">Tính công suất</span>
        <span className="hidden sm:inline">Tính công suất máy &amp; ống đồng</span>
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
