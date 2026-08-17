"use client";

import React, { useState, useEffect } from "react";
import { Calculator, X } from "lucide-react";
import { BTUCalculatorBox } from "./BTUCalculator";

export const BTUCalculatorModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="!min-h-0 inline-flex items-center gap-1.5 text-[#075FA8] hover:text-[#0B1F33] font-bold text-xs sm:text-sm underline underline-offset-2 decoration-blue-200 hover:decoration-[#0B1F33] transition-colors"
      >
        <Calculator className="w-3.5 h-3.5" />
        <span>Tính công suất máy lạnh &amp; ống đồng</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-slate-50 rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Tính công suất máy lạnh &amp; kích thước ống đồng
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Giúp chủ nhà và anh em thợ chọn đúng quy cách ống đồng lắp đặt.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Đóng"
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors !min-h-0 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <BTUCalculatorBox />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
