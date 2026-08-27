"use server";

import * as adminActions from "../../actions/adminActions";

export async function isAdminAuthenticated() {
  return adminActions.isAdminAuthenticated();
}

export async function createProductAction(formData: FormData) {
  return adminActions.createProductAction(formData);
}

export async function updateProductAction(idOrFormData: string | FormData, maybeFormData?: FormData) {
  return adminActions.updateProductAction(idOrFormData, maybeFormData);
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  return adminActions.toggleProductActiveAction(id, active);
}

export async function deleteProductAction(id: string) {
  return adminActions.deleteProductAction(id);
}

export async function createCategoryAction(nameOrFormData: string | FormData) {
  return adminActions.createCategoryAction(nameOrFormData);
}

export async function updateCategoryAction(idOrFormData: string | FormData, maybeName?: string) {
  return adminActions.updateCategoryAction(idOrFormData, maybeName);
}

export async function deleteCategoryAction(id: string) {
  return adminActions.deleteCategoryAction(id);
}

export async function createServiceAction(formData: FormData) {
  return adminActions.createServiceAction(formData);
}

export async function updateServiceAction(idOrFormData: string | FormData, maybeFormData?: FormData) {
  return adminActions.updateServiceAction(idOrFormData, maybeFormData);
}

export async function deleteServiceAction(id: string) {
  return adminActions.deleteServiceAction(id);
}

export async function createGalleryImageAction(formData: FormData) {
  return adminActions.createGalleryImageAction(formData);
}

export async function deleteGalleryImageAction(id: string) {
  return adminActions.deleteGalleryImageAction(id);
}

export async function updateCompanyInfoAction(formData: FormData) {
  return adminActions.updateCompanyInfoAction(formData);
}

export async function updateCompanyShippingAction(input: any) {
  return adminActions.updateCompanyShippingAction(input);
}

export async function updateThemeSettingsAction(themeData: any) {
  return adminActions.updateThemeSettingsAction(themeData);
}

export async function registerAction(dto: any) {
  return adminActions.registerAction(dto);
}

export async function loginAction(dto: any) {
  return adminActions.loginAction(dto);
}

export async function googleLoginAction(credential: string) {
  return adminActions.googleLoginAction(credential);
}

export async function completeGoogleAccountAction(dto: any) {
  return adminActions.completeGoogleAccountAction(dto);
}

export async function logoutAction() {
  return adminActions.logoutAction();
}

export async function getProfileUserAction() {
  return adminActions.getProfileUserAction();
}

export async function updateUserAddressAction(address: string, phone?: string) {
  return adminActions.updateUserAddressAction(address, phone);
}

export async function updateUserProfileInfoAction(dto: any) {
  return adminActions.updateUserProfileInfoAction(dto);
}

export async function changePasswordAction(dtoOrOldPass: any, maybeNewPass?: string) {
  return adminActions.changePasswordAction(dtoOrOldPass, maybeNewPass);
}

export async function getAdminAnalyticsAction(timeRange?: any) {
  return adminActions.getAdminAnalyticsAction(timeRange);
}

export async function searchPosProductsAction(query?: string) {
  return adminActions.searchPosProductsAction(query);
}

export async function createPosOrderAction(payload: any) {
  return adminActions.createPosOrderAction(payload);
}

export async function createOrderAction(dto: any) {
  return adminActions.createOrderAction(dto);
}

export async function getOrderByCodeAction(orderCode: string) {
  return adminActions.getOrderByCodeAction(orderCode);
}

export async function lookupOrderAction(query: string) {
  return adminActions.lookupOrderAction(query);
}

export async function getMyOrdersAction() {
  return adminActions.getMyOrdersAction();
}

export async function adminGetOrdersAction(statusFilter?: any) {
  return adminActions.adminGetOrdersAction(statusFilter);
}

export async function adminUpdateOrderStatusAction(orderId: string, status: any) {
  return adminActions.adminUpdateOrderStatusAction(orderId, status);
}

export async function adminCheckNewOrdersAction() {
  return adminActions.adminCheckNewOrdersAction();
}
