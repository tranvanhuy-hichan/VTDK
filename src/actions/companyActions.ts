"use server";

import { getCurrentAdmin } from "../lib/auth";
import * as companyService from "../services/company.service";

export async function updateCompanyInfoAction(formData: FormData) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return { error: "Chưa đăng nhập!" };
    const company = await companyService.updateCompanyInfo(formData);
    return { success: true, company };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi cập nhật thông tin công ty!" };
  }
}

export async function updateCompanyShippingAction(input: {
  hasDelivery: boolean;
  shippingFeeDanang: number;
  shippingFeeProvince: number;
  freeshipThreshold: number;
  freeshipProvinces: string[];
  shippingNote?: string | null;
  enablePosModule?: boolean;
}) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return { error: "Chưa đăng nhập!" };
    const company = await companyService.updateCompanyShipping(input);
    return { success: true, company };
  } catch (err: any) {
    return { error: err.message || "Lỗi khi cập nhật cài đặt vận chuyển!" };
  }
}

export async function updateThemeSettingsAction(themeData: {
  primaryColor?: string;
  primaryDark?: string;
  primaryLight?: string;
  accentColor?: string;
  accentHover?: string;
  fontFamily?: string;
  borderRadius?: string;
  headerStyle?: string;
  themePreset?: string;
  customCss?: string | null;
  homepageSections?: string | null;
}) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return { error: "Chưa đăng nhập!" };
    await companyService.updateThemeSettings(themeData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi cập nhật theme!" };
  }
}
