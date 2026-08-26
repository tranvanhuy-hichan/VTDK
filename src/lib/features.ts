/**
 * ==============================================================================
 * 🚀 MODULAR FEATURE FLAGS CONFIGURATION
 * ==============================================================================
 * Hệ thống kiểm soát bật / tắt các phân hệ chức năng thông qua biến môi trường (.env).
 *
 * Quy tắc:
 * - Mặc định tất cả các tính năng là `true` (Enabled) nếu biến môi trường chưa được đặt.
 * - Chỉ khi đặt rõ ràng `NEXT_PUBLIC_FEATURE_XYZ=false` thì tính năng mới bị vô hiệu hóa.
 * - Tiền tố `NEXT_PUBLIC_` cho phép truy cập an toàn ở cả Server và Client Components.
 */

export const FEATURES = {
  // 1. Phân hệ Báo giá B2B (B2B Quotation Engine)
  b2bQuotation: process.env.NEXT_PUBLIC_FEATURE_B2B_QUOTATION !== "false",
  selfServiceQuote: process.env.NEXT_PUBLIC_FEATURE_SELF_SERVICE_QUOTE !== "false",

  // 2. Phân hệ Bán hàng tại quầy (POS Terminal)
  posTerminal: process.env.NEXT_PUBLIC_FEATURE_POS_TERMINAL !== "false",

  // 3. Phân hệ Giỏ hàng & Mua sắm
  shareCart: process.env.NEXT_PUBLIC_FEATURE_SHARE_CART !== "false",
  quickBuy: process.env.NEXT_PUBLIC_FEATURE_QUICK_BUY !== "false",

  // 4. Phân hệ Kho & Đơn hàng
  deliverySlip: process.env.NEXT_PUBLIC_FEATURE_DELIVERY_SLIP !== "false",
  orderTracking: process.env.NEXT_PUBLIC_FEATURE_ORDER_TRACKING !== "false",

  // 5. Phân hệ Thanh toán & Tài chính
  vietQrPayment: process.env.NEXT_PUBLIC_FEATURE_VIETQR_PAYMENT !== "false",
  vatCalculation: process.env.NEXT_PUBLIC_FEATURE_VAT_CALCULATION !== "false",

  // 6. Phân hệ Quản trị Nâng cao
  themeCustomizer: process.env.NEXT_PUBLIC_FEATURE_THEME_CUSTOMIZER !== "false",
  analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS !== "false",
  mediaGallery: process.env.NEXT_PUBLIC_FEATURE_MEDIA_GALLERY !== "false",
  services: process.env.NEXT_PUBLIC_FEATURE_SERVICES !== "false",

  // 7. Phân hệ Tài khoản Khách hàng
  customerPortal: process.env.NEXT_PUBLIC_FEATURE_CUSTOMER_PORTAL !== "false",
} as const;

export type FeatureKey = keyof typeof FEATURES;

/**
 * Helper kiểm tra xem 1 tính năng cụ thể có đang được bật hay không
 */
export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key] ?? false;
}
