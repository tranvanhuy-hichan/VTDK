"use server";

import * as productActions from "./productActions";
import * as categoryActions from "./categoryActions";
import * as serviceActions from "./serviceActions";
import * as galleryActions from "./galleryActions";
import * as companyActions from "./companyActions";
import * as authActions from "./authActions";
import * as analyticsActions from "./analyticsActions";
import * as posActions from "./posActions";
import * as orderActions from "./orderActions";
import { getCurrentAdmin } from "../lib/auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return Boolean(admin);
}

// Product
export async function createProductAction(formData: FormData) {
  return productActions.createProductAction(formData);
}

export async function updateProductAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  return productActions.updateProductAction(idOrFormData, maybeFormData);
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  return productActions.toggleProductActiveAction(id, active);
}

export async function deleteProductAction(id: string) {
  return productActions.deleteProductAction(id);
}

// Category
export async function createCategoryAction(nameOrFormData: string | FormData) {
  return categoryActions.createCategoryAction(nameOrFormData);
}

export async function updateCategoryAction(
  idOrFormData: string | FormData,
  maybeName?: string
) {
  return categoryActions.updateCategoryAction(idOrFormData, maybeName);
}

export async function deleteCategoryAction(id: string) {
  return categoryActions.deleteCategoryAction(id);
}

// Service
export async function createServiceAction(formData: FormData) {
  return serviceActions.createServiceAction(formData);
}

export async function updateServiceAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  return serviceActions.updateServiceAction(idOrFormData, maybeFormData);
}

export async function deleteServiceAction(id: string) {
  return serviceActions.deleteServiceAction(id);
}

// Gallery
export async function createGalleryImageAction(formData: FormData) {
  return galleryActions.createGalleryImageAction(formData);
}

export async function deleteGalleryImageAction(id: string) {
  return galleryActions.deleteGalleryImageAction(id);
}

// Company
export async function updateCompanyInfoAction(formData: FormData) {
  return companyActions.updateCompanyInfoAction(formData);
}

export async function updateCompanyShippingAction(input: any) {
  return companyActions.updateCompanyShippingAction(input);
}

export async function updateThemeSettingsAction(themeData: any) {
  return companyActions.updateThemeSettingsAction(themeData);
}

// Auth
export async function registerAction(dto: any) {
  return authActions.registerAction(dto);
}

export async function loginAction(dto: any) {
  return authActions.loginAction(dto);
}

export async function googleLoginAction(credential: string) {
  return authActions.googleLoginAction(credential);
}

export async function completeGoogleAccountAction(dto: any) {
  return authActions.completeGoogleAccountAction(dto);
}

export async function logoutAction() {
  return authActions.logoutAction();
}

export async function getProfileUserAction() {
  return authActions.getProfileUserAction();
}

export async function updateUserAddressAction(address: string, phone?: string) {
  return authActions.updateUserAddressAction(address, phone);
}

export async function updateUserProfileInfoAction(dto: any) {
  return authActions.updateUserProfileInfoAction(dto);
}

export async function changePasswordAction(dtoOrOldPass: any, maybeNewPass?: string) {
  return authActions.changePasswordAction(dtoOrOldPass, maybeNewPass);
}

// Analytics
export async function getAdminAnalyticsAction(timeRange?: any) {
  return analyticsActions.getAdminAnalyticsAction(timeRange);
}

// POS
export async function searchPosProductsAction(query?: string) {
  return posActions.searchPosProductsAction(query);
}

export async function createPosOrderAction(payload: any) {
  return posActions.createPosOrderAction(payload);
}

// Orders
export async function createOrderAction(dto: any) {
  return orderActions.createOrderAction(dto);
}

export async function getOrderByCodeAction(orderCode: string) {
  return orderActions.getOrderByCodeAction(orderCode);
}

export async function lookupOrderAction(query: string) {
  return orderActions.lookupOrderAction(query);
}

export async function getMyOrdersAction() {
  return orderActions.getMyOrdersAction();
}

export async function adminGetOrdersAction(statusFilter?: any) {
  return orderActions.adminGetOrdersAction(statusFilter);
}

export async function adminUpdateOrderStatusAction(orderId: string, status: any) {
  return orderActions.adminUpdateOrderStatusAction(orderId, status);
}

export async function adminCheckNewOrdersAction() {
  return orderActions.adminCheckNewOrdersAction();
}
