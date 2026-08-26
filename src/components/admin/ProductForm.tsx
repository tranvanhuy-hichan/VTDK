"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Camera,
  Loader2,
  Star,
  Lock,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Layers,
  Barcode,
  Sparkles,
  Printer,
  Package,
  RefreshCw,
  Pencil,
  Eye,
  ExternalLink,
  Check,
} from "lucide-react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "../../app/admin/actions";
import {
  generateSku,
  generateEan13Barcode,
  getBarcodeSvgDataUrl,
} from "../../lib/barcode";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

interface ProductFormProps {
  categories: Category[];
  initialProduct?: {
    id: string;
    name: string;
    slug?: string;
    sku?: string | null;
    barcode?: string | null;
    stock?: number | null;
    price: number;
    shortDesc: string | null;
    image: string;
    images: string[];
    active: boolean;
    categoryId: string;
    variants: ProductVariant[];
  };
}

interface ProductImageItem {
  id: string;
  type: "existing" | "file";
  url: string;
  file?: File;
}

interface VariantRow {
  label: string;
  price: string;
  sku?: string;
  barcode?: string;
  stock?: string;
}

export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  // View vs Edit Mode (Starts in View mode if editing an existing product)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(isEditing);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"info" | "images" | "pricing">("info");

  const [name, setName] = useState(initialProduct?.name || "");
  const [sku, setSku] = useState(
    () => initialProduct?.sku || generateSku(categories[0]?.name || "SP", initialProduct?.name || "")
  );
  const [barcode, setBarcode] = useState(
    () => initialProduct?.barcode || generateEan13Barcode()
  );
  const [stock, setStock] = useState(initialProduct?.stock?.toString() || "100");
  const [price, setPrice] = useState(initialProduct?.price.toString() || "");
  const [shortDesc, setShortDesc] = useState(initialProduct?.shortDesc || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );
  const [active, setActive] = useState(
    initialProduct ? initialProduct.active : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variant Rows State with SKU, Barcode, Stock
  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    initialProduct?.variants
      ? initialProduct.variants.map((v, idx) => ({
          label: v.label,
          price: v.price.toString(),
          sku: (v as any).sku || (initialProduct.sku ? `${initialProduct.sku}-${idx + 1}` : `DK-${idx + 1}`),
          barcode: (v as any).barcode || generateEan13Barcode(),
          stock: (v as any).stock?.toString() || "100",
        }))
      : []
  );

  // Unified single image dropzone list
  const [imageList, setImageList] = useState<ProductImageItem[]>(() => {
    if (!initialProduct) return [];
    const list: ProductImageItem[] = [];
    if (initialProduct.image && initialProduct.image !== "/images/placeholder.svg") {
      list.push({
        id: `existing-main-${Date.now()}`,
        type: "existing",
        url: initialProduct.image,
      });
    }
    if (Array.isArray(initialProduct.images)) {
      initialProduct.images.forEach((url) => {
        if (url !== initialProduct.image) {
          list.push({
            id: `existing-gallery-${Math.random()}`,
            type: "existing",
            url,
          });
        }
      });
    }
    return list;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Variant Row Handlers
  const handleAddVariantRow = () => {
    if (isReadOnly) return;
    const nextIdx = variantRows.length + 1;
    const cat = categories.find((c) => c.id === categoryId);
    const baseSku = sku.trim() || generateSku(cat?.name || cat?.slug, name);
    setVariantRows((prev) => [
      ...prev,
      {
        label: "",
        price: price || "",
        sku: `${baseSku}-${nextIdx}`,
        barcode: generateEan13Barcode(),
        stock: "100",
      },
    ]);
  };

  const handleUpdateVariantRow = (
    index: number,
    field: keyof VariantRow,
    val: string
  ) => {
    if (isReadOnly) return;
    setVariantRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleGenerateVariantSku = (index: number) => {
    if (isReadOnly) return;
    const cat = categories.find((c) => c.id === categoryId);
    const baseSku = sku.trim() || generateSku(cat?.name || cat?.slug, name);
    handleUpdateVariantRow(index, "sku", `${baseSku}-${index + 1}`);
  };

  const handleGenerateVariantBarcode = (index: number) => {
    if (isReadOnly) return;
    handleUpdateVariantRow(index, "barcode", generateEan13Barcode());
  };

  const handleRemoveVariantRow = (index: number) => {
    if (isReadOnly) return;
    setVariantRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleFilesAdded = (files: FileList | File[]) => {
    if (isReadOnly) return;
    const fileArray = Array.from(files);
    const newItems: ProductImageItem[] = fileArray.map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      type: "file",
      url: URL.createObjectURL(file),
      file,
    }));
    setImageList((prev) => [...prev, ...newItems]);
  };

  const handleSetMainImage = (index: number) => {
    if (isReadOnly || index === 0) return;
    setImageList((prev) => {
      const next = [...prev];
      const target = next.splice(index, 1)[0];
      return [target, ...next];
    });
  };

  const handleRemoveImageItem = (index: number) => {
    if (isReadOnly) return;
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateSku = () => {
    if (isReadOnly) return;
    const cat = categories.find((c) => c.id === categoryId);
    setSku(generateSku(cat?.name || cat?.slug, name));
  };

  const handleGenerateBarcode = () => {
    if (isReadOnly) return;
    setBarcode(generateEan13Barcode());
  };

  const hasVariants = variantRows.length > 0;

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!name.trim() || !categoryId) {
      alert("Vui lòng nhập đầy đủ Tên sản phẩm và Danh mục!");
      return;
    }

    const finalPrice = hasVariants ? variantRows[0]?.price || "0" : price;

    if (!hasVariants && (!finalPrice || isNaN(parseInt(finalPrice, 10)))) {
      alert("Vui lòng nhập giá bán hợp lệ cho sản phẩm!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("sku", sku.trim());
    formData.append("barcode", barcode.trim());
    formData.append("stock", stock.trim());
    formData.append("price", finalPrice);
    formData.append("shortDesc", shortDesc.trim());
    formData.append("categoryId", categoryId);
    formData.append("active", active ? "true" : "false");

    if (isEditing && initialProduct) {
      formData.append("id", initialProduct.id);
    }

    if (imageList.length > 0) {
      const mainItem = imageList[0];
      if (mainItem.type === "existing") {
        formData.append("mainImageUrl", mainItem.url);
      } else if (mainItem.file) {
        formData.append("image", mainItem.file);
      }
    } else {
      formData.append("removeImage", "true");
    }

    const galleryItems = imageList.slice(1);
    galleryItems.forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append("galleryFiles", item.file);
      } else if (item.type === "existing") {
        formData.append("existingImages", item.url);
      }
    });

    variantRows.forEach((row) => {
      if (row.label.trim() && row.price.trim()) {
        formData.append("variantLabel", row.label.trim());
        formData.append("variantPrice", row.price.trim());
        formData.append("variantSku", (row.sku || "").trim());
        formData.append("variantBarcode", (row.barcode || "").trim());
        formData.append("variantStock", (row.stock || "100").trim());
      }
    });

    try {
      const res = isEditing
        ? await updateProductAction(formData)
        : await createProductAction(formData);

      setIsSubmitting(false);

      if (res.error) {
        alert(res.error);
      } else {
        if (isEditing) {
          setIsReadOnly(true);
          setSaveSuccessMessage("Đã lưu và cập nhật sản phẩm thành công!");
          setTimeout(() => setSaveSuccessMessage(null), 4000);
          router.refresh();
        } else {
          router.push("/admin/products");
          router.refresh();
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || "Lỗi hệ thống khi lưu sản phẩm!");
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async () => {
    if (!initialProduct) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${initialProduct.name}" không? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    const res = await deleteProductAction(initialProduct.id);
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <div className="w-full py-1.5 px-1 sm:px-2 space-y-2.5 sm:space-y-4 text-left lg:h-[calc(100vh-5.5rem)] lg:flex lg:flex-col lg:overflow-hidden">
      {/* Floating Corner Toast Notification (Không chèn làm vỡ layout) */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 text-white dark:bg-slate-800 border border-emerald-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold pr-2">
            <p className="font-extrabold text-white text-xs">{saveSuccessMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMessage(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer !min-h-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header Navigation (Compact & Responsive on Mobile) */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 transition-colors shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            href="/admin/products"
            className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors shrink-0 !min-h-0"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              {isEditing ? initialProduct?.name : "Tạo sản phẩm mới"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* IN READ-ONLY (VIEW) MODE */}
          {isReadOnly ? (
            <>
              {initialProduct?.slug && (
                <a
                  href={`/san-pham/${initialProduct.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 !min-h-0"
                  title="Xem sản phẩm trên Website"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Xem Web</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="p-2 sm:px-3 sm:py-2 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/80 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 disabled:opacity-50 !min-h-0 cursor-pointer"
                title="Xóa sản phẩm"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReadOnly(false)}
                className="p-2 sm:px-3 sm:py-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 !min-h-0 cursor-pointer"
                title="Chỉnh sửa sản phẩm"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </button>
            </>
          ) : (
            /* IN EDITING / CREATING MODE */
            <>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setName(initialProduct?.name || "");
                    setPrice(initialProduct?.price.toString() || "");
                    setShortDesc(initialProduct?.shortDesc || "");
                    setCategoryId(initialProduct?.categoryId || categories[0]?.id || "");
                    setActive(initialProduct ? initialProduct.active : true);
                    setIsReadOnly(true);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold px-3 py-1.5 sm:py-2 rounded-xl text-xs transition-colors !min-h-0 cursor-pointer"
                >
                  Hủy
                </button>
              ) : (
                <Link
                  href="/admin/products"
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold px-3 py-1.5 sm:py-2 rounded-xl text-xs transition-colors !min-h-0 text-center"
                >
                  Hủy
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  const form = document.getElementById("product-form") as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
                disabled={isSubmitting}
                className="bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 !min-h-0 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>{isEditing ? "LƯU" : "LƯU MỚI"}</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Tab Segmented Switcher (Nhỏ gọn, tinh tế) */}
      <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("info")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "info"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>1. Thông tin</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("images")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "images"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>2. Hình ảnh</span>
          {imageList.length > 0 && (
            <span className="text-[9px] bg-blue-100 text-[#075FA8] px-1 rounded-full font-bold">
              {imageList.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("pricing")}
          className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            mobileTab === "pricing"
              ? "bg-white dark:bg-slate-900 text-[#075FA8] dark:text-blue-400 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
          }`}
        >
          <span>3. Giá &amp; Kho</span>
          {hasVariants && (
            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded-full font-bold">
              {variantRows.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Form Body */}
      <form id="product-form" onSubmit={handleSubmit} className="flex-1 lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start lg:h-full">
          
          {/* CỘT TRÁI (LEFT COLUMN - 6 COLS): MỤC 1 (THÔNG TIN CHUNG) & MỤC 2 (HÌNH ẢNH) */}
          <div className={`lg:col-span-6 space-y-3 sm:space-y-5 lg:h-full lg:overflow-y-auto lg:pr-2 pb-6 ${mobileTab === "pricing" ? "hidden lg:block" : "block"}`}>
            {/* SECTION 1: BASIC INFO */}
            <div className={`bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3.5 ${mobileTab !== "info" ? "hidden lg:block" : "block"}`}>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  Thông tin chung
                </h3>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Gas Lạnh R134a Chính Hãng (Bình 13.6kg)"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Danh mục sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    disabled={isReadOnly}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Trạng thái hiển thị
                  </label>
                  <label className={`flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 ${isReadOnly ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      disabled={isReadOnly}
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 text-[#075FA8] border-slate-300 rounded focus:ring-[#075FA8]"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {active ? "🟢 Hiển thị công khai" : "⚪ Ẩn khỏi Website"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô tả ngắn sản phẩm
                </label>
                <textarea
                  rows={2.5 as any}
                  disabled={isReadOnly}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Mô tả thông số kỹ thuật, ứng dụng thực tế hoặc thương hiệu..."
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 2: IMAGES GALLERY & DROPZONE */}
            <div className={`bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3.5 ${mobileTab !== "images" ? "hidden lg:block" : "block"}`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    Hình ảnh sản phẩm
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {imageList.length} ảnh đã chọn
                </span>
              </div>

              {/* Hidden file inputs */}
              {!isReadOnly && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  />

                  {/* Dropzone Container */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-[#075FA8] hover:bg-blue-50/50 p-6 rounded-2xl text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#075FA8] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Tải lên ảnh sản phẩm
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nhấp để tải hoặc chụp trực tiếp từ thiết bị (JPG, PNG, WEBP)
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors !min-h-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Chọn nhiều ảnh</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cameraInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#075FA8] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors !min-h-0"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Chụp ảnh</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Image Preview Grid */}
              {imageList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                    Danh sách ảnh (Ảnh đầu tiên làm ảnh đại diện chính):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imageList.map((item, idx) => {
                      const isMain = idx === 0;
                      return (
                        <div
                          key={item.id}
                          className={`relative aspect-square rounded-xl border overflow-hidden group/img transition-all ${
                            isMain
                              ? "border-2 border-[#075FA8] ring-2 ring-blue-100 shadow-md"
                              : "border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={`Ảnh sản phẩm ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Top Left Badge */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            {isMain ? (
                              <span className="bg-[#075FA8] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Ảnh chính</span>
                              </span>
                            ) : (
                              <span className="bg-slate-900/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Hover Action Overlay (Only in Edit Mode) */}
                          {!isReadOnly && (
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-1.5 z-20">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainImage(idx)}
                                  className="bg-[#075FA8] hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1 transition-colors !min-h-0 cursor-pointer"
                                >
                                  <Star className="w-3 h-3 fill-white" />
                                  <span>Đặt ảnh chính</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImageItem(idx)}
                                className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1 transition-colors !min-h-0 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Xóa ảnh</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : isReadOnly ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Chưa có hình ảnh nào cho sản phẩm này.
                </div>
              ) : null}
            </div>
          </div>

          {/* CỘT PHẢI (RIGHT COLUMN - 6 COLS): MỤC 3 (GIÁ BÁN, MÃ SKU & TỒN KHO) */}
          <div className={`lg:col-span-6 space-y-3 sm:space-y-5 lg:h-full lg:overflow-y-auto lg:pr-2 pb-6 ${mobileTab !== "pricing" ? "hidden lg:block" : "block"}`}>
            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                    Giá bán, Mã SKU &amp; Tồn kho
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {!hasVariants ? (
                    !isReadOnly && (
                      <button
                        type="button"
                        onClick={handleAddVariantRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#075FA8] hover:text-[#0B1F33] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm phân loại quy cách</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Đang có {variantRows.length} phân loại
                    </span>
                  )}
                </div>
              </div>

              {/* TRƯỜNG HỢP 1: SẢN PHẨM ĐƠN LẺ (KHÔNG CÓ PHÂN LOẠI) */}
              {!hasVariants ? (
                <div className="space-y-2.5 sm:space-y-3.5">
                  {/* Hàng 1: Giá bán lẻ & Số lượng tồn kho */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-start">
                    {/* Giá bán lẻ */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Giá bán lẻ (VND) <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] font-semibold text-slate-400">Đơn vị: VNĐ</span>
                      </div>
                      <input
                        type="number"
                        required
                        disabled={isReadOnly}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ví dụ: 180000"
                        className="w-full h-9 sm:h-10 text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                      />
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
                        Giá niêm yết bán lẻ cho khách hàng.
                      </p>
                    </div>

                    {/* Số lượng tồn kho */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Số lượng tồn kho (Stock)
                        </label>
                        <span className="text-[10px] font-semibold text-slate-400">Đơn vị: Sản phẩm</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        disabled={isReadOnly}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="100"
                        className="w-full h-9 sm:h-10 text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                      />
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
                        Tự động trừ tồn kho khi bán.
                      </p>
                    </div>
                  </div>

                  {/* Hàng 2: Mã SKU & Mã Vạch Barcode */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 items-start">
                    {/* Mã SKU */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Mã SKU Sản Phẩm
                        </label>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleGenerateSku}
                            className="text-[10px] font-bold text-[#075FA8] hover:text-[#064B85] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                            title="Tạo lại mã SKU mới"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Đổi mã SKU</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="VD: DK-ONG-8921"
                        className="w-full h-9 sm:h-10 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-3 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                      />
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
                        Mã tra cứu nội bộ &amp; hóa đơn.
                      </p>
                    </div>

                    {/* Mã vạch Barcode */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <Barcode className="w-3 h-3 text-[#075FA8]" />
                          <span>Mã Vạch Barcode</span>
                        </label>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleGenerateBarcode}
                            className="text-[10px] font-bold text-[#075FA8] hover:text-[#064B85] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                            title="Tạo lại mã vạch EAN-13 mới"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Đổi mã</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-2">
                        <div className="sm:col-span-7">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            placeholder="VD: 8935049160830"
                            className="w-full h-9 sm:h-10 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl px-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] disabled:bg-slate-100/70 disabled:text-slate-800 disabled:cursor-not-allowed transition-all"
                          />
                        </div>
                        <div className="sm:col-span-5 h-9 sm:h-10 flex items-center justify-center p-1 rounded-lg sm:rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                          {barcode ? (
                            <img
                              src={getBarcodeSvgDataUrl(barcode)}
                              alt="Barcode Preview"
                              className="max-h-7 sm:max-h-8 object-contain"
                            />
                          ) : (
                            <span className="text-[9px] text-slate-400 italic">Chưa có mã</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
                        Quét máy đọc hoặc in tem.
                      </p>
                    </div>
                  </div>

                  {/* Nút gợi ý thêm phân loại */}
                  {!isReadOnly && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleAddVariantRow}
                        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-[#075FA8] text-slate-600 hover:text-[#075FA8] bg-slate-50/70 hover:bg-blue-50/50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Sản phẩm có nhiều kích cỡ, dung tích, quy cách? Bấm vào đây để thêm phân loại</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* TRƯỜNG HỢP 2: SẢN PHẨM CÓ NHIỀU PHÂN LOẠI / QUY CÁCH */
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 text-xs font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#075FA8] shrink-0" />
                      <span>Mỗi phân loại có <strong>giá, SKU, barcode và tồn kho riêng</strong>.</span>
                    </div>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => setVariantRows([])}
                        className="text-xs text-red-600 hover:underline font-bold shrink-0 cursor-pointer"
                      >
                        Xóa tất cả phân loại
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {variantRows.map((row, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs"
                      >
                        {/* Hàng 1: Tên quy cách & Giá bán */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-0.5">
                              Tên quy cách <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isReadOnly}
                              value={row.label}
                              onChange={(e) =>
                                handleUpdateVariantRow(index, "label", e.target.value)
                              }
                              placeholder="VD: Bình 13.6kg..."
                              className="w-full text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8] disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="w-28 sm:w-32">
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-0.5">
                              Giá bán (đ) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              disabled={isReadOnly}
                              value={row.price}
                              onChange={(e) =>
                                handleUpdateVariantRow(index, "price", e.target.value)
                              }
                              placeholder="180000"
                              className="w-full text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8] disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(index)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors !min-h-0 cursor-pointer self-end mb-0.5"
                              title="Xóa phân loại này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Hàng 2: SKU riêng, Barcode riêng & Tồn kho riêng cho phân loại */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 items-start text-left">
                          {/* SKU Phân loại */}
                          <div className="space-y-1">
                            <div className="h-4 flex items-center justify-between text-[10px] leading-none">
                              <span className="font-bold text-slate-600 dark:text-slate-300">Mã SKU</span>
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  onClick={() => handleGenerateVariantSku(index)}
                                  className="text-[9px] text-[#075FA8] hover:underline flex items-center gap-0.5 cursor-pointer font-bold leading-none !min-h-0"
                                  title="Tạo lại SKU"
                                >
                                  <RefreshCw className="w-2 h-2" />
                                  <span>Đổi</span>
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={row.sku}
                              onChange={(e) =>
                                handleUpdateVariantRow(index, "sku", e.target.value)
                              }
                              placeholder={`VD: ${sku || "DK-SP"}-${index + 1}`}
                              className="w-full h-8 text-[11px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8] disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Barcode Phân loại */}
                          <div className="space-y-1">
                            <div className="h-4 flex items-center justify-between text-[10px] leading-none">
                              <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-0.5">
                                <Barcode className="w-2.5 h-2.5 text-[#075FA8]" />
                                <span>Barcode</span>
                              </span>
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  onClick={() => handleGenerateVariantBarcode(index)}
                                  className="text-[9px] text-[#075FA8] hover:underline flex items-center gap-0.5 cursor-pointer font-bold leading-none !min-h-0"
                                  title="Tạo lại Barcode"
                                >
                                  <RefreshCw className="w-2 h-2" />
                                  <span>Đổi</span>
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={row.barcode}
                              onChange={(e) =>
                                handleUpdateVariantRow(index, "barcode", e.target.value)
                              }
                              placeholder="VD: 893..."
                              className="w-full h-8 text-[11px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8] disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Tồn kho Phân loại */}
                          <div className="space-y-1">
                            <div className="h-4 flex items-center justify-between text-[10px] leading-none">
                              <span className="font-bold text-slate-600 dark:text-slate-300">Tồn kho</span>
                              <span className="text-[9px] text-slate-400 font-medium leading-none">SP</span>
                            </div>
                            <input
                              type="number"
                              min={0}
                              disabled={isReadOnly}
                              value={row.stock}
                              onChange={(e) =>
                                handleUpdateVariantRow(index, "stock", e.target.value)
                              }
                              placeholder="100"
                              className="w-full h-8 text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#075FA8] disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={handleAddVariantRow}
                        className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 hover:border-[#075FA8] text-[#075FA8] bg-blue-50/60 hover:bg-blue-50 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm phân loại quy cách khác</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
