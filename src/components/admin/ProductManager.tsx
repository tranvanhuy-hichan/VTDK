"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  X,
  Upload,
  Camera,
  Loader2,
  PackageOpen,
  Star,
  Lock,
  ImageIcon,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductActiveAction,
} from "../../app/admin/actions";
import { Pagination } from "../Pagination";

const PAGE_SIZE = 10;

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

interface ProductManagerProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

interface ProductImageItem {
  id: string;
  type: "existing" | "file";
  url: string;
  file?: File;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  initialCategories,
  initialProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states inside modal
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(true);
  const [variantRows, setVariantRows] = useState<{ label: string; price: string }[]>([]);
  
  // Unified single image dropzone list
  const [imageList, setImageList] = useState<ProductImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Open modal for creating product
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setName("");
    setPrice("");
    setShortDesc("");
    setCategoryId(initialCategories[0]?.id || "");
    setActive(true);
    setVariantRows([]);
    setImageList([]);
    setIsModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEdit = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setShortDesc(product.shortDesc || "");
    setCategoryId(product.categoryId);
    setActive(product.active);

    const initialRows = product.variants.map((v) => ({
      label: v.label,
      price: v.price.toString(),
    }));
    setVariantRows(initialRows);

    // Build unified image list (main image at index 0, followed by gallery images)
    const list: ProductImageItem[] = [];
    if (product.image && product.image !== "/images/placeholder.png") {
      list.push({
        id: `existing-main-${Date.now()}`,
        type: "existing",
        url: product.image,
      });
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((url, i) => {
        if (url !== product.image) {
          list.push({
            id: `existing-gallery-${i}-${Date.now()}`,
            type: "existing",
            url,
          });
        }
      });
    }
    setImageList(list);
    setIsModalOpen(true);
  };

  // Variant row helpers
  const handleAddVariantRow = () => {
    setVariantRows((rows) => [...rows, { label: "", price: "" }]);
  };

  const handleVariantChange = (index: number, field: "label" | "price", value: string) => {
    setVariantRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariantRows((rows) => rows.filter((_, i) => i !== index));
  };

  // Unified image upload handlers
  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Tệp ${file.name} vượt quá dung lượng 5MB!`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageList((prev) => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random()}`,
            type: "file",
            url: reader.result as string,
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const newList = [...prev];
      const selected = newList.splice(index, 1)[0];
      return [selected, ...newList];
    });
  };

  const handleRemoveImageItem = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !categoryId) {
      alert("Vui lòng nhập đầy đủ Tên sản phẩm và Danh mục!");
      return;
    }

    const hasVariants = variantRows.length > 0;
    const finalPrice = hasVariants ? (variantRows[0]?.price || "0") : price;

    if (!hasVariants && (!finalPrice || isNaN(parseInt(finalPrice, 10)))) {
      alert("Vui lòng nhập giá bán hợp lệ cho sản phẩm!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", finalPrice);
    formData.append("shortDesc", shortDesc);
    formData.append("categoryId", categoryId);
    formData.append("active", active.toString());

    // Single unified image processing:
    // Index 0 item is the MAIN cover image
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

    // Index 1..n items are additional gallery images
    galleryItems.forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append("newImages", item.file);
      } else if (item.type === "existing") {
        formData.append("existingImages", item.url);
      }
    });

    // Variants
    variantRows.forEach((row) => {
      if (row.label.trim() && row.price.trim()) {
        formData.append("variantLabel", row.label.trim());
        formData.append("variantPrice", row.price.trim());
      }
    });

    try {
      const res = isEditing && editingProduct
        ? await updateProductAction(editingProduct.id, formData)
        : await createProductAction(formData);

      if (res?.error) {
        alert(res.error);
      } else {
        setIsModalOpen(false);
        window.location.reload();
        return;
      }
    } catch (err) {
      alert("Lỗi kết nối, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (product: Product) => {
    const res = await toggleProductActiveAction(product.id, !product.active);
    if (res?.error) {
      alert(res.error);
    } else {
      window.location.reload();
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const res = await deleteProductAction(id);
      if (res?.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    }
  };

  // Filter products by search and category
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.shortDesc && product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const hasVariants = variantRows.length > 0;

  return (
    <>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">DANH SÁCH SẢN PHẨM</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Quản lý và cập nhật sản phẩm phân phối trên hệ thống Đông Kha.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer w-full sm:w-auto transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM SẢN PHẨM MỚI</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        
        {/* Category Filter Dropdown */}
        <div className="w-full md:w-64 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
          >
            <option value="all">Tất cả danh mục</option>
            {initialCategories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
          />
        </div>
      </div>

      {/* Product Table Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden text-left">
          {/* Mobile Card List */}
          <div className="sm:hidden grid grid-cols-2 gap-3 p-3">
            {pagedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleToggleActive(product)}
                    aria-label={product.active ? "Đang hiển thị" : "Đã ẩn"}
                    className={`!min-h-0 absolute top-1.5 right-1.5 p-1.5 rounded-md shadow-xs border ${
                      product.active
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    {product.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-2.5 flex-1 flex flex-col">
                  <span className="inline-block w-fit text-[9px] font-bold bg-blue-50 border border-blue-100 text-[#075FA8] px-1.5 py-0.5 rounded mb-1">
                    {product.category.name}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                    {product.name}
                  </h4>
                  <div className="mt-auto pt-1.5">
                    <div className="text-xs font-black text-slate-900">
                      {product.price > 0 ? `${product.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                    </div>
                    {product.variants.length > 0 && (
                      <div className="text-[9px] font-bold text-slate-400">{product.variants.length} phân loại</div>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        aria-label="Sửa"
                        className="flex-1 p-1.5 flex items-center justify-center text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors !min-h-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        aria-label="Xóa"
                        className="flex-1 p-1.5 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6 text-left w-16">Hình ảnh</th>
                  <th className="py-4 px-6 text-left">Tên sản phẩm</th>
                  <th className="py-4 px-6 text-left">Danh mục</th>
                  <th className="py-4 px-6 text-left">Giá bán</th>
                  <th className="py-4 px-6 text-center w-36">Trạng thái</th>
                  <th className="py-4 px-6 text-center w-28">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pagedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image Thumbnail */}
                    <td className="py-4 px-6 text-left">
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        {product.images && product.images.length > 0 && (
                          <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded-tl">
                            +{product.images.length}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-6 text-left">
                      <div className="font-bold text-slate-900 leading-snug">{product.name}</div>
                      {product.shortDesc && (
                        <div className="text-xs text-slate-500 truncate max-w-xs mt-1">
                          {product.shortDesc}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-left">
                      <span className="inline-flex text-xs font-bold bg-blue-50 border border-blue-100 text-[#075FA8] px-2.5 py-1 rounded-lg">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-left font-black text-slate-900">
                      {product.price > 0
                        ? `${product.price.toLocaleString("vi-VN")}đ`
                        : "Liên hệ báo giá"}
                      {product.variants.length > 0 && (
                        <div className="text-[11px] font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{product.variants.length} phân loại</span>
                        </div>
                      )}
                    </td>

                    {/* Active Status Switch */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`!min-h-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs border transition-all cursor-pointer ${
                          product.active
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {product.active ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>🟢 Đang hiển thị</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>⚪ Đã ẩn</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          aria-label="Sửa"
                          className="p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors !min-h-0 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          aria-label="Xóa"
                          className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 sm:px-6 pb-6 pt-2">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h3>
          <p className="text-slate-500 text-sm mt-1">
            Thử thay đổi bộ lọc danh mục hoặc từ khóa tìm kiếm.
          </p>
        </div>
      )}

      {/* CRUD Product Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl max-w-7xl w-full h-[90vh] max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/90 z-20 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#075FA8] text-white flex items-center justify-center font-bold shadow-xs">
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isEditing ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isEditing ? "Cập nhật thông tin, hình ảnh & giá bán sản phẩm" : "Nhập thông tin chi tiết để tạo sản phẩm mới"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors !min-h-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
              
              {/* 2-Column Wide Grid: Each column scrolls independently */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
                
                {/* LEFT COLUMN: BASIC INFO, PRICE, VARIANTS & DESC (Independently Scrollable) */}
                <div className="lg:col-span-6 space-y-4 lg:overflow-y-auto lg:max-h-full lg:pr-2">
                  
                  {/* SECTION 1: BASIC INFO */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">1</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Thông tin chung</h4>
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
                        placeholder="Ví dụ: Ống đồng Thái Lan Luvata cuộn 6.35 - 9.52"
                        className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] font-medium transition-all shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Danh mục sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all shadow-2xs"
                        >
                          {initialCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Active Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Trạng thái hiển thị
                        </label>
                        <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 cursor-pointer shadow-2xs">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="w-4 h-4 text-[#075FA8] border-slate-300 rounded focus:ring-[#075FA8]"
                          />
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {active ? "🟢 Hiển thị trên Website" : "⚪ Ẩn khỏi Website"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PRICE & VARIANTS */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">2</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Giá bán &amp; Phân loại</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddVariantRow}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-[#075FA8] hover:text-[#0B1F33] bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer !min-h-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm phân loại</span>
                      </button>
                    </div>

                    {/* Main Price input (Disabled if variants exist) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Giá bán chung (VND) {!hasVariants && <span className="text-red-500">*</span>}
                      </label>
                      {hasVariants ? (
                        <div className="space-y-1.5">
                          <div className="relative">
                            <input
                              type="number"
                              disabled
                              value={variantRows[0]?.price || price || "0"}
                              className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-500 font-bold cursor-not-allowed select-none"
                            />
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <Lock className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-bold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Đang có phân loại: Giá bán sẽ được nhập riêng cho từng phân loại ở dưới.</span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Ví dụ: 1250000"
                          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all shadow-2xs"
                        />
                      )}
                    </div>

                    {/* Variant rows list */}
                    {variantRows.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-2 max-h-48 overflow-y-auto pr-1">
                        <span className="text-[11px] font-extrabold text-slate-600 block uppercase tracking-wider">
                          Danh sách phân loại sản phẩm ({variantRows.length}):
                        </span>
                        {variantRows.map((row, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-center">#{index + 1}</span>
                            <input
                              type="text"
                              required
                              value={row.label}
                              onChange={(e) => handleVariantChange(index, "label", e.target.value)}
                              placeholder="Phân loại (VD: Bình 1kg)"
                              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#075FA8]"
                            />
                            <div className="relative w-32 shrink-0">
                              <input
                                type="number"
                                required
                                value={row.price}
                                onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                placeholder="Giá (đ)"
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-6 pl-2.5 py-1.5 font-extrabold text-orange-600 focus:bg-white focus:outline-none focus:border-[#075FA8]"
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-[10px] text-slate-400 font-bold pointer-events-none">đ</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(index)}
                              aria-label="Xóa phân loại"
                              className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors !min-h-0 shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: SHORT DESCRIPTION */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">3</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Mô tả ngắn</h4>
                    </div>
                    <textarea
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Nhập mô tả ngắn về xuất xứ, thông số kĩ thuật sản phẩm..."
                      rows={3}
                      className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all shadow-2xs font-medium"
                    />
                  </div>

                </div>

                {/* RIGHT COLUMN: UNIFIED SINGLE IMAGE DROPZONE & GALLERY (Independently Scrollable) */}
                <div className="lg:col-span-6 space-y-4 lg:overflow-y-auto lg:max-h-full lg:pl-1 lg:pr-2">
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#075FA8] font-black text-xs flex items-center justify-center">4</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Hình ảnh sản phẩm</h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Ảnh đầu tiên tự động làm <strong>Ảnh chính</strong>
                      </span>
                    </div>

                    {/* Single Central Dropzone Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#075FA8] bg-white hover:bg-blue-50/30 rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 group shadow-2xs shrink-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-[#075FA8] flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-[#075FA8] transition-colors">
                        Kéo thả hình ảnh vào đây hoặc nhấp chọn từ thiết bị
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Hỗ trợ chọn nhiều hình ảnh (JPG, PNG, WEBP tối đa 5MB)
                      </p>

                      <div className="mt-3 flex items-center justify-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer !min-h-0"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chọn tệp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer !min-h-0"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chụp camera</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                        className="hidden"
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {/* Unified Image Thumbnails Grid */}
                    {imageList.length > 0 ? (
                      <div className="space-y-2 flex-1 pt-1">
                        <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                          Danh sách ảnh ({imageList.length}):
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5">
                          {imageList.map((item, index) => {
                            const isMain = index === 0;
                            return (
                              <div
                                key={item.id}
                                className={`group relative rounded-xl overflow-hidden border-2 bg-slate-100 aspect-square shadow-2xs transition-all ${
                                  isMain ? "border-[#075FA8] ring-2 ring-blue-400/30" : "border-slate-200"
                                }`}
                              >
                                <img src={item.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                {/* Badge Top-Left */}
                                <div className="absolute top-1 left-1 pointer-events-none">
                                  {isMain ? (
                                    <span className="inline-flex items-center gap-1 bg-[#075FA8] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                      <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                      <span>Chính</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-slate-700 bg-white/90 backdrop-blur-xs text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200">
                                      #{index}
                                    </span>
                                  )}
                                </div>

                                {/* X Delete Button Top-Right Corner */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageItem(index)}
                                  aria-label="Xóa ảnh"
                                  title="Xóa ảnh này"
                                  className="absolute top-1 right-1 p-1 bg-slate-950/70 hover:bg-red-600 text-white rounded-full transition-all cursor-pointer shadow-md z-10 !min-h-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>

                                {/* Set as Main hover button for non-main images */}
                                {!isMain && (
                                  <div className="absolute inset-x-0 bottom-0 p-1 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainImage(index)}
                                      className="w-full bg-[#075FA8] hover:bg-blue-600 text-white font-bold text-[9px] py-1 px-1 rounded transition-colors flex items-center justify-center gap-1 !min-h-0 cursor-pointer"
                                    >
                                      <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                                      <span>Làm ảnh chính</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Chưa có ảnh nào được chọn. Sản phẩm sẽ sử dụng ảnh mặc định.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Actions Footer (Pinned at bottom) */}
              <div className="flex items-center gap-3 p-4 sm:px-6 border-t border-slate-100 bg-white shrink-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl text-center text-sm transition-colors !min-h-0 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-2.5 px-4 rounded-xl text-center text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu sản phẩm...</span>
                    </>
                  ) : (
                    <span>LƯU SẢN PHẨM</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};
