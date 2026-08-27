"use server";

import { createAdminAction } from "../server/actionClient";
import * as galleryService from "../services/gallery.service";

export async function createGalleryImageAction(formData: FormData) {
  return createAdminAction(async () => {
    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File;
    return galleryService.createGalleryImage(title, imageFile);
  }, null);
}

export async function deleteGalleryImageAction(id: string) {
  return createAdminAction(async () => {
    return galleryService.deleteGalleryImage(id);
  }, null);
}
