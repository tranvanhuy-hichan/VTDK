"use server";

import { createAdminAction } from "../server/actionClient";
import * as categoryService from "../services/category.service";

export async function createCategoryAction(nameOrFormData: string | FormData) {
  return createAdminAction(async () => {
    const name =
      typeof nameOrFormData === "string"
        ? nameOrFormData
        : (nameOrFormData.get("name") as string);
    return categoryService.createCategory(name);
  }, null);
}

export async function updateCategoryAction(
  idOrFormData: string | FormData,
  maybeName?: string
) {
  return createAdminAction(async () => {
    let id: string;
    let name: string;

    if (idOrFormData instanceof FormData) {
      id = idOrFormData.get("id") as string;
      name = idOrFormData.get("name") as string;
    } else {
      id = idOrFormData;
      name = maybeName!;
    }

    return categoryService.updateCategory(id, name);
  }, null);
}

export async function deleteCategoryAction(id: string) {
  return createAdminAction(async () => {
    return categoryService.deleteCategory(id);
  }, null);
}
