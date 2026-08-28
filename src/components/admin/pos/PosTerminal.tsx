"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Barcode,
  Plus,
  Check,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Layers,
  User,
  Phone,
  ChevronRight,
  Package,
  Volume2,
  VolumeX,
  X,
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

let sharedPosAudioCtx: AudioContext | null = null;

function getPosAudioContext(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedPosAudioCtx) {
      sharedPosAudioCtx = new AudioContextClass();
    }
    if (sharedPosAudioCtx.state === "suspended") {
      sharedPosAudioCtx.resume().catch(() => {});
    }
    return sharedPosAudioCtx;
  } catch {
    return null;
  }
}

// Bíp thêm sản phẩm / Quét mã vạch thành công (Âm thanh máy tính tiền POS siêu nét)
function playPosScanBeep(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getPosAudioContext();
    if (!ctx) return;

    const playTone = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(playTone).catch(() => {});
    } else {
      playTone();
    }
  } catch (e) {
    console.log("POS Audio error:", e);
  }
}

// Âm thanh tăng/giảm số lượng
function playPosQtyBeep(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getPosAudioContext();
    if (!ctx) return;

    const playTone = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1300, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(playTone).catch(() => {});
    } else {
      playTone();
    }
  } catch {}
}

// Âm thanh thanh toán hóa đơn thành công (Chime Ting-Ting)
function playPosCheckoutSuccess(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getPosAudioContext();
    if (!ctx) return;

    const playTone = () => {
      const now = ctx.currentTime;

      // Note 1: C6 (1046Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1046, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2: E6 (1318Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1318, now + 0.1);
      gain2.gain.setValueAtTime(0.35, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(playTone).catch(() => {});
    } else {
      playTone();
    }
  } catch {}
}

