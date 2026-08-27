import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống!").max(100, "Tên danh mục quá dài!"),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1, "Thiếu ID danh mục!"),
  name: z.string().min(1, "Tên danh mục không được để trống!").max(100, "Tên danh mục quá dài!"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
