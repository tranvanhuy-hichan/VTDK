"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LogOut,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  X,
  Upload,
  Loader2,
  PackageOpen,
  ImageIcon,
  Building2
} from "lucide-react";
import { 
  createProductAction, 
  updateProductAction, 
  deleteProductAction, 
  toggleProductActiveAction, 
  logoutAction 
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
  active: boolean;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
}

interface ProductManagerProps {
  initialCategories: Category[];
  initialProducts: Product[];
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantRows, setVariantRows] = useState<{ label: string; price: string }[]>([]);

  // Open modal for creating product
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setName("");
    setPrice("");
    setShortDesc("");
    setCategoryId(initialCategories[0]?.id || "");
    setActive(true);
    setImageFile(null);
    setImagePreview(null);
    setVariantRows([]);
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
    setImageFile(null);
    setImagePreview(product.image);
    setVariantRows(
      product.variants.map((v) => ({ label: v.label, price: v.price.toString() }))
    );
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

  // Handle image selection preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert("Vui lòng nhập đầy đủ Tên, Giá và Danh mục!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("shortDesc", shortDesc);
    formData.append("categoryId", categoryId);
    formData.append("active", active.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }
    variantRows.forEach((row) => {
      if (row.label.trim() && row.price.trim()) {
        formData.append("variantLabel", row.label.trim());
        formData.append("variantPrice", row.price);
      }
    });

    const res = isEditing && editingProduct
      ? await updateProductAction(editingProduct.id, formData)
      : await createProductAction(formData);

    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      setIsModalOpen(false);
      setIsSubmitting(false);
      window.location.reload();
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

  // Logout admin
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  // Filter products by search and category
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.shortDesc && product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">ĐÔNG KHA ADMIN</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Bảng quản trị sản phẩm vật tư
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/gallery"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Hình ảnh</span>
            </Link>
            <Link
              href="/admin/company"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Thông tin công ty</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">DANH SÁCH SẢN PHẨM</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Quản lý sản phẩm hiển thị trên trang chủ của khách hàng.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM SẢN PHẨM</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`!min-h-0 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                selectedCategory === "all"
                  ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tất cả
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`!min-h-0 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
            />
          </div>
        </div>

        {/* Product Table Grid */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-6 text-left w-16">Hình ảnh</th>
                    <th className="py-4 px-6 text-left">Tên sản phẩm</th>
                    <th className="py-4 px-6 text-left">Danh mục</th>
                    <th className="py-4 px-6 text-left">Giá bán</th>
                    <th className="py-4 px-6 text-center w-36">Trạng thái</th>
                    <th className="py-4 px-6 text-center w-28">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-4 px-6 text-left">
                        <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                        <span className="inline-flex text-[10px] font-bold bg-blue-50 border border-blue-100 text-[#075FA8] px-2.5 py-0.5 rounded-md">
                          {product.category.name}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 text-left font-black text-slate-900">
                        {product.price > 0
                          ? `${product.price.toLocaleString("vi-VN")}đ`
                          : "Liên hệ báo giá"}
                        {product.variants.length > 0 && (
                          <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                            {product.variants.length} phân loại
                          </div>
                        )}
                      </td>

                      {/* Active Status Switch */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`!min-h-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs border transition-all ${
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
                            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors !min-h-0"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            aria-label="Xóa"
                            className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0"
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
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h3>
            <p className="text-slate-500 text-sm mt-1">
              Thử thay đổi bộ lọc danh mục hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </main>

      {/* CRUD Product Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors !min-h-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Ống đồng Thái Lan cuộn 6.35 - 9.52"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              {/* Grid 2 Columns: Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Danh mục *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                  >
                    {initialCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Giá bán (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ví dụ: 1250000"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Nhập mô tả ngắn gọn về sản phẩm..."
                  rows={3}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hình ảnh sản phẩm
                </label>
                
                <div className="flex gap-4 items-center">
                  {/* Preview box */}
                  <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  
                  {/* File selector input */}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-xl p-4 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold">Chọn tệp hình ảnh</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP tối đa 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Product Variants (size/thickness/length options with own price) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Phân loại (kích thước / độ dày / chiều dài...)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs font-bold text-[#075FA8] hover:text-[#0B1F33] flex items-center gap-1 !min-h-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm phân loại
                  </button>
                </div>

                {variantRows.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Chưa có phân loại nào. Nếu không thêm, sản phẩm chỉ dùng giá bán chung ở trên.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variantRows.map((row, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => handleVariantChange(index, "label", e.target.value)}
                          placeholder="Ví dụ: Độ dày 13mm"
                          className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                        />
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                          placeholder="Giá (VND)"
                          className="w-32 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(index)}
                          aria-label="Xóa phân loại"
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg transition-colors !min-h-0 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle Option */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="active-toggle"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-[#075FA8] border-slate-300 rounded-sm focus:ring-[#075FA8]"
                />
                <label htmlFor="active-toggle" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Hiển thị sản phẩm lên Website
                </label>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6 bg-slate-550/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors !min-h-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-3 px-4 rounded-xl text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
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

    </div>
  );
};
