import { z } from "zod";

export const SERVICE_ICONS_LIST = [
  "Building2",
  "Fan",
  "Wind",
  "ThermometerSun",
] as const;

export const createServiceSchema = z.object({
  title: z.string().min(1, "Tiêu đề giải pháp không được để trống!").max(150),
  description: z.string().min(1, "Mô tả giải pháp không được để trống!"),
  icon: z.enum(SERVICE_ICONS_LIST).default("ThermometerSun"),
  features: z.array(z.string()).default([]),
  image: z.string().min(1, "Vui lòng chọn hình ảnh đại diện!"),
  images: z.array(z.string()).default([]),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().min(1, "Thiếu ID giải pháp cần cập nhật!"),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
