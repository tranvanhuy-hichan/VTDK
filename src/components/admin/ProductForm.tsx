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
} from "lucide-react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "../../app/admin/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  label: string;
  price: number;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  shortDesc: string | null;
  image: string;
  images: string[];
  active: boolean;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
}

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product;
}

interface ProductImageItem {
  id: string;
  type: "existing" | "file";
  url: string;
  file?: File;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  initialProduct,
}) => {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price.toString() || "");
  const [shortDesc, setShortDesc] = useState(initialProduct?.shortDesc || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );
  const [active, setActive] = useState(
    initialProduct ? initialProduct.active : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variant Rows
  const [variantRows, setVariantRows] = useState<{ label: string; price: string }[]>(
    initialProduct?.variants
      ? initialProduct.variants.map((v) => ({
          label: v.label,
          price: v.price.toString(),
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
    setVariantRows((prev) => [...prev, { label: "", price: price || "" }]);
  };

  const handleUpdateVariantRow = (
    index: number,
    field: "label" | "price",
    val: string
  ) => {
    setVariantRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariantRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleFilesAdded = (files: FileList | File[]) => {
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
    if (index === 0) return;
    setImageList((prev) => {
      const next = [...prev];
      const target = next.splice(index, 1)[0];
      return [target, ...next];
    });
  };

  const handleRemoveImageItem = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const hasVariants = variantRows.length > 0;

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    formData.append("price", finalPrice);
    formData.append("shortDesc", shortDesc.trim());
    formData.append("categoryId", categoryId);
    formData.append("active", active.toString());

    if (isEditing && initialProduct) {
      formData.append("id", initialProduct.id);
    }

    // Process image list
    const mainItem = imageList[0];
    const galleryItems = imageList.slice(1);

    if (mainItem) {
      if (mainItem.type === "file" && mainItem.file) {
        formData.append("image", mainItem.file);
      } else if (mainItem.type === "existing") {
        formData.append("mainImageUrl", mainItem.url);
      }
    } else {
      formData.append("removeImage", "true");
    }

    galleryItems.forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append("newImages", item.file);
      } else if (item.type === "existing") {
        formData.append("existingImages", item.url);
      }
    });

    variantRows.forEach((row) => {
      if (row.label.trim() && row.price.trim()) {
        formData.append("variantLabel", row.label.trim());
        formData.append("variantPrice", row.price.trim());
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
        router.push("/admin");
        router.refresh();
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
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="w-full py-2 px-1 sm:px-2 space-y-4 text-left">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors shrink-0 !min-h-0"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-[#075FA8] dark:text-blue-400 uppercase tracking-wider block">
              {isEditing ? "CHỈNH SỬA SẢN PHẨM" : "THÊM MỚI SẢN PHẨM"}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {isEditing ? initialProduct?.name : "Tạo sản phẩm mới"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditing && (
            <button
              type="button"
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
              className="bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/80 font-extrabold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 !min-h-0 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa sản phẩm</span>
            </button>
          )}

          <Link
            href="/admin/products"
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors !min-h-0 text-center"
          >
            Hủy bỏ
          </Link>
          <button
            type="button"
            onClick={() => {
              const form = document.getElementById("product-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isSubmitting}
            className="bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>{isEditing ? "CẬP NHẬT SẢN PHẨM" : "LƯU SẢN PHẨM MỚI"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: BASIC INFO, PRICES & VARIANTS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* SECTION 1: BASIC INFO */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                  Thông tin chung
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Gas Lạnh R134a Chính Hãng (Bình 13.6kg)"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Danh mục sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Trạng thái hiển thị
                  </label>
                  <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mô tả ngắn sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Mô tả thông số kỹ thuật, ứng dụng thực tế hoặc thương hiệu sản phẩm..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 2: PRICE & VARIANTS */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Giá bán lẻ &amp; Phân loại sản phẩm
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#075FA8] hover:text-[#0B1F33] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer !min-h-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm phân loại</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giá bán lẻ chung (VND) {!hasVariants && <span className="text-red-500">*</span>}
                </label>
                {hasVariants ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="number"
                        disabled
                        value={variantRows[0]?.price || price || "0"}
                        className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-500 font-bold cursor-not-allowed select-none"
                      />
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Đang sử dụng phân loại: Giá bán sẽ được cài đặt riêng cho từng dòng ở bên dưới.</span>
                    </div>
                  </div>
                ) : (
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ví dụ: 180000"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                  />
                )}
              </div>

              {/* Variant Rows List */}
              {variantRows.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <span className="text-xs font-extrabold text-slate-600 block uppercase tracking-wider">
                    Danh sách các phân loại / quy cách ({variantRows.length}):
                  </span>
                  {variantRows.map((row, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200"
                    >
                      <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-center">
                        #{index + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={row.label}
                        onChange={(e) =>
                          handleUpdateVariantRow(index, "label", e.target.value)
                        }
                        placeholder="Tên quy cách (VD: Bình 1kg)..."
                        className="flex-1 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#075FA8]"
                      />
                      <input
                        type="number"
                        required
                        value={row.price}
                        onChange={(e) =>
                          handleUpdateVariantRow(index, "price", e.target.value)
                        }
                        placeholder="Giá bán (đ)..."
                        className="w-28 sm:w-36 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#075FA8]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(index)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors !min-h-0 cursor-pointer"
                        title="Xóa phân loại"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: IMAGES GALLERY & DROPZONE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Hình ảnh sản phẩm
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {imageList.length} ảnh đã chọn
                </span>
              </div>

              {/* Hidden file inputs */}
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

              {/* Image Preview Grid */}
              {imageList.length > 0 && (
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

                          {/* Hover Action Overlay */}
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
                        </div>
                      );
                    })}
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
