"use client";

import React, { useState, useEffect } from "react";
import {
  Printer,
  X,
  Plus,
  Minus,
  Tag,
  Search,
  CheckCircle2,
  Package,
} from "lucide-react";
import { getBarcodeSvgDataUrl } from "../../lib/barcode";
import { formatCurrency } from "../../lib/format";
import type { CompanyContact } from "../../lib/company";

export interface PrintableProduct {
  id: string;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  price: number;
  stock?: number | null;
  variantLabel?: string | null;
}

interface BarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: PrintableProduct[];
  company?: CompanyContact;
}

type LabelSize = "35x22" | "50x30" | "a4";

export const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({
  isOpen,
  onClose,
  products,
  company,
}) => {
  // Filter inside modal
  const [searchQuery, setSearchQuery] = useState("");

  // Map product/variant id to print quantity (default is product inventory stock)
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [labelSize, setLabelSize] = useState<LabelSize>("35x22");
  const [showPrice, setShowPrice] = useState(true);
  const [showBrand, setShowBrand] = useState(true);
  const [showSku, setShowSku] = useState(true);

  // Sync quantities with product stock whenever modal opens or products change
  useEffect(() => {
    if (isOpen) {
      const map: Record<string, number> = {};
      products.forEach((p) => {
        const initialQty = typeof p.stock === "number" && p.stock > 0 ? p.stock : 1;
        map[p.id] = initialQty;
      });
      setQuantities(map);
      setSelectedIds(new Set(products.map((p) => p.id)));
      setSearchQuery("");
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const nextVal = Math.max(1, current + delta);
      return { ...prev, [id]: nextVal };
    });
  };

  const setDirectQuantity = (id: string, rawVal: string) => {
    const val = parseInt(rawVal, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(val) ? 1 : Math.max(1, val),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered items list
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.variantLabel && p.variantLabel.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.includes(q))
    );
  });

  // Compile all individual label items based on quantity
  const labelItems: Array<{
    id: string;
    name: string;
    sku?: string | null;
    barcode: string;
    price: number;
    variantLabel?: string | null;
  }> = [];

  products.forEach((p) => {
    if (selectedIds.has(p.id)) {
      const qty = quantities[p.id] || 1;
      const barcodeValue = p.barcode || p.sku || p.id.slice(0, 12);
      for (let i = 0; i < qty; i++) {
        labelItems.push({
          id: `${p.id}-${i}`,
          name: p.name,
          sku: p.sku,
          barcode: barcodeValue,
          price: p.price,
          variantLabel: p.variantLabel,
        });
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Container Dialog */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[95vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                In Tem Mã Vạch / Barcode Decal
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                In tem theo từng phân loại • Số lượng mặc định theo tồn kho kho ({labelItems.length} con tem)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={labelItems.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer !min-h-0 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay ({labelItems.length} tem)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left settings & product list, Right print preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Controls (5 Cols) */}
          <div className="lg:col-span-5 p-3.5 sm:p-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            
            {/* Paper Size & Display Settings */}
            <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Khổ giấy in tem:</span>
                <select
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value as LabelSize)}
                  className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white"
                >
                  <option value="35x22">Decal 35x22mm (3 tem / hàng)</option>
                  <option value="50x30">Decal 50x30mm (2 tem / hàng)</option>
                  <option value="a4">Giấy A4 (Tomy 138/145)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBrand}
                    onChange={(e) => setShowBrand(e.target.checked)}
                    className="rounded text-[#075FA8]"
                  />
                  <span>Tên kho</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="rounded text-[#075FA8]"
                  />
                  <span>Giá bán</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSku}
                    onChange={(e) => setShowSku(e.target.checked)}
                    className="rounded text-[#075FA8]"
                  />
                  <span>Mã SKU</span>
                </label>
              </div>
            </div>

            {/* Product selection list */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              {/* Filter & Select All */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-700 space-y-1.5 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên hoặc quy cách..."
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2 py-1 text-slate-900 dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="hover:text-[#075FA8] cursor-pointer"
                  >
                    {selectedIds.size === products.length ? "Bỏ chọn tất cả" : "Chọn tất cả"} ({selectedIds.size}/{products.length})
                  </button>
                  <span className="text-[11px] text-slate-400">Số lượng tem in</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {filteredProducts.map((p) => {
                  const isSelected = selectedIds.has(p.id);
                  const qty = quantities[p.id] ?? (p.stock && p.stock > 0 ? p.stock : 1);
                  return (
                    <div
                      key={p.id}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(p.id)}
                          className="rounded text-[#075FA8] mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug break-words">
                            {p.name}
                            {p.variantLabel && (
                              <span className="inline-block bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 font-extrabold text-[10px] px-1.5 py-0.2 rounded ml-1">
                                {p.variantLabel}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {p.barcode || p.sku || "Chưa có barcode"} • {formatCurrency(p.price)}
                            {typeof p.stock === "number" && (
                              <span className="ml-1.5 font-sans font-bold text-emerald-600 dark:text-emerald-400">
                                (Tồn: {p.stock})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Direct Quantity Input & Quick +/- Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, -1)}
                          className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => setDirectQuantity(p.id, e.target.value)}
                          className="w-12 h-6 text-center font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8]"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, 1)}
                          className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Print Preview (7 Cols) */}
          <div className="lg:col-span-7 p-4 flex flex-col h-full overflow-y-auto bg-slate-200/60 dark:bg-slate-950/60">
            <div className="text-center text-xs font-bold text-slate-500 mb-2">
              Xem trước trang in ({labelSize === "35x22" ? "Khổ 35x22mm - 3 tem / hàng" : labelSize === "50x30" ? "Khổ 50x30mm - 2 tem / hàng" : "Khổ A4"})
            </div>

            {/* Printable Label Grid */}
            <div
              id="printable-barcode-sheet"
              className={`p-4 bg-white text-slate-900 rounded-xl shadow-md mx-auto grid gap-2.5 items-start ${
                labelSize === "35x22"
                  ? "grid-cols-3 max-w-[420px]"
                  : labelSize === "50x30"
                  ? "grid-cols-2 max-w-[420px]"
                  : "grid-cols-3 max-w-[650px]"
              }`}
            >
              {labelItems.map((item, idx) => {
                const barcodeDataUrl = getBarcodeSvgDataUrl(
                  item.barcode,
                  labelSize === "35x22" ? 38 : 46,
                  true
                );
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-1.5 border border-dashed border-slate-300 rounded flex flex-col items-center justify-between text-center bg-white overflow-hidden text-[10px] leading-tight"
                    style={{
                      width: labelSize === "35x22" ? "120px" : labelSize === "50x30" ? "180px" : "160px",
                      height: labelSize === "35x22" ? "88px" : labelSize === "50x30" ? "112px" : "102px",
                    }}
                  >
                    {showBrand && (
                      <div className="text-[8px] font-black uppercase text-[#075FA8] truncate w-full">
                        {company?.brandName || "ĐÔNG KHA"}
                      </div>
                    )}

                    {/* Product & Variant Name */}
                    <div
                      className="font-bold text-slate-900 text-[9px] sm:text-[9.5px] leading-tight break-words w-full px-0.5 line-clamp-2"
                      title={`${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""}`}
                    >
                      {item.name}
                      {item.variantLabel && (
                        <span className="text-[#075FA8] font-black ml-1">
                          ({item.variantLabel})
                        </span>
                      )}
                    </div>

                    {/* Barcode SVG Image */}
                    {barcodeDataUrl ? (
                      <img
                        src={barcodeDataUrl}
                        alt={item.barcode}
                        className="w-full max-h-9 my-0.5 object-contain"
                      />
                    ) : (
                      <div className="font-mono text-[9px] font-bold">{item.barcode}</div>
                    )}

                    <div className="flex items-center justify-between w-full text-[9px] font-bold px-1 text-slate-700">
                      {showSku && <span className="font-mono truncate">{item.sku || item.barcode}</span>}
                      {showPrice && (
                        <span className="font-black text-red-600 shrink-0">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-barcode-sheet,
          #printable-barcode-sheet * {
            visibility: visible;
          }
          #printable-barcode-sheet {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            margin: 0;
            padding: 2mm;
            box-shadow: none;
            border: none;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};
