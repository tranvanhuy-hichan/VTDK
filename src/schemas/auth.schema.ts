import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên không được để trống!").max(100, "Tên quá dài!"),
  email: z.string().email("Địa chỉ email không hợp lệ!"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự!"),
  phone: z
    .string()
    .regex(/^[0-9+ ]{9,15}$/, "Số điện thoại không hợp lệ!")
    .nullable()
    .optional(),
  address: z.string().max(255, "Địa chỉ quá dài!").nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ!"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

export const completeGoogleAccountSchema = z
  .object({
    name: z.string().min(1, "Họ và tên không được để trống!"),
    phone: z
      .string()
      .regex(/^[0-9+ ]{9,15}$/, "Số điện thoại không hợp lệ!")
      .nullable()
      .optional(),
    address: z.string().max(255, "Địa chỉ quá dài!").nullable().optional(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự!"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Họ và tên không được để trống!").max(100),
  phone: z
    .string()
    .regex(/^[0-9+ ]{9,15}$/, "Số điện thoại không hợp lệ!")
    .nullable()
    .optional(),
  address: z.string().max(255, "Địa chỉ quá dài!").nullable().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại!"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự!"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.newPassword === data.confirmPassword,
    {
      message: "Mật khẩu xác nhận không khớp!",
      path: ["confirmPassword"],
    }
  );

export const updateAddressSchema = z.object({
  address: z.string().min(1, "Địa chỉ không được để trống!").max(255),
  phone: z
    .string()
    .regex(/^[0-9+ ]{9,15}$/, "Số điện thoại không hợp lệ!")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CompleteGoogleAccountInput = z.infer<typeof completeGoogleAccountSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