export const PosTerminal: React.FC<PosTerminalProps> = ({
  initialProducts,
  categories,
  company,
}) => {
  // Products state
  const [products, setProducts] = useState<PosProductItem[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  // Barcode Scanner Input state
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Multi-Order Tab state
  const [tabs, setTabs] = useState<
    Array<{
      id: string;
      label: string;
      cart: PosCartItem[];
      discountAmount: number;
      discountPercent: number;
      discountType: "fixed" | "percent";
      customerName: string;
      customerPhone: string;
      orderNote: string;
      paymentMethod: "CASH" | "VIETQR" | "CARD" | "OTHER";
      cashReceived: number;
    }>
  >([
    {
      id: "tab-1",
      label: "Đơn 1",
      cart: [],
      discountAmount: 0,
      discountPercent: 0,
      discountType: "fixed",
      customerName: "",
      customerPhone: "",
      orderNote: "",
      paymentMethod: "CASH",
      cashReceived: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateActiveTab = useCallback(
    (updater: Partial<(typeof tabs)[0]> | ((prevTab: (typeof tabs)[0]) => (typeof tabs)[0])) => {
      setTabs((prevTabs) =>
        prevTabs.map((t) => {
          if (t.id === activeTabId) {
            return typeof updater === "function" ? updater(t) : { ...t, ...updater };
          }
          return t;
        })
      );
    },
    [activeTabId]
  );

  // Active Tab Derived Fields
  const cart = activeTab.cart;
  const discountAmount = activeTab.discountAmount;
  const discountPercent = activeTab.discountPercent;
  const discountType = activeTab.discountType;
  const customerName = activeTab.customerName;
  const customerPhone = activeTab.customerPhone;
  const orderNote = activeTab.orderNote;
  const paymentMethod = activeTab.paymentMethod;
  const cashReceived = activeTab.cashReceived;

  // Setters for Active Tab
  const setCart = useCallback(
    (action: PosCartItem[] | ((prev: PosCartItem[]) => PosCartItem[])) => {
      updateActiveTab((tab) => ({
        ...tab,
        cart: typeof action === "function" ? action(tab.cart) : action,
      }));
    },
    [updateActiveTab]
  );

  const setDiscountAmount = (val: number) => updateActiveTab({ discountAmount: val });
  const setDiscountPercent = (val: number) => updateActiveTab({ discountPercent: val });
  const setCustomerName = (val: string) => updateActiveTab({ customerName: val });
  const setCustomerPhone = (val: string) => updateActiveTab({ customerPhone: val });
  const setOrderNote = (val: string) => updateActiveTab({ orderNote: val });
  const setPaymentMethod = (val: "CASH" | "VIETQR" | "CARD" | "OTHER") => updateActiveTab({ paymentMethod: val });
  const setCashReceived = useCallback(
    (val: number) => updateActiveTab({ cashReceived: val }),
    [updateActiveTab]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add / Switch / Close Tabs
  const addNewTab = useCallback(() => {
    if (tabs.length >= 5) {
      alert("Đã mở tối đa 5 đơn hàng tạm!");
      return;
    }
    const newIdx = tabs.length;
    const newId = `tab-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        label: `Đơn ${newIdx + 1}`,
        cart: [],
        discountAmount: 0,
        discountPercent: 0,
        discountType: "fixed",
        customerName: "",
        customerPhone: "",
        orderNote: "",
        paymentMethod: "CASH",
        cashReceived: 0,
      },
    ]);
    setActiveTabId(newId);
  }, [tabs.length]);

  const closeTab = useCallback(
    (tabIdToClose: string) => {
      if (tabs.length <= 1) {
        // Clear active tab
        updateActiveTab({
          cart: [],
          discountAmount: 0,
          discountPercent: 0,
          customerName: "",
          customerPhone: "",
          orderNote: "",
          cashReceived: 0,
        });
        return;
      }
      const remaining = tabs.filter((t) => t.id !== tabIdToClose);
      setTabs(remaining);
      if (activeTabId === tabIdToClose) {
        setActiveTabId(remaining[0].id);
      }
    },
    [tabs, activeTabId, updateActiveTab]
  );

  // Variant Modal
  const [selectedVariantProduct, setSelectedVariantProduct] = useState<PosProductItem | null>(null);

  // Invoice Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<PosInvoiceData | null>(null);

  // Mobile navigation tab
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");

  // Keep barcode input focused for physical USB/Bluetooth handheld barcode scanner
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Search debounce based on input
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!barcodeInput.trim()) {
        setProducts(initialProducts);
        return;
      }
      setIsSearching(true);
      const res = await searchPosProductsAction(barcodeInput);
      setIsSearching(false);
      if (res.products) {
        setProducts(res.products);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [barcodeInput, initialProducts]);

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
  }, [totalAmount, paymentMethod, cashReceived, setCashReceived]);

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize sound preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pos_sound_enabled");
      if (saved !== null) {
        setSoundEnabled(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pos_sound_enabled", String(next));
      } catch {}
      if (next) {
        playPosScanBeep(true);
      }
      return next;
    });
  };

  // Add Item to Cart Helper
  const addItemToCart = useCallback(
    (product: PosProductItem, variant?: { id: string; label: string; price: number }) => {
      playPosScanBeep(soundEnabled);
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
    [soundEnabled, setCart]
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
    playPosQtyBeep(soundEnabled);
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
      playPosCheckoutSuccess(soundEnabled);
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

  // Keyboard Shortcuts (F1-F5: Tabs, F6: Scan, F9: Checkout)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["F1", "F2", "F3", "F4", "F5"].includes(e.key)) {
        e.preventDefault();
        const tabIdx = parseInt(e.key.replace("F", ""), 10) - 1;
        if (tabs[tabIdx]) {
          setActiveTabId(tabs[tabIdx].id);
        } else if (tabIdx === tabs.length && tabs.length < 5) {
          addNewTab();
        }
      } else if (e.key === "F6") {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === "F9") {
        e.preventDefault();
        if (cart.length > 0 && !isSubmitting) {
          handleCheckout();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, cart, isSubmitting, totalAmount, addNewTab, handleCheckout]);

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return true;
    return (
      p.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.categoryName?.toLowerCase())
    );
  });

  return (
    <div className="w-full flex flex-col h-auto lg:h-[calc(100dvh-4.5rem)] pb-16 lg:pb-0 overflow-hidden text-left bg-slate-100 dark:bg-slate-950 font-sans space-y-2 pt-1 lg:pt-0">
      {/* Mobile Tab Switcher (Visible only on mobile/tablet < lg) */}
      <div className="lg:hidden bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex items-center gap-1.5 shrink-0 border border-slate-200 dark:border-slate-700 select-none mx-2">
        <button
          type="button"
          onClick={() => setMobileTab("catalog")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all !min-h-0 ${
            mobileTab === "catalog"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Chọn hàng ({filteredProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("cart")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all !min-h-0 ${
            mobileTab === "cart"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>2. Hóa đơn ({cart.reduce((s, it) => s + it.quantity, 0)})</span>
          {cart.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Terminal Layout: Left (Catalog & Barcode Scan) - Right (Live Cashier Cart) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden gap-2 lg:gap-3 px-0 lg:px-2">
        
        {/* LEFT COLUMN (7 Cols): BARCODE SCANNER & PRODUCT CATALOG */}
        <div className={`lg:col-span-7 flex flex-col h-full rounded-none lg:rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 shadow-xs ${mobileTab === 'cart' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Barcode & Search Controls */}
          <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
            {/* Primary Barcode Scan Form with Exit Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="h-8.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1 shrink-0 !min-h-0"
                title="Về trang quản trị"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản trị</span>
              </Link>

              <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#075FA8] dark:text-blue-400">
                    <Barcode className="w-4 h-4 animate-pulse" />
                  </span>
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Quét mã vạch hoặc nhập Barcode / SKU rồi nhấn Enter..."
                    className="w-full text-xs font-mono font-bold bg-blue-50/50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 rounded-lg pl-9.5 pr-20 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-blue-200 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-3 py-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white text-[11px] font-bold rounded-md shadow-xs transition-all cursor-pointer !min-h-0"
                  >
                    Thêm (Enter)
                  </button>
                </div>
              </form>
            </div>

            {/* Filter Row: Category Tabs & Search input */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer !min-h-0 ${
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer !min-h-0 ${
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
                {filteredProducts.map((product) => {
                  const cartItemsForProduct = cart.filter((it) => it.productId === product.id);
                  const totalQtyInCart = cartItemsForProduct.reduce((sum, it) => sum + it.quantity, 0);
                  const isSelected = totalQtyInCart > 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (product.variants && product.variants.length > 0) {
                          setSelectedVariantProduct(product);
                        } else {
                          addItemToCart(product);
                        }
                      }}
                      className={`rounded-xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group active:scale-98 relative select-none ${
                        isSelected
                          ? "bg-blue-50/70 dark:bg-blue-950/40 border-2 border-[#075FA8] dark:border-blue-500 shadow-md ring-2 ring-[#075FA8]/20"
                          : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#075FA8] dark:hover:border-blue-500 shadow-2xs hover:shadow-md"
                      }`}
                    >
                      <div>
                        {/* Image & Stock Badge */}
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = "/images/placeholder.svg";
                            }}
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
                          {isSelected && (
                            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-[#075FA8] dark:bg-blue-600 text-white text-[10px] font-black shadow-sm flex items-center gap-0.5 z-10 animate-in zoom-in-75">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>x{totalQtyInCart}</span>
                            </span>
                          )}
                        </div>

                        {/* Product Name */}
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 mb-1 transition-colors ${
                          isSelected
                            ? "text-[#075FA8] dark:text-blue-400 font-extrabold"
                            : "text-slate-900 dark:text-white group-hover:text-[#075FA8] dark:group-hover:text-blue-400"
                        }`}>
                          {product.name}
                        </h4>

                        {/* SKU / Barcode */}
                        {product.sku && (
                          <span className="text-[9px] font-mono text-slate-400 block truncate">
                            {product.sku}
                          </span>
                        )}
                      </div>

                      {/* Price & Action */}
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
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#075FA8] text-white shadow-xs"
                            : "bg-blue-50 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 group-hover:bg-[#075FA8] group-hover:text-white"
                        }`}>
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Floating Mobile Cart Sticky Bottom Bar */}
          {cart.length > 0 && (
            <div className="lg:hidden p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg shrink-0 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-500">
                  Đã chọn: <span className="text-slate-900 dark:text-white font-black">{cart.reduce((s, it) => s + it.quantity, 0)} món</span>
                </div>
                <div className="text-xs font-black text-[#075FA8] dark:text-blue-400 truncate">
                  {cart.reduce((s, it) => s + it.price * it.quantity, 0).toLocaleString("vi-VN")}đ
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileTab("cart")}
                className="px-3.5 py-1.5 rounded-xl bg-[#075FA8] hover:bg-[#0B1F33] text-white text-xs font-black flex items-center gap-1 shadow-md cursor-pointer !min-h-0 active:scale-98"
              >
                <span>Xem Hóa Đơn ({cart.reduce((s, it) => s + it.quantity, 0)})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (5 Cols): CASHIER CART & PAYMENT */}
        <div className={`lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 rounded-none lg:rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs ${mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Multi-Order Tabs Bar (F1-F5) */}
          <div className="flex items-center justify-between gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-2 pt-1.5 pb-0 border-b border-slate-200 dark:border-slate-700/80 shrink-0">
            <div className="flex items-end gap-1 overflow-x-auto scrollbar-none flex-1">
              {tabs.map((tab, idx) => {
                const isActive = tab.id === activeTab.id;
                const count = tab.cart.reduce((s, it) => s + it.quantity, 0);
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`group flex items-center gap-1.5 px-3 h-8 rounded-t-lg text-xs transition-all cursor-pointer select-none shrink-0 border-t border-x ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 border-slate-200 dark:border-slate-700 font-black shadow-xs relative -mb-[1px] z-10"
                        : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-transparent hover:bg-white/60 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <span>{tab.label || `Đơn ${idx + 1}`}</span>
                    <kbd className="text-[9px] font-mono opacity-50 font-normal">F{idx + 1}</kbd>
                    {count > 0 && (
                      <span
                        className={`text-[10px] min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center font-black ${
                          isActive
                            ? "bg-[#075FA8] text-white"
                            : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    {tabs.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/60 transition-colors p-0 ml-0.5 text-slate-400"
                        title="Đóng đơn này"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              {tabs.length < 5 && (
                <button
                  type="button"
                  onClick={addNewTab}
                  className="h-8 px-2.5 rounded-t-lg text-slate-600 dark:text-slate-300 hover:text-[#075FA8] hover:bg-white/80 dark:hover:bg-slate-700/80 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer !min-h-0 shrink-0 mb-[1px]"
                  title="Mở thêm đơn tạm (Tối đa 5 đơn)"
                >
                  <Plus className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400" />
                  <span>Đơn mới</span>
                </button>
              )}
            </div>

            {/* Sound Toggle Button (Icon Only) */}
            <div className="pb-1.5">
              <button
                type="button"
                onClick={toggleSound}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer !min-h-0 shrink-0 border ${
                  soundEnabled
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                    : "bg-slate-200/70 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-300"
                }`}
                title={soundEnabled ? "Âm thanh: Đang BẬT (Nhấn để tắt)" : "Âm thanh: Đang TẮT (Nhấn để bật)"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Cart Header */}
          <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#075FA8] dark:text-blue-400" />
              <h2 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                HÓA ĐƠN ({cart.reduce((sum, it) => sum + it.quantity, 0)} MÓN)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNewOrder}
                className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#075FA8] flex items-center gap-1 cursor-pointer !min-h-0"
                title="Làm mới giỏ hàng hiện tại"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Làm mới đơn</span>
              </button>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer !min-h-0 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa hết</span>
                </button>
              )}
            </div>
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
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

          {/* Bottom Checkout & Payment Section */}
          <div className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 space-y-2 shrink-0 shadow-sm">
            
            {/* Customer Information (Optional) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Khách lẻ tại quầy"
                  className="w-full h-7.5 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#075FA8]"
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
              {selectedVariantProduct.variants.map((v) => {
                const variantCartItem = cart.find(
                  (it) => it.productId === selectedVariantProduct.id && it.variantLabel === v.label
                );
                const variantQty = variantCartItem?.quantity || 0;
                const isVariantSelected = variantQty > 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      addItemToCart(selectedVariantProduct, v);
                      setSelectedVariantProduct(null);
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isVariantSelected
                        ? "border-2 border-[#075FA8] dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 shadow-xs ring-1 ring-[#075FA8]/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-[#075FA8] hover:bg-blue-50/50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isVariantSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#075FA8] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <div className="text-left">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {v.label}
                        </span>
                        {isVariantSelected && (
                          <span className="text-[10px] text-[#075FA8] dark:text-blue-400 font-bold">
                            Đã chọn: x{variantQty}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-xs text-[#075FA8] dark:text-blue-400">
                      {v.price.toLocaleString("vi-VN")}đ
                    </span>
                  </button>
                );
              })}
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
        company={company}
        onClose={() => setCompletedOrder(null)}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
};
