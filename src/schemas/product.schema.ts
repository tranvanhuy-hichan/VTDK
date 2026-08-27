import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Quy cách không được để trống!"),
  price: z.number().min(0, "Giá không hợp lệ!"),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  stock: z.number().min(0).default(100),
  sortOrder: z.number().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống!"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục!"),
  price: z.number().min(0, "Giá bán lẻ không hợp lệ!").default(0),
  stock: z.number().min(0, "Số lượng tồn kho không hợp lệ!").default(100),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  active: z.boolean().default(true),
  variants: z.array(productVariantSchema).default([]),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
