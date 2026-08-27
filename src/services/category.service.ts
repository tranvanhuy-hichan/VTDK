import { prisma } from "../lib/prisma";
import { slugify } from "./media.service";
import { invalidateMemoryCache } from "../lib/cachedData";
import { revalidatePath, revalidateTag } from "next/cache";

function revalidateCategoryData() {
  revalidatePath("/", "layout");
  revalidatePath("/san-pham");
  revalidatePath("/admin/products");
  invalidateMemoryCache(["categories", "products"]);
  try {
    revalidateTag("categories");
    revalidateTag("products");
  } catch {}
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { products: true },
  });
}

export async function createCategory(name: string) {
  const cleanName = name.trim();
  if (!cleanName) {
    throw new Error("Tên danh mục không được để trống!");
  }

  const slug = slugify(cleanName);
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: cleanName }, { slug }] },
  });

  if (existing) {
    throw new Error("Danh mục này đã tồn tại!");
  }

  const category = await prisma.category.create({
    data: { name: cleanName, slug },
  });

  revalidateCategoryData();
  return category;
}

export async function updateCategory(id: string, name: string) {
  const cleanName = name.trim();
  if (!id || !cleanName) {
    throw new Error("Thông tin danh mục không hợp lệ!");
  }

  const slug = slugify(cleanName);
  const existing = await prisma.category.findFirst({
    where: {
      AND: [{ id: { not: id } }, { OR: [{ name: cleanName }, { slug }] }],
    },
  });

  if (existing) {
    throw new Error("Tên danh mục mới bị trùng với danh mục khác!");
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name: cleanName, slug },
  });

  revalidateCategoryData();
  return updated;
}

export async function deleteCategory(id: string) {
  if (!id) {
    throw new Error("Thiếu ID danh mục cần xóa!");
  }

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(
      `Không thể xóa danh mục đang chứa ${count} sản phẩm! Vui lòng chuyển hoặc xóa sản phẩm trước.`
    );
  }

  const deleted = await prisma.category.delete({ where: { id } });
  revalidateCategoryData();
  return deleted;
}
