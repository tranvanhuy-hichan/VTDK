"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import {
  PrintableQuoteModal,
  readVNDInWords,
  type QuoteItem,
} from "@/components/quote/PrintableQuoteModal";
import { OrderItemCard } from "@/components/ui";
import type { Category, Product, ProductVariant } from "@prisma/client";
import type { CompanyContact } from "@/lib/company";

interface ProductWithRelations extends Product {
  category: Category;
  variants: ProductVariant[];
}

interface AdminQuotationBuilderProps {
  products: ProductWithRelations[];
  categories: Category[];
  company?: CompanyContact;
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
  company,
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

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "ALL" || p.categoryId === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Financial calculations
  const subtotal = useMemo(() => {
    return quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [quoteItems]);

  const vatAmount = useMemo(() => {
    if (vatRate <= 0) return 0;
    return Math.round((subtotal * vatRate) / 100);
  }, [subtotal, vatRate]);

  const grandTotal = useMemo(() => {
    return subtotal + vatAmount;
  }, [subtotal, vatAmount]);

  // Add standard product to quote
  const handleAddProduct = (product: ProductWithRelations) => {
    const hasVariants = product.variants && product.variants.length > 0;
    const currentVariantId = selectedVariants[product.id] || (hasVariants ? product.variants[0].id : "");
    const activeVariant = hasVariants
      ? product.variants.find((v) => v.id === currentVariantId)
      : null;

    const itemId = activeVariant ? `${product.id}-${activeVariant.id}` : product.id;
    const itemPrice = activeVariant ? activeVariant.price : product.price;
    const variantTitle = activeVariant ? activeVariant.label : undefined;

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
          price: itemPrice,
          quantity: 1,
          unit: "Cái",
          image: product.image,
          categoryName: product.category.name,
        },
      ];
    });

    setAddedAnimationId(itemId);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  // Add custom uncatalogued item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const parsedPrice = typeof customPrice === "number" ? customPrice : 0;
    const newItemId = `custom-${Date.now()}`;

    setQuoteItems((prev) => [
      ...prev,
      {
        id: newItemId,
        name: customName.trim(),
        variantTitle: customVariant.trim() || undefined,
        price: parsedPrice,
        quantity: Math.max(1, customQty),
        unit: customUnit.trim() || "Cái",
        isCustom: true,
        categoryName: "Vật tư phụ / Dịch vụ",
      },
    ]);

    // Reset inline custom form
    setCustomName("");
    setCustomVariant("");
    setCustomPrice("");
    setCustomQty(1);
    setIsAddingCustomItem(false);
  };

  // Update item quantity
  const handleUpdateQty = (id: string, delta: number) => {
    setQuoteItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  // Update item custom price
  const handleUpdatePrice = (id: string, newPrice: number) => {
    setQuoteItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, price: Math.max(0, newPrice) } : i))
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

  const [mobileTab, setMobileTab] = useState<"catalog" | "quote" | "customer">("catalog");

  return (
    <div className="w-full flex flex-col h-auto lg:h-[calc(100dvh-4.5rem)] pb-16 lg:pb-0 overflow-hidden text-left bg-slate-100 dark:bg-slate-950 font-sans space-y-2 lg:space-y-2.5">
      {/* 1. Header Toolbar - Compact */}
      <div className="h-9 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="w-6.5 h-6.5 !min-h-0 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors inline-flex items-center justify-center shrink-0"
            title="Về trang quản trị"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2 leading-none">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">
              TẠO BÁO GIÁ B2B
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 border border-blue-100 dark:border-blue-800 hidden sm:inline-block leading-none">
              A4 Studio
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearQuote}
            disabled={quoteItems.length === 0}
            className="h-6.5 !min-h-0 inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Làm mới toàn bộ bảng báo giá"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            disabled={quoteItems.length === 0}
            className="h-6.5 !min-h-0 inline-flex items-center gap-1 text-[11px] font-black px-3 rounded-md bg-[#075FA8] hover:bg-[#0B3D66] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xuất Báo Giá A4 ({quoteItems.length})</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible only on mobile/tablet < lg) */}
      <div className="lg:hidden bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex items-center gap-1.5 shrink-0 border border-slate-200 dark:border-slate-700 select-none mx-2">
        <button
          type="button"
          onClick={() => setMobileTab("catalog")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all !min-h-0 ${
            mobileTab === "catalog"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Kho ({filteredProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileTab("quote");
            setRightTab("items");
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all !min-h-0 ${
            mobileTab === "quote"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>2. Báo Giá ({quoteItems.length})</span>
          {quoteItems.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileTab("customer");
            setRightTab("customer");
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all !min-h-0 ${
            mobileTab === "customer"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>3. Khách hàng</span>
        </button>
      </div>

      {/* 2. Main Two-Column Layout (Fills remaining height, 0 outer scroll) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-3 px-0 lg:px-2 overflow-hidden">
        
        {/* LEFT COLUMN: Product Catalog Picker (7 cols) - Independent Scroll */}
        <div className={`lg:col-span-7 h-full flex flex-col bg-white dark:bg-slate-900 rounded-none lg:rounded-xl p-2.5 sm:p-3 shadow-xs border border-slate-200 dark:border-slate-800 space-y-2 overflow-hidden ${mobileTab !== 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Pinned Top Controls on Left Side */}
          <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 leading-none">
                <Layers className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
                <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Kho Sản Phẩm &amp; Vật Tư
                </h2>
              </div>

              {/* Add Custom Item Button */}
              <button
                type="button"
                onClick={() => setIsAddingCustomItem(!isAddingCustomItem)}
                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer !min-h-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Thêm ngoài</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên, mã SKU, quy cách..."
                className="w-full pl-8.5 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#075FA8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-all cursor-pointer !min-h-0 ${
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
                className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Thêm Hạng Mục Ngoài Kho</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomItem(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
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

          {/* Floating Mobile Quote Sticky Bottom Bar */}
          {quoteItems.length > 0 && (
            <div className="lg:hidden p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg shrink-0 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-500">
                  Báo giá: <span className="text-slate-900 dark:text-white font-black">{quoteItems.length} món</span>
                </div>
                <div className="text-xs font-black text-[#075FA8] dark:text-blue-400 truncate">
                  {formatCurrency(grandTotal)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileTab("quote");
                  setRightTab("items");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#075FA8] hover:bg-[#0B3D66] text-white text-xs font-black flex items-center gap-1 shadow-md cursor-pointer !min-h-0 active:scale-98"
              >
                <span>Xem Báo Giá ({quoteItems.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Quotation Sheet & Partner Information (5 cols) - Tabbed Layout */}
        <div className={`lg:col-span-5 h-full flex flex-col bg-white dark:bg-slate-900 rounded-none lg:rounded-xl p-2.5 sm:p-3 shadow-xs border border-slate-200 dark:border-slate-800 space-y-2 overflow-hidden ${mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Top Segmented Tab Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1.5 shrink-0 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setRightTab("items")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer !min-h-0 ${
                rightTab === "items"
                  ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Hàng Hóa ({quoteItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab("customer")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer !min-h-0 ${
                rightTab === "customer"
                  ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3 h-3" />
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Danh Sách Sản Phẩm Đã Chọn ({quoteItems.length})
                  </div>
                  {quoteItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuoteItems([])}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
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
                    <OrderItemCard
                      key={item.id}
                      title={item.name}
                      variantTitle={item.variantTitle}
                      unitPrice={item.price}
                      quantity={item.quantity}
                      unit={item.unit || "Cái"}
                      allowPriceEdit={true}
                      allowUnitEdit={true}
                      onQuantityChange={(newQty) => handleUpdateQty(item.id, newQty - item.quantity)}
                      onPriceChange={(newPrice) => handleUpdatePrice(item.id, newPrice)}
                      onUnitChange={(newUnit) => handleUpdateUnit(item.id, newUnit)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))
                )}
              </div>
            ) : (
              /* TAB 2: CUSTOMER / PARTNER & TAX INFO */
              <div className="space-y-2">
                <div className="pb-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Thông Tin Đối Tác &amp; Điều Khoản Báo Giá
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Tên Người Nhận:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="VD: Anh Minh..."
                        className="w-full pl-8 pr-2 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Số Điện Thoại:
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0905.xxx.xxx"
                        className="w-full pl-8 pr-2 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Công Ty / Đơn Vị Mua Hàng:
                    </label>
                    <input
                      type="text"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="Công ty Cổ Phần Cơ Điện & Lạnh Đà Nẵng"
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Địa Chỉ Giao Hàng / Công Trình:
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Khu công nghiệp Hòa Cầm, Đà Nẵng..."
                        className="w-full pl-8 pr-2 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Mã Số Thuế:
                    </label>
                    <input
                      type="text"
                      value={customerTaxCode}
                      onChange={(e) => setCustomerTaxCode(e.target.value)}
                      placeholder="0400xxxxxx"
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                        Thuế VAT:
                      </label>
                      <select
                        value={vatRate}
                        onChange={(e) => setVatRate(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200 text-xs"
                      >
                        <option value={0}>0% (Không VAT)</option>
                        <option value={8}>8% (VAT 8%)</option>
                        <option value={10}>10% (VAT 10%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                        Hiệu Lực:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          value={validDays}
                          onChange={(e) => setValidDays(Math.max(1, Number(e.target.value)))}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-xs"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
                          ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      Ghi chú &amp; Điều khoản bổ sung:
                    </label>
                    <textarea
                      rows={2}
                      value={quoteNote}
                      onChange={(e) => setQuoteNote(e.target.value)}
                      placeholder="Ghi chú thêm về vận chuyển, điều kiện thanh toán..."
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRightTab("items")}
                      className="w-full py-1.5 rounded-lg bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs !min-h-0"
                    >
                      <Check className="w-3 h-3" />
                      <span>Quay lại danh sách hàng ({quoteItems.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Fixed Summary & Action Card (Single compact line) */}
          {rightTab === "items" && (
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-none mb-0.5">
                  Tổng {vatRate > 0 ? `(VAT ${vatRate}%)` : ""}:
                </span>
                <span className="text-base sm:text-lg text-red-600 dark:text-red-400 font-mono font-black leading-tight">
                  {grandTotal > 0 ? formatCurrency(grandTotal) : "Liên hệ"}
                </span>
              </div>

              {/* Action Button on the Right - Compact */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                disabled={quoteItems.length === 0}
                className="py-1 px-2.5 rounded-lg bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 cursor-pointer !min-h-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Xuất PDF A4</span>
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
        company={company}
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
