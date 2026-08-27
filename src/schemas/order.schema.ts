import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().nullable().optional(),
  productSlug: z.string().min(1, "Thiếu slug sản phẩm!"),
  productName: z.string().min(1, "Thiếu tên sản phẩm!"),
  variantLabel: z.string().nullable().optional(),
  price: z.number().min(0, "Giá sản phẩm không hợp lệ!"),
  quantity: z.number().int().min(1, "Số lượng sản phẩm tối thiểu là 1!"),
  image: z.string().min(1, "Thiếu ảnh sản phẩm!"),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập họ và tên người nhận!").max(100),
  customerPhone: z
    .string()
    .regex(/^[0-9+ ]{9,15}$/, "Số điện thoại nhận hàng không hợp lệ!"),
  customerEmail: z.string().email("Email không hợp lệ!").nullable().optional(),
  shippingMethod: z.enum(["DELIVERY", "STORE_PICKUP"]).default("DELIVERY"),
  shippingFee: z.number().min(0).default(0),
  address: z.string().max(255).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  totalAmount: z.number().min(0),
  items: z.array(orderItemSchema).min(1, "Giỏ hàng của bạn đang trống!"),
  userId: z.string().nullable().optional(),
}).refine(
  (data) => {
    if (data.shippingMethod === "DELIVERY" && (!data.address || !data.address.trim())) {
      return false;
    }
    return true;
  },
  {
    message: "Vui lòng nhập địa chỉ nhận hàng đối với hình thức giao hàng tận nơi!",
    path: ["address"],
  }
);

export const lookupOrderSchema = z.object({
  query: z.string().min(1, "Vui lòng nhập mã đơn hàng hoặc số điện thoại!").max(50),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Thiếu ID đơn hàng!"),
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"]),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type LookupOrderInput = z.infer<typeof lookupOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
