"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Layers,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Package,
} from "lucide-react";
import {
  PosProductItem,
  PosCartItem,
  searchPosProductsAction,
  createPosOrderAction,
} from "../../../actions/posActions";
import { PosInvoiceModal, PosInvoiceData } from "./PosInvoiceModal";
import { CompanyContact } from "../../../lib/company";
import { OrderItemCard } from "@/components/ui";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PosTerminalProps {
  initialProducts: PosProductItem[];
  categories: Category[];
  company: CompanyContact;
}

// Audio Beep for successful barcode scan using Web Audio API
function playScanBeep() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore audio error if not permitted
  }
}

export const PosTerminal: React.FC<PosTerminalProps> = ({
  initialProducts,
  categories,
  company,
}) => {
  // Products state
  const [products, setProducts] = useState<PosProductItem[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Barcode Scanner Input state
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cart state
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percent">("fixed");

  // Customer info
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [orderNote, setOrderNote] = useState<string>("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "VIETQR" | "CARD" | "OTHER">("CASH");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variant Modal
  const [selectedVariantProduct, setSelectedVariantProduct] = useState<PosProductItem | null>(null);

  // Invoice Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<PosInvoiceData | null>(null);

  // Keep barcode input focused for physical USB/Bluetooth handheld barcode scanner
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setProducts(initialProducts);
        return;
      }
      setIsSearching(true);
      const res = await searchPosProductsAction(searchTerm);
      setIsSearching(false);
      if (res.products) {
        setProducts(res.products);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, initialProducts]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedDiscount =
    discountType === "percent"
      ? Math.round((subtotal * discountPercent) / 100)
      : discountAmount;
  const totalAmount = Math.max(0, subtotal - calculatedDiscount);
  const cashChange = Math.max(0, cashReceived - totalAmount);

  // Sync cashReceived when total changes if user hasn't typed custom cash
  useEffect(() => {
    if (paymentMethod === "CASH" && (cashReceived === 0 || cashReceived < totalAmount)) {
      setCashReceived(totalAmount);
    }
  }, [totalAmount, paymentMethod]);

  // Add Item to Cart Helper
  const addItemToCart = useCallback(
    (product: PosProductItem, variant?: { id: string; label: string; price: number }) => {
      playScanBeep();
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (it) =>
            it.productId === product.id &&
            (variant ? it.variantLabel === variant.label : !it.variantLabel)
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += 1;
          return updated;
        }

        const newItem: PosCartItem = {
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          variantLabel: variant ? variant.label : null,
          price: variant ? variant.price : product.price,
          quantity: 1,
          image: product.image,
          stock: product.stock,
          sku: product.sku,
          barcode: product.barcode,
        };
        return [newItem, ...prev];
      });
    },
    []
  );

  // Handle Barcode Scanner Form Submit (Enter key sent by Barcode reader)
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    setBarcodeInput("");
    setIsSearching(true);
    const res = await searchPosProductsAction(code);
    setIsSearching(false);

    if (res.exactBarcodeMatch) {
      if (res.exactBarcodeMatch.variants && res.exactBarcodeMatch.variants.length > 0) {
        setSelectedVariantProduct(res.exactBarcodeMatch);
      } else {
        addItemToCart(res.exactBarcodeMatch);
      }
    } else if (res.products && res.products.length > 0) {
      const match = res.products[0];
      if (match.variants && match.variants.length > 0) {
        setSelectedVariantProduct(match);
      } else {
        addItemToCart(match);
      }
    } else {
      alert(`Không tìm thấy sản phẩm nào có mã vạch / SKU: "${code}"!`);
    }

    barcodeInputRef.current?.focus();
  };

  // Cart item quantity update
  const updateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeItemFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Cart item remove
  const removeItemFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear Cart & Start New Order
  const handleNewOrder = () => {
    setCart([]);
    setDiscountAmount(0);
    setDiscountPercent(0);
    setCustomerName("");
    setCustomerPhone("");
    setOrderNote("");
    setCashReceived(0);
    setCompletedOrder(null);
    barcodeInputRef.current?.focus();
  };

  // Submit & Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống! Vui lòng quét mã hoặc chọn sản phẩm.");
      return;
    }

    setIsSubmitting(true);
    const res = await createPosOrderAction({
      customerName,
      customerPhone,
      paymentMethod,
      cashReceived: paymentMethod === "CASH" ? cashReceived : totalAmount,
      cashChange: paymentMethod === "CASH" ? cashChange : 0,
      discountAmount: calculatedDiscount,
      note: orderNote,
      items: cart,
    });

    setIsSubmitting(false);

    if (res.error) {
      alert(res.error);
    } else if (res.order) {
      setCompletedOrder(res.order as any);
      setCart([]);
      setDiscountAmount(0);
      setDiscountPercent(0);
      setCustomerName("");
      setCustomerPhone("");
      setOrderNote("");
      setCashReceived(0);
    }
  };

  // Keyboard Shortcuts (F2: New Order, F9: Checkout)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        handleNewOrder();
      } else if (e.key === "F9") {
        e.preventDefault();
        if (cart.length > 0 && !isSubmitting) {
          handleCheckout();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, isSubmitting, totalAmount]);

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return true;
    return (
      p.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.categoryName?.toLowerCase())
    );
  });

  return (
    <div className="w-full flex flex-col h-[calc(100vh-65px)] overflow-hidden text-left bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Top POS Status Bar - Ultra Thin & Compact */}
      <div className="h-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="w-6 h-6 !min-h-0 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors inline-flex items-center justify-center shrink-0"
            title="Về trang quản trị"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h1 className="text-xs font-black text-slate-900 dark:text-white tracking-tight leading-none">
              BÁN HÀNG TẠI QUẦY (POS)
            </h1>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-300 border border-blue-100 dark:border-blue-800 hidden sm:inline-block leading-none">
              {company.brandName}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNewOrder}
            className="h-6 !min-h-0 inline-flex items-center gap-1 text-[10px] font-extrabold px-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Phím tắt: F2"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Đơn mới</span> <kbd className="text-[8px] font-mono opacity-60">F2</kbd>
          </button>
        </div>
      </div>

      {/* Main Terminal Layout: Left (Catalog & Barcode Scan) - Right (Live Cashier Cart) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden gap-0">
        
        {/* LEFT COLUMN (7 Cols): BARCODE SCANNER & PRODUCT CATALOG */}
        <div className="lg:col-span-7 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Barcode & Search Controls - Ultra Compact */}
          <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0">
            {/* Primary Barcode Scan Form */}
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-[#075FA8] dark:text-blue-400">
                  <Barcode className="w-4 h-4 animate-pulse" />
                </span>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Quét mã vạch hoặc nhập Barcode / SKU rồi nhấn Enter..."
                  className="w-full text-xs font-mono font-bold bg-blue-50/50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 rounded-lg pl-9 pr-20 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-blue-200 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-2.5 py-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white text-[10px] font-bold rounded-md shadow-xs transition-all cursor-pointer !min-h-0"
                >
                  Thêm (Enter)
                </button>
              </div>
            </form>

            {/* Filter Row: Category Tabs & Search input */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer !min-h-0 ${
                  selectedCategory === "all"
                    ? "bg-[#075FA8] text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                Tất cả ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer !min-h-0 ${
                    selectedCategory === cat.name
                      ? "bg-[#075FA8] text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {filteredProducts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Package className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm font-bold">Không tìm thấy sản phẩm nào</p>
                <p className="text-xs">Hãy thử tìm theo từ khóa hoặc quét mã vạch khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (product.variants && product.variants.length > 0) {
                        setSelectedVariantProduct(product);
                      } else {
                        addItemToCart(product);
                      }
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#075FA8] dark:hover:border-blue-500 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group active:scale-98 relative select-none"
                  >
                    <div>
                      {/* Image & Stock Badge */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold">
                          Kho: {product.stock}
                        </span>
                        {product.variants.length > 0 && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-600/95 text-white text-[9px] font-bold shadow-xs">
                            {product.variants.length} quy cách
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>

                      {/* SKU / Barcode */}
                      {product.sku && (
                        <span className="text-[9px] font-mono text-slate-400 block truncate">
                          {product.sku}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-[#075FA8] dark:text-blue-400">
                        {(() => {
                          if (product.variants && product.variants.length > 0) {
                            const prices = product.variants
                              .map((v) => v.price)
                              .filter((p) => typeof p === "number" && p > 0);
                            if (prices.length > 0) {
                              const min = Math.min(...prices);
                              const max = Math.max(...prices);
                              return min === max
                                ? `${min.toLocaleString("vi-VN")}đ`
                                : `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString("vi-VN")}đ`;
                            }
                          }
                          return `${product.price.toLocaleString("vi-VN")}đ`;
                        })()}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 flex items-center justify-center group-hover:bg-[#075FA8] group-hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): CASHIER CART & PAYMENT */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
          
          {/* Cart Header */}
          <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <h2 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                HÓA ĐƠN ({cart.reduce((sum, it) => sum + it.quantity, 0)} MÓN)
              </h2>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer !min-h-0"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            )}
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {cart.length === 0 ? (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 mb-1.5 opacity-20" />
                <p className="text-xs font-bold">Chưa có sản phẩm nào trong đơn</p>
                <p className="text-[10px]">Quét mã vạch hoặc nhấn vào mặt hàng để thêm</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <OrderItemCard
                  key={`${item.productId}-${item.variantLabel || "default"}`}
                  title={item.productName}
                  variantTitle={item.variantLabel}
                  unitPrice={item.price}
                  quantity={item.quantity}
                  onQuantityChange={(newQty) => updateItemQuantity(index, newQty)}
                  onRemove={() => removeItemFromCart(index)}
                />
              ))
            )}
          </div>

          {/* Bottom Checkout & Payment Section - Compact */}
          <div className="p-2 sm:p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 space-y-1.5 shrink-0 shadow-sm">
            
            {/* Customer Information (Optional) */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
                  <User className="w-3 h-3" />
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Khách lẻ tại quầy"
                  className="w-full h-7 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pl-6 pr-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#075FA8]"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
                  <Phone className="w-3 h-3" />
                </span>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="SĐT (tùy chọn)"
                  className="w-full h-7 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pl-6 pr-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#075FA8]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`py-1 px-1.5 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer !min-h-0 ${
                  paymentMethod === "CASH"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Banknote className="w-3 h-3" />
                <span>Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("VIETQR")}
                className={`py-1 px-1.5 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer !min-h-0 ${
                  paymentMethod === "VIETQR"
                    ? "bg-[#075FA8] text-white border-[#075FA8] shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>VietQR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`py-1 px-1.5 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer !min-h-0 ${
                  paymentMethod === "CARD"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <CreditCard className="w-3 h-3" />
                <span>Quẹt thẻ</span>
              </button>
            </div>

            {/* If Cash Payment: Quick Money Buttons & Change Calculation */}
            {paymentMethod === "CASH" && (
              <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Khách đưa:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={cashReceived || ""}
                      onChange={(e) => setCashReceived(parseInt(e.target.value, 10) || 0)}
                      className="w-24 h-6 text-right font-black text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setCashReceived(totalAmount)}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer !min-h-0"
                    >
                      Đủ
                    </button>
                  </div>
                </div>

                {/* Quick denomination chips */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[50000, 100000, 200000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashReceived(amt)}
                      className="text-[9px] font-bold px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer !min-h-0"
                    >
                      {(amt / 1000).toLocaleString()}k
                    </button>
                  ))}
                  <div className="ml-auto text-[11px]">
                    <span className="text-slate-400 mr-1">Thừa:</span>
                    <span className={`font-black ${cashChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {cashChange.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Total & Checkout Button on 1 Single Line */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-none mb-0.5">
                  Tổng tiền:
                </span>
                <span className="text-base sm:text-lg text-[#075FA8] dark:text-blue-400 font-black leading-tight">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Checkout Button on the Right - Compact */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0 || isSubmitting}
                className="py-1 px-2.5 rounded-lg bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 cursor-pointer !min-h-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In hóa đơn</span>
                <kbd className="text-[9px] font-mono bg-white/20 px-1 py-0.2 rounded ml-0.5">F9</kbd>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {selectedVariantProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Chọn phân loại: {selectedVariantProduct.name}
            </h3>
            <div className="space-y-2">
              {selectedVariantProduct.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    addItemToCart(selectedVariantProduct, v);
                    setSelectedVariantProduct(null);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#075FA8] hover:bg-blue-50/50 dark:hover:bg-slate-800 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {v.label}
                  </span>
                  <span className="font-black text-xs text-[#075FA8] dark:text-blue-400">
                    {v.price.toLocaleString("vi-VN")}đ
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedVariantProduct(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Completed Invoice & Print Modal */}
      <PosInvoiceModal
        data={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
};
