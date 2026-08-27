import { z } from "zod";

export const posCartItemSchema = z.object({
  cartItemId: z.string().optional(),
  productId: z.string().min(1, "Thiếu ID sản phẩm!"),
  variantId: z.string().nullable().optional(),
  productName: z.string().min(1, "Thiếu tên sản phẩm!"),
  variantLabel: z.string().nullable().optional(),
  productSlug: z.string().min(1, "Thiếu slug sản phẩm!"),
  image: z.string().default("/images/placeholder.svg"),
  price: z.number().min(0, "Giá không hợp lệ!"),
  quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0!"),
  stock: z.number().optional(),
  barcode: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const createPosOrderSchema = z.object({
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(20).optional(),
  paymentMethod: z
    .enum(["CASH", "VIETQR", "CARD", "OTHER", "BANK_TRANSFER", "QR_CODE"])
    .default("CASH"),
  cashReceived: z.number().min(0).optional(),
  cashChange: z.number().min(0).optional(),
  discountAmount: z.number().min(0).default(0),
  items: z.array(posCartItemSchema).min(1, "Giỏ hàng tại quầy trống!"),
  totalAmount: z.number().min(0).optional(),
  note: z.string().max(500).optional(),
});

export const searchPosProductSchema = z.object({
  query: z.string().max(100).optional(),
});

export type PosCartItemInput = z.infer<typeof posCartItemSchema>;
export type CreatePosOrderInput = z.infer<typeof createPosOrderSchema>;
export type SearchPosProductInput = z.infer<typeof searchPosProductSchema>;
