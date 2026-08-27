import { z } from "zod";

export const createGalleryImageSchema = z.object({
  title: z.string().min(1, "Tiêu đề hình ảnh không được để trống!").max(150),
  url: z.string().url("Đường dẫn hình ảnh không hợp lệ!"),
  sortOrder: z.number().int().default(0),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
