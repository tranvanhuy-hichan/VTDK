import { prisma } from "../lib/prisma";
import {
  uploadMediaFile,
  deleteMediaUrl,
  processGalleryImages,
  deleteRemovedBlobImages,
  isBlobUrl,
  PLACEHOLDER_IMAGE,
} from "./media.service";
import { invalidateMemoryCache } from "../lib/cachedData";
import { revalidatePath, revalidateTag } from "next/cache";

export const SERVICE_ICONS = ["Building2", "Fan", "Wind", "ThermometerSun"];

function revalidateServiceData() {
  revalidatePath("/", "layout");
  revalidatePath("/giai-phap");
  revalidatePath("/admin/services");
  invalidateMemoryCache(["services"]);
  try {
    revalidateTag("services");
  } catch {}
}

export function parseFeatures(formData: FormData): string[] {
  const features: string[] = [];
  const rawFeatures = formData.getAll("features") as string[];

  for (const f of rawFeatures) {
    if (typeof f === "string" && f.trim()) {
      features.push(f.trim());
    }
  }

  const rawFeaturesJson = formData.get("featuresJson") as string | null;
  if (rawFeaturesJson) {
    try {
      const parsed = JSON.parse(rawFeaturesJson);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string" && item.trim() && !features.includes(item.trim())) {
            features.push(item.trim());
          }
        }
      }
    } catch {}
  }

  return features;
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
  });
}

export async function createService(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const icon = (formData.get("icon") as string) || "ThermometerSun";
  const imageFile = formData.get("image") as File | null;
  const mainImageUrl = formData.get("mainImageUrl") as string | null;
  const features = parseFeatures(formData);

  if (!title || !description) {
    throw new Error("Vui lòng nhập đầy đủ tiêu đề và mô tả!");
  }
  if (!SERVICE_ICONS.includes(icon)) {
    throw new Error("Biểu tượng không hợp lệ!");
  }

  let imagePath = "";
  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadMediaFile(imageFile, "services");
  } else if (mainImageUrl && mainImageUrl.trim()) {
    imagePath = mainImageUrl.trim();
  } else {
    throw new Error("Vui lòng chọn hình ảnh cho giải pháp!");
  }

  const maxOrder = await prisma.service.aggregate({ _max: { sortOrder: true } });
  const galleryResult = await processGalleryImages(formData, "services");

  const service = await prisma.service.create({
    data: {
      title,
      description,
      features,
      icon,
      image: imagePath,
      images: galleryResult.images,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidateServiceData();
  return service;
}

export async function updateService(id: string, formData: FormData) {
  if (!id) {
    throw new Error("Thiếu ID giải pháp cần cập nhật!");
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const icon = (formData.get("icon") as string) || "ThermometerSun";
  const imageFile = formData.get("image") as File | null;
  const mainImageUrl = formData.get("mainImageUrl") as string | null;
  const features = parseFeatures(formData);

  if (!title || !description) {
    throw new Error("Vui lòng nhập đầy đủ tiêu đề và mô tả!");
  }
  if (!SERVICE_ICONS.includes(icon)) {
    throw new Error("Biểu tượng không hợp lệ!");
  }

  const existingService = await prisma.service.findUnique({ where: { id } });
  if (!existingService) {
    throw new Error("Giải pháp không tồn tại!");
  }

  let imagePath = existingService.image;
  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadMediaFile(imageFile, "services");
    if (isBlobUrl(existingService.image) && existingService.image !== mainImageUrl) {
      await deleteMediaUrl(existingService.image);
    }
  } else if (mainImageUrl && mainImageUrl.trim()) {
    imagePath = mainImageUrl.trim();
  } else if (formData.get("removeImage") === "true") {
    if (isBlobUrl(existingService.image)) {
      await deleteMediaUrl(existingService.image);
    }
    imagePath = PLACEHOLDER_IMAGE;
  }

  const galleryResult = await processGalleryImages(formData, "services");
  await deleteRemovedBlobImages(existingService.images, galleryResult.images);

  const updated = await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      features,
      icon,
      image: imagePath,
      images: galleryResult.images,
    },
  });

  revalidateServiceData();
  return updated;
}

export async function deleteService(id: string) {
  if (!id) {
    throw new Error("Thiếu ID giải pháp cần xóa!");
  }

  const existingService = await prisma.service.findUnique({ where: { id } });
  if (!existingService) {
    throw new Error("Giải pháp không tồn tại!");
  }

  await deleteMediaUrl(existingService.image);
  await deleteRemovedBlobImages(existingService.images, []);

  const deleted = await prisma.service.delete({ where: { id } });
  revalidateServiceData();
  return deleted;
}
