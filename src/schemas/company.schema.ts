import { z } from "zod";

export const updateCompanyInfoSchema = z.object({
  name: z.string().min(1, "Tên doanh nghiệp không được để trống!").max(150),
  fullName: z.string().max(255).optional(),
  shortName: z.string().max(100).optional(),
  brandName: z.string().max(100).optional(),
  tagline: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  address: z.string().max(255).optional(),
  hotline: z.string().max(50).optional(),
  hotlineRaw: z.string().max(50).optional(),
  zaloUrl: z.string().max(255).optional(),
  whatsAppUrl: z.string().max(255).optional(),
  facebookUrl: z.string().max(255).optional(),
  googleMapsUrl: z.string().max(500).optional(),
  googleMapsEmbed: z.string().optional(),
  workingHours: z.string().max(100).optional(),
  hasDelivery: z.boolean().default(true),
  shippingFeeDanang: z.number().min(0).default(0),
  shippingFeeProvince: z.number().min(0).default(0),
  freeshipThreshold: z.number().min(0).default(0),
  freeshipProvinces: z.array(z.string()).default([]),
  shippingNote: z.string().max(500).nullable().optional(),
  enablePosModule: z.boolean().default(true),
});

export const updateCompanyShippingSchema = z.object({
  hasDelivery: z.boolean().default(true),
  shippingFeeDanang: z.number().min(0).default(0),
  shippingFeeProvince: z.number().min(0).default(0),
  freeshipThreshold: z.number().min(0).default(0),
  freeshipProvinces: z.array(z.string()).default([]),
  shippingNote: z.string().max(500).nullable().optional(),
  enablePosModule: z.boolean().default(true),
});

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Mã màu không hợp lệ!").optional(),
  primaryDark: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Mã màu không hợp lệ!").optional(),
  primaryLight: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Mã màu không hợp lệ!").optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Mã màu không hợp lệ!").optional(),
  accentHover: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Mã màu không hợp lệ!").optional(),
  fontFamily: z.string().max(50).optional(),
  borderRadius: z.string().max(30).optional(),
  headerStyle: z.string().max(30).optional(),
  themePreset: z.string().max(50).optional(),
  customCss: z.string().nullable().optional(),
  homepageSections: z.string().nullable().optional(),
});

export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoSchema>;
export type UpdateCompanyShippingInput = z.infer<typeof updateCompanyShippingSchema>;
export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
