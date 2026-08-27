"use server";

import { createAdminAction } from "../server/actionClient";
import * as productService from "../services/product.service";

export async function createProductAction(formData: FormData) {
  return createAdminAction(async () => {
    return productService.createProduct(formData);
  }, null);
}

export async function updateProductAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  return createAdminAction(async () => {
    const formData = idOrFormData instanceof FormData ? idOrFormData : maybeFormData!;
    const id = idOrFormData instanceof FormData ? (formData.get("id") as string) : (idOrFormData as string);
    return productService.updateProduct(id, formData);
  }, null);
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  return createAdminAction(async () => {
    return productService.toggleProductActive(id, active);
  }, null);
}

export async function deleteProductAction(id: string) {
  return createAdminAction(async () => {
    return productService.deleteProduct(id);
  }, null);
}
