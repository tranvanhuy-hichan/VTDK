import type { CompanyContact } from "./company";
import type { ShippingMethod } from "../types/order";
import { isSameProvince, findProvinceByCity } from "./vietnamProvinces";

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
 * Universally designed for any business in any province/city
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
    const pickupAddress = company?.address ? `Nhận hàng trực tiếp tại ${company.address}` : "Nhận hàng trực tiếp tại kho / cửa hàng của doanh nghiệp";
    return {
      shippingFee: 0,
      isFreeship: true,
      isStorePickup: true,
      amountNeededForFreeship: 0,
      label: "Lấy tại kho (Miễn phí)",
      note: pickupAddress,
    };
  }

  // 2. Fetch admin configuration with safe defaults
  // feeLocal: Shipping fee for customer within the same province/city as the business
  // feeProvince: Shipping fee for customers in other provinces/cities (inter-provincial)
  const feeLocal = typeof company?.shippingFeeDanang === "number" ? company.shippingFeeDanang : 30000;
  const feeProvince = typeof company?.shippingFeeProvince === "number" ? company.shippingFeeProvince : 50000;
  const freeshipThreshold =
    typeof company?.freeshipThreshold === "number" && company.freeshipThreshold > 0
      ? company.freeshipThreshold
      : 2000000;
  const customNote = company?.shippingNote || undefined;

  // 3. Check Freeship eligibility
  // freeshipProvinces can be ["ALL"], empty (means all), or a list of province codes e.g. ["48", "01", "79"]
  const freeshipProvinces =
    Array.isArray(company?.freeshipProvinces) && company.freeshipProvinces.length > 0
      ? company.freeshipProvinces
      : ["ALL"];

  const isAllProvinces = freeshipProvinces.includes("ALL");
  const normProvinceCode = String(provinceCode || "").trim();
  const isProvinceFreeshipEligible =
    isAllProvinces || (normProvinceCode ? freeshipProvinces.includes(normProvinceCode) : false);

  // 4. Calculate fee based on destination province vs company home province
  const isLocal = isSameProvince(normProvinceCode, company?.city || "");
  const standardFee = isLocal ? feeLocal : feeProvince;

  if (isProvinceFreeshipEligible && subtotal >= freeshipThreshold) {
    return {
      shippingFee: 0,
      isFreeship: true,
      isStorePickup: false,
      amountNeededForFreeship: 0,
      label: "Miễn phí vận chuyển (Freeship)",
      note: customNote || "Đơn hàng đủ điều kiện nhận ưu đãi miễn phí giao hàng!",
    };
  }

  const amountNeeded = isProvinceFreeshipEligible
    ? Math.max(0, freeshipThreshold - subtotal)
    : 0;

  const localCityName = company?.city?.trim() ? company.city.trim() : "nội tỉnh";

  return {
    shippingFee: standardFee,
    isFreeship: standardFee === 0,
    isStorePickup: false,
    amountNeededForFreeship: amountNeeded,
    label: isLocal
      ? `Giao nội tỉnh ${localCityName} (${standardFee.toLocaleString("vi-VN")}đ)`
      : `Giao liên tỉnh / Chành xe (${standardFee.toLocaleString("vi-VN")}đ)`,
    note: customNote,
  };
}
