"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Trash2,
  FileText,
  Printer,
  Building2,
  User,
  Phone,
  MapPin,
  FileSpreadsheet,
  Check,
  RefreshCw,
  PlusCircle,
  Sparkles,
  Layers,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import {
  PrintableQuoteModal,
  readVNDInWords,
  type QuoteItem,
} from "@/components/quote/PrintableQuoteModal";
import type { Category, Product, ProductVariant } from "@prisma/client";

interface ProductWithRelations extends Product {
  category: Category;
  variants: ProductVariant[];
}

interface AdminQuotationBuilderProps {
  products: ProductWithRelations[];
  categories: Category[];
}

interface QuoteDraftItem extends QuoteItem {
  categoryName?: string;
  isCustom?: boolean;
}

const LOCAL_STORAGE_KEY = "vtdk_admin_quote_draft_v1";
const ITEMS_PER_PAGE = 10;

export const AdminQuotationBuilder: React.FC<AdminQuotationBuilderProps> = ({
  products,
  categories,
}) => {
  // 1. Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Right Panel Tab State: 'items' | 'customer'
  const [rightTab, setRightTab] = useState<"items" | "customer">("items");

  // 2. Quote Items State
  const [quoteItems, setQuoteItems] = useState<QuoteDraftItem[]>([]);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // 3. Customer & Quote Metadata State
  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerTaxCode, setCustomerTaxCode] = useState("");
  const [vatRate, setVatRate] = useState<number>(0); // Default: 0% VAT
  const [validDays, setValidDays] = useState<number>(15);
  const [quoteNote, setQuoteNote] = useState(
    "Giá đã bao gồm chiết khấu đại lý. Hỗ trợ giao hàng tận nơi hoặc gửi chành xe toàn quốc."
  );

  // 4. Custom Item Modal / Inline Form State
  const [isAddingCustomItem, setIsAddingCustomItem] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customVariant, setCustomVariant] = useState("");
  const [customUnit, setCustomUnit] = useState("Cái");
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [customQty, setCustomQty] = useState<number>(1);

  // 5. Selected Variants for products on catalog
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // 6. Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load draft from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.items && Array.isArray(parsed.items)) {
          setQuoteItems(parsed.items);
        }
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.customerCompany) setCustomerCompany(parsed.customerCompany);
        if (parsed.customerPhone) setCustomerPhone(parsed.customerPhone);
        if (parsed.customerAddress) setCustomerAddress(parsed.customerAddress);
        if (parsed.customerTaxCode) setCustomerTaxCode(parsed.customerTaxCode);
        if (typeof parsed.vatRate === "number") setVatRate(parsed.vatRate);
        if (typeof parsed.validDays === "number") setValidDays(parsed.validDays);
        if (parsed.quoteNote) setQuoteNote(parsed.quoteNote);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save draft to localStorage whenever changes occur
  useEffect(() => {
    try {
      const draft = {
        items: quoteItems,
        customerName,
        customerCompany,
        customerPhone,
        customerAddress,
        customerTaxCode,
        vatRate,
        validDays,
        quoteNote,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore localStorage errors
    }
  }, [
    quoteItems,
    customerName,
    customerCompany,
    customerPhone,
    customerAddress,
    customerTaxCode,
    vatRate,
    validDays,
    quoteNote,
  ]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "ALL" || p.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Calculations
  const subtotal = useMemo(() => {
    return quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [quoteItems]);

  const vatAmount = useMemo(() => {
    return Math.round(subtotal * (vatRate / 100));
  }, [subtotal, vatRate]);

  const grandTotal = useMemo(() => {
    return subtotal + vatAmount;
  }, [subtotal, vatAmount]);

  // Add standard product to quote
  const handleAddProduct = (product: ProductWithRelations) => {
    const hasVariants = product.variants && product.variants.length > 0;
    const selectedVariantId =
      selectedVariants[product.id] || (hasVariants ? product.variants[0].id : undefined);
    const variant = hasVariants
      ? product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]
      : undefined;

    const price = variant ? variant.price : product.price;
    const variantTitle = variant ? variant.label : undefined;
    const itemId = variant ? `${product.id}-${variant.id}` : product.id;

    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          name: product.name,
          variantTitle,
          unit: "Cái",
          quantity: 1,
          price,
          image: product.image,
          categoryName: product.category.name,
        },
      ];
    });

    setAddedAnimationId(itemId);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  // Add custom line item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || customPrice === "" || customPrice < 0) {
      alert("Vui lòng nhập tên vật tư/dịch vụ và đơn giá hợp lệ.");
      return;
    }

    const newItem: QuoteDraftItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: customName.trim(),
      variantTitle: customVariant.trim() || undefined,
      unit: customUnit.trim() || "Cái",
      price: Number(customPrice),
      quantity: Math.max(1, customQty),
      isCustom: true,
      categoryName: "Vật tư / Dịch vụ ngoài",
    };

    setQuoteItems((prev) => [...prev, newItem]);
    setCustomName("");
    setCustomVariant("");
    setCustomPrice("");
    setCustomQty(1);
    setIsAddingCustomItem(false);
  };

  // Update item quantity
  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setQuoteItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  };

  // Update item unit price
  const handleUpdatePrice = (id: string, newPrice: number) => {
    if (newPrice < 0) return;
    setQuoteItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, price: newPrice } : i))
    );
  };

  // Update item unit label
  const handleUpdateUnit = (id: string, newUnit: string) => {
    setQuoteItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unit: newUnit } : i))
    );
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Clear all items
  const handleClearQuote = () => {
    if (
      quoteItems.length > 0 &&
      !confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách báo giá hiện tại để tạo mới?")
    ) {
      return;
    }
    setQuoteItems([]);
    setCustomerName("");
    setCustomerCompany("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerTaxCode("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-3 overflow-hidden text-left pb-1">
      {/* 1. Compact Header Banner (Fixed height) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075FA8] to-[#0B3D66] text-white flex items-center justify-center shadow-xs shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Tạo Báo Giá B2B
              </h1>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 text-[9px] font-black uppercase tracking-wider">
                Quotation Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Chọn nhanh sản phẩm từ kho, tùy biến đơn giá chiết khấu, thông tin đối tác và xuất file báo giá chuẩn A4.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearQuote}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer !min-h-0"
            title="Làm mới toàn bộ bảng báo giá"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            disabled={quoteItems.length === 0}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#075FA8] to-[#0a4d87] hover:from-[#0B3D66] hover:to-[#075FA8] text-white text-xs font-black shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer !min-h-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xem &amp; Xuất Báo Giá A4 ({quoteItems.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Fills remaining height, 0 outer scroll) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 overflow-hidden">
        
        {/* LEFT COLUMN: Product Catalog Picker (7 cols) - Independent Scroll */}
        <div className="lg:col-span-7 h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-2.5 overflow-hidden">
          
          {/* Pinned Top Controls on Left Side */}
          <div className="space-y-2.5 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  Kho Sản Phẩm &amp; Vật Tư
                </h2>
              </div>

              {/* Add Custom Item Button */}
              <button
                type="button"
                onClick={() => setIsAddingCustomItem(!isAddingCustomItem)}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer !min-h-0 self-start sm:self-auto"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Thêm vật tư/dịch vụ ngoài</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm theo tên, quy cách..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8]/30 focus:border-[#075FA8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
                  selectedCategory === "ALL"
                    ? "bg-[#075FA8] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                Tất cả ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#075FA8] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Custom Item Quick Form Drawer */}
            {isAddingCustomItem && (
              <form
                onSubmit={handleAddCustomItem}
                className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Thêm Hạng Mục / Dịch Vụ Ngoài Danh Mục</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomItem(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Đóng
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Tên vật tư / Dịch vụ (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="VD: Nhân công thi công lắp đặt máy lạnh VRV..."
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Quy cách / Ghi chú:
                    </label>
                    <input
                      type="text"
                      value={customVariant}
                      onChange={(e) => setCustomVariant(e.target.value)}
                      placeholder="VD: Trọn gói 2 tổ máy..."
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      ĐVT:
                    </label>
                    <input
                      type="text"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      placeholder="Cái / Bộ / Gói..."
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Đơn giá (VNĐ) (*):
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={customPrice}
                      onChange={(e) =>
                        setCustomPrice(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="VD: 500000"
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Số lượng:
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-0.5">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer !min-h-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm vào bảng báo giá</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Product Catalog Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px]">
            {paginatedProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
              paginatedProducts.map((p) => {
                const hasVariants = p.variants && p.variants.length > 0;
                const currentVariantId = selectedVariants[p.id] || (hasVariants ? p.variants[0].id : "");
                const activeVariant = hasVariants
                  ? p.variants.find((v) => v.id === currentVariantId)
                  : null;
                const displayPrice = activeVariant ? activeVariant.price : p.price;
                const itemId = activeVariant ? `${p.id}-${activeVariant.id}` : p.id;
                const isJustAdded = addedAnimationId === itemId;

                return (
                  <div
                    key={p.id}
                    className="p-2.5 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {p.image ? (
                        <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden relative shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0">
                          VTDK
                        </div>
                      )}

                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-medium">
                            {p.category.name}
                          </span>
                        </div>

                        {/* Variant Selector */}
                        {hasVariants && (
                          <div className="pt-0.5">
                            <select
                              value={currentVariantId}
                              onChange={(e) =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                              className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-[10px] font-medium"
                            >
                              {p.variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.label} — {formatCurrency(v.price)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-black text-xs text-[#075FA8] dark:text-blue-400">
                          {formatCurrency(displayPrice)}
                        </div>
                        <div className="text-[9px] text-slate-400">Đơn giá gốc</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProduct(p)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer !min-h-0 ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#075FA8] hover:bg-[#0B3D66] text-white shadow-xs active:scale-95"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Thêm</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls Footer */}
          {filteredProducts.length > ITEMS_PER_PAGE && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 text-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Trang <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> / {totalPages} ({filteredProducts.length} SP)
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer !min-h-0"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    return Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const hasGap = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {hasGap && <span className="px-1 text-slate-400 text-[10px]">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer !min-h-0 ${
                            currentPage === page
                              ? "bg-[#075FA8] text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer !min-h-0"
                  title="Trang tiếp"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Quotation Sheet & Partner Information (5 cols) - Tabbed Layout */}
        <div className="lg:col-span-5 h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-3 overflow-hidden">
          
          {/* Top Segmented Tab Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 shrink-0 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setRightTab("items")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer !min-h-0 ${
                rightTab === "items"
                  ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Hàng Hóa ({quoteItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab("customer")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer !min-h-0 ${
                rightTab === "customer"
                  ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Đối Tác &amp; VAT</span>
              {Boolean(customerName || customerPhone) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          </div>

          {/* Middle Tab Content (Scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {rightTab === "items" ? (
              /* TAB 1: ITEMS LIST */
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Danh Sách Sản Phẩm Đã Chọn ({quoteItems.length})
                  </div>
                  {quoteItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuoteItems([])}
                      className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {quoteItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Chưa có sản phẩm nào trong bảng báo giá. Hãy bấm <strong>&ldquo;+ Thêm&rdquo;</strong> từ kho bên trái.
                  </div>
                ) : (
                  quoteItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50/90 dark:bg-slate-800/70 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 transition-all space-y-2.5 text-xs group shadow-2xs"
                    >
                      {/* Top Row: Thumbnail + Full Product Title + Delete Button */}
                      <div className="flex items-start gap-3">
                        {item.image ? (
                          <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden relative shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                            VTDK
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-2 text-xs leading-snug">
                            {item.name}
                          </div>
                          {item.variantTitle && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 font-semibold text-[10px] border border-blue-200/60 dark:border-blue-900/60">
                                Quy cách: {item.variantTitle}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer !min-h-0"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Row: Unit Price on Left & Stepper + Line Total on Right */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-700/60 text-xs">
                        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(item.price)}</span>
                          {item.unit ? ` / ${item.unit}` : ""}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Stepper */}
                          <div className="flex items-center h-7 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                              className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer text-xs"
                              title="Giảm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                              className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer text-xs"
                              title="Tăng"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="font-mono font-black text-xs sm:text-sm text-[#075FA8] dark:text-blue-400 min-w-[70px] text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* TAB 2: CUSTOMER & QUOTE SETTINGS */
              <div className="space-y-3 p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Khách Hàng / Người Liên Hệ:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="VD: Anh Minh..."
                        className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Số Điện Thoại:
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0905.xxx.xxx"
                        className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Công Ty / Đơn Vị Mua Hàng:
                    </label>
                    <input
                      type="text"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="Công ty Cổ Phần Cơ Điện & Lạnh Đà Nẵng"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Địa Chỉ Giao Hàng / Công Trình:
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Khu công nghiệp Hòa Cầm, Đà Nẵng..."
                        className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Mã Số Thuế Khách (nếu có):
                    </label>
                    <input
                      type="text"
                      value={customerTaxCode}
                      onChange={(e) => setCustomerTaxCode(e.target.value)}
                      placeholder="0400xxxxxx"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Thuế VAT:
                      </label>
                      <select
                        value={vatRate}
                        onChange={(e) => setVatRate(Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                      >
                        <option value={0}>0% (Không VAT)</option>
                        <option value={8}>8% (VAT 8%)</option>
                        <option value={10}>10% (VAT 10%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Hiệu Lực:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          value={validDays}
                          onChange={(e) => setValidDays(Math.max(1, Number(e.target.value)))}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                          ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Ghi chú &amp; Điều khoản bổ sung:
                    </label>
                    <textarea
                      rows={3}
                      value={quoteNote}
                      onChange={(e) => setQuoteNote(e.target.value)}
                      placeholder="Ghi chú thêm về vận chuyển, điều kiện thanh toán..."
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRightTab("items")}
                      className="w-full py-2.5 rounded-xl bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu thông tin &amp; Quay lại danh sách hàng ({quoteItems.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Fixed Summary & Action Card (Only displayed in Items tab) */}
          {rightTab === "items" && (
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 space-y-2 shrink-0">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Cộng tiền hàng (Tạm tính):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {vatRate > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Thuế GTGT / VAT ({vatRate}%):</span>
                    <span className="font-mono font-bold text-[#075FA8] dark:text-blue-400">
                      +{formatCurrency(vatAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                  <span className="font-black text-slate-900 dark:text-white uppercase">
                    Tổng Cộng:
                  </span>
                  <span className="font-mono font-black text-base text-red-600 dark:text-red-400">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[10.5px] text-slate-600 dark:text-slate-400 italic line-clamp-1">
                  <strong>Bằng chữ: </strong>{readVNDInWords(grandTotal)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                disabled={quoteItems.length === 0}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#075FA8] to-[#0a4d87] hover:from-[#0B3D66] hover:to-[#075FA8] text-white text-xs sm:text-sm font-black shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none !min-h-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Xem &amp; Xuất Bản In / PDF Báo Giá (A4)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Reusable Printable Modal Instance */}
      <PrintableQuoteModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        items={quoteItems}
        mode="quote"
        initialCustomerName={customerName}
        initialCustomerCompany={customerCompany}
        initialCustomerPhone={customerPhone}
        initialCustomerAddress={customerAddress}
        initialCustomerTaxCode={customerTaxCode}
        initialVatRate={vatRate}
        initialValidDays={validDays}
        initialNote={quoteNote}
      />
    </div>
  );
};
