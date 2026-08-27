"use server";

import { createAdminAction } from "../server/actionClient";
import * as posService from "../services/pos.service";
import type { PosProductItem, PosCartItem, CreatePosOrderPayload } from "../services/pos.service";

export type { PosProductItem, PosCartItem, CreatePosOrderPayload } from "../services/pos.service";

/**
 * Fast POS Product & Barcode Search
 */
export async function searchPosProductsAction(query?: string): Promise<{
  exactBarcodeMatch?: PosProductItem;
  products?: PosProductItem[];
  error?: string;
}> {
  return createAdminAction(async () => {
    return posService.searchPosProducts(query);
  }, null).then((res) => {
    if (res.success && res.data) {
      return res.data;
    }
    return { error: res.error || "Lỗi tra cứu sản phẩm POS!" };
  });
}

/**
 * Create a POS Counter Order (Bán Hàng Tại Quầy)
 */
export async function createPosOrderAction(payload: CreatePosOrderPayload): Promise<{
  success?: boolean;
  order?: any;
  orderCode?: string;
  orderId?: string;
  totalAmount?: number;
  createdAt?: string;
  error?: string;
}> {
  return createAdminAction(async () => {
    return posService.createPosOrder(payload);
  }, null).then((res) => {
    if (res.success && res.data) {
      return { success: true, ...res.data };
    }
    return { error: res.error || "Không thể tạo đơn hàng tại quầy!" };
  });
}
