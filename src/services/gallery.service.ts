import { prisma } from "../lib/prisma";
import { uploadMediaFile, deleteMediaUrl } from "./media.service";
import { revalidateDomain } from "./cache.service";

function revalidateGalleryData() {
  revalidateDomain(["gallery"]);
}

export async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createGalleryImage(title: string, imageFile: File) {
  if (!title?.trim()) {
    throw new Error("Vui lòng nhập tiêu đề ảnh!");
  }
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Vui lòng chọn tệp hình ảnh!");
  }

  const imageUrl = await uploadMediaFile(imageFile, "gallery");
  const maxOrder = await prisma.galleryImage.aggregate({
    _max: { sortOrder: true },
  });

  const image = await prisma.galleryImage.create({
    data: {
      url: imageUrl,
      title: title.trim(),
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidateGalleryData();
  return image;
}

export async function deleteGalleryImage(id: string) {
  if (!id) {
    throw new Error("Thiếu ID hình ảnh cần xóa!");
  }

  const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existingImage) {
    throw new Error("Ảnh không tồn tại!");
  }

  await deleteMediaUrl(existingImage.url);
  const deleted = await prisma.galleryImage.delete({ where: { id } });

  revalidateGalleryData();
  return deleted;
}
