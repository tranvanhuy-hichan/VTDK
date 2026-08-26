import type { CompanyContact } from "./company";
import type { ShippingMethod } from "../types/order";

export interface ShippingCalculationResult {
  shippingFee: number;
  isFreeship: boolean;
  isStorePickup: boolean;
  amountNeededForFreeship: number;
  label: string;
  note?: string;
}

/**
 * Dynamic shipping fee calculation engine based on Admin configuration
 */
export function calculateShippingFee({
  shippingMethod,
  provinceCode,
  subtotal,
  company,
}: {
  shippingMethod: ShippingMethod;
  provinceCode?: string;
  subtotal: number;
  company?: Partial<CompanyContact> | null;
}): ShippingCalculationResult {
  // 1. Store pickup is always 0đ
  if (shippingMethod === "STORE_PICKUP") {
    return {
      shippingFee: 0,
      isFreeship: true,
      isStorePickup: true,
      amountNeededForFreeship: 0,
      label: "Lấy tại kho (Miễn phí)",
      note: "Nhận hàng trực tiếp tại 400 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng",
    };
  }

  // 2. Fetch admin configuration with safe defaults
  const feeDanang = typeof company?.shippingFeeDanang === "number" ? company.shippingFeeDanang : 30000;
  const feeProvince = typeof company?.shippingFeeProvince === "number" ? company.shippingFeeProvince : 50000;
  const freeshipThreshold =
    typeof company?.freeshipThreshold === "number" && company.freeshipThreshold > 0
      ? company.freeshipThreshold
      : 2000000;
  const customNote = company?.shippingNote || undefined;

  // 3. Check Freeship eligibility
  if (subtotal >= freeshipThreshold) {
    return {
      shippingFee: 0,
      isFreeship: true,
      isStorePickup: false,
      amountNeededForFreeship: 0,
      label: "Miễn phí vận chuyển (Freeship)",
      note: customNote || "Đơn hàng đủ điều kiện nhận ưu đãi miễn phí giao hàng toàn quốc!",
    };
  }

  // 4. Calculate based on destination province
  // Province code "48" is Da Nang
  const isDanang = String(provinceCode || "").trim() === "48";
  const standardFee = isDanang ? feeDanang : feeProvince;
  const amountNeeded = Math.max(0, freeshipThreshold - subtotal);

  return {
    shippingFee: standardFee,
    isFreeship: standardFee === 0,
    isStorePickup: false,
    amountNeededForFreeship: amountNeeded,
    label: isDanang
      ? `Giao hỏa tốc Đà Nẵng (${standardFee.toLocaleString("vi-VN")}đ)`
      : `Giao tỉnh / Chành xe (${standardFee.toLocaleString("vi-VN")}đ)`,
    note: customNote,
  };
}
