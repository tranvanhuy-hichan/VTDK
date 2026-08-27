import path from "path";
import fs from "fs/promises";
import { put, del } from "@vercel/blob";

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("https://") && url.includes("public.blob.vercel-storage.com");
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Collapse dashes
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

export function sanitizeFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);
  const safeBase = slugify(baseName).slice(0, 50) || "upload";
  return `${safeBase}${ext}`;
}

export function validateImageFile(file: File): { valid: true } | { valid: false; error: string } {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return { valid: false, error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
  }
  return { valid: true };
}

export async function uploadMediaFile(file: File, folder: string): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const safeName = sanitizeFileName(file.name);
  const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
    access: "public",
  });
  return blob.url;
}

export async function deleteMediaUrl(url: string | null | undefined): Promise<void> {
  if (!url || url === PLACEHOLDER_IMAGE) return;

  try {
    if (isBlobUrl(url)) {
      await del(url).catch(() => {});
    } else if (url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", url);
      await fs.unlink(filePath).catch(() => {});
    }
  } catch (err) {
    console.warn(`Failed to delete media URL: ${url}`, err);
  }
}

export async function deleteRemovedBlobImages(
  existingImages: string[] = [],
  newImages: string[] = []
): Promise<void> {
  const removedBlobs = existingImages.filter((oldUrl) => !newImages.includes(oldUrl) && isBlobUrl(oldUrl));
  if (removedBlobs.length > 0) {
    await Promise.all(removedBlobs.map((url) => del(url).catch(() => {})));
  }
}

export async function processGalleryImages(
  formData: FormData,
  folder: string
): Promise<{ images: string[] }> {
  const newImages: string[] = [];

  // 1. Preserve existing images sent as string URLs
  const existingUrls = formData.getAll("existingImages") as string[];
  for (const url of existingUrls) {
    if (typeof url === "string" && url.trim() && !url.startsWith("[")) {
      newImages.push(url.trim());
    }
  }

  const existingImagesJson = formData.get("existingImages") as string | null;
  if (existingImagesJson && existingImagesJson.startsWith("[")) {
    try {
      const parsed = JSON.parse(existingImagesJson);
      if (Array.isArray(parsed)) {
        for (const url of parsed) {
          if (typeof url === "string" && url.trim() && !newImages.includes(url.trim())) {
            newImages.push(url.trim());
          }
        }
      }
    } catch {}
  }

  // 2. Process newly uploaded image files (both galleryImages and galleryFiles)
  const galleryFiles = [
    ...(formData.getAll("galleryImages") as File[]),
    ...(formData.getAll("galleryFiles") as File[]),
  ];
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const url = await uploadMediaFile(file, folder);
      newImages.push(url);
    }
  }

  return { images: newImages };
}
