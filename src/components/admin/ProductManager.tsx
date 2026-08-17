"use client";

import React, { useState, useEffect } from "react";
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
  PackageOpen
} from "lucide-react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductActiveAction,
} from "../../app/admin/actions";
import { Pagination } from "../Pagination";
import { MultiImageUpload } from "./MultiImageUpload";

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
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

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
    setExistingGalleryUrls([]);
    setNewGalleryFiles([]);
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
    setExistingGalleryUrls(product.images);
    setNewGalleryFiles([]);
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
    existingGalleryUrls.forEach((url) => formData.append("existingImages", url));
    newGalleryFiles.forEach((file) => formData.append("newImages", file));

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

  return (
    <>
      {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">DANH SÁCH SẢN PHẨM</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Quản lý sản phẩm hiển thị trên trang chủ của khách hàng.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-md shadow transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM SẢN PHẨM</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          
          {/* Category Filter Dropdown */}
          <div className="w-full md:w-64 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
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
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-left">
            {/* Mobile Card List */}
            <div className="sm:hidden grid grid-cols-2 gap-3 p-3">
              {pagedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
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
                          className="flex-1 p-1.5 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-md transition-colors !min-h-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          aria-label="Xóa"
                          className="flex-1 p-1.5 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-md transition-colors !min-h-0"
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
                  {pagedProducts.map((product) => (
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
                          className={`!min-h-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs shadow-xs border transition-all ${
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
            <div className="px-4 sm:px-6 pb-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
            <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h3>
            <p className="text-slate-500 text-sm mt-1">
              Thử thay đổi bộ lọc danh mục hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}

      {/* CRUD Product Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-slate-100 flex flex-col">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
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
            <form onSubmit={handleSubmit} className="p-4 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column: Image */}
                <div className="lg:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Hình ảnh sản phẩm
                  </label>
                  <div className="aspect-square w-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-[#075FA8] border border-slate-200 hover:border-[#075FA8] rounded-md px-2 py-2 text-xs font-bold transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Chụp ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-[#075FA8] border border-slate-200 hover:border-[#075FA8] rounded-md px-2 py-2 text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center">JPG, PNG, WEBP tối đa 5MB</p>
                </div>

                {/* Right Column: Fields */}
                <div className="lg:col-span-8 space-y-4">
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
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
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
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
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
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
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
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                    />
                  </div>

                  {/* Active Toggle Option */}
                  <div className="flex items-center gap-2">
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
                </div>

                {/* Full Width: Gallery Images (customers can browse multiple photos) */}
                <div className="lg:col-span-12">
                  <MultiImageUpload
                    existingUrls={existingGalleryUrls}
                    onExistingUrlsChange={setExistingGalleryUrls}
                    newFiles={newGalleryFiles}
                    onNewFilesChange={setNewGalleryFiles}
                    label="Thư viện ảnh sản phẩm (khách hàng lướt xem)"
                  />
                </div>

                {/* Full Width: Product Variants (size/thickness/length options with own price) */}
                <div className="lg:col-span-12">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {variantRows.map((row, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={row.label}
                            onChange={(e) => handleVariantChange(index, "label", e.target.value)}
                            placeholder="Ví dụ: Độ dày 13mm"
                            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                          />
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            placeholder="Giá (VND)"
                            className="w-28 text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
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
              </div>

              {/* Submit Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-md text-center text-sm transition-colors !min-h-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-2.5 px-4 rounded-md text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
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
    </>
  );
};
