import { prisma } from "../lib/prisma";
import {
  uploadMediaFile,
  deleteMediaUrl,
  processGalleryImages,
  deleteRemovedBlobImages,
  isBlobUrl,
  slugify,
  PLACEHOLDER_IMAGE,
} from "./media.service";
import { invalidateMemoryCache } from "../lib/cachedData";
import { revalidatePath, revalidateTag } from "next/cache";

function revalidateProductData() {
  revalidatePath("/", "layout");
  revalidatePath("/san-pham");
  revalidatePath("/admin/products");
  invalidateMemoryCache(["products", "categories"]);
  try {
    revalidateTag("products");
    revalidateTag("categories");
  } catch {}
}

export function parseProductVariants(formData: FormData) {
  const variants: Array<{
    id?: string;
    label: string;
    price: number;
    sku?: string | null;
    barcode?: string | null;
    stock: number;
    sortOrder: number;
  }> = [];

  // 1. Check array fields: variantLabel, variantPrice, variantSku, variantBarcode, variantStock
  const labels = formData.getAll("variantLabel") as string[];
  const prices = formData.getAll("variantPrice") as string[];
  const skus = formData.getAll("variantSku") as string[];
  const barcodes = formData.getAll("variantBarcode") as string[];
  const stocks = formData.getAll("variantStock") as string[];

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]?.trim();
    const priceStr = prices[i]?.trim();
    if (label && priceStr) {
      const price = parseInt(priceStr);
      if (!isNaN(price) && price >= 0) {
        variants.push({
          label,
          price,
          sku: skus[i]?.trim() || null,
          barcode: barcodes[i]?.trim() || null,
          stock: stocks[i] ? Math.max(0, parseInt(stocks[i]) || 0) : 100,
          sortOrder: i,
        });
      }
    }
  }

  // 2. Fallback to variantsJson
  const rawJson = formData.get("variantsJson") as string | null;
  if (rawJson && variants.length === 0) {
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        parsed.forEach((v: any, index: number) => {
          if (v.label && typeof v.label === "string" && v.label.trim()) {
            variants.push({
              id: v.id || undefined,
              label: v.label.trim(),
              price: Math.max(0, parseInt(v.price) || 0),
              sku: v.sku?.trim() || null,
              barcode: v.barcode?.trim() || null,
              stock: Math.max(0, parseInt(v.stock) || 0),
              sortOrder: typeof v.sortOrder === "number" ? v.sortOrder : index,
            });
          }
        });
      }
    } catch {}
  }

  return variants;
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  activeOnly?: boolean;
  search?: string;
}) {
  const where: any = {};
  if (options?.activeOnly) {
    where.active = true;
  }
  if (options?.categoryId) {
    where.categoryId = options.categoryId;
  }
  if (options?.categorySlug && options.categorySlug !== "all") {
    where.category = { slug: options.categorySlug };
  }
  if (options?.search) {
    const q = options.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { barcode: { contains: q } },
    ];
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const price = Math.max(0, parseInt(formData.get("price") as string) || 0);
  const stock = Math.max(0, parseInt(formData.get("stock") as string) || 100);
  const sku = (formData.get("sku") as string)?.trim() || null;
  const barcode = (formData.get("barcode") as string)?.trim() || null;
  const shortDesc = (formData.get("shortDesc") as string)?.trim() || null;
  const active = formData.get("active") !== "false";

  const imageFile = formData.get("image") as File | null;
  const mainImageUrl = formData.get("mainImageUrl") as string | null;
  const variants = parseProductVariants(formData);

  if (!name) throw new Error("Vui lòng nhập tên sản phẩm!");
  if (!categoryId) throw new Error("Vui lòng chọn danh mục cho sản phẩm!");

  let imagePath = PLACEHOLDER_IMAGE;
  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadMediaFile(imageFile, "products");
  } else if (mainImageUrl && mainImageUrl.trim()) {
    imagePath = mainImageUrl.trim();
  }

  let baseSlug = slugify(name);
  let finalSlug = baseSlug;
  let count = 1;
  while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${count++}`;
  }

  const galleryResult = await processGalleryImages(formData, "products");

  const finalSku = variants.length > 0 ? null : sku;
  const finalBarcode = variants.length > 0 ? null : barcode;
  const finalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
    : stock;

  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      sku: finalSku,
      barcode: finalBarcode,
      stock: finalStock,
      price,
      shortDesc,
      active,
      image: imagePath,
      images: galleryResult.images,
      categoryId,
    },
  });

  // Create variants
  for (const v of variants) {
    const vId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ProductVariant" ("id", "productId", "label", "price", "sku", "barcode", "stock", "sortOrder", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      vId,
      product.id,
      v.label,
      v.price,
      v.sku || null,
      v.barcode || null,
      v.stock ?? 100,
      v.sortOrder
    );
  }

  revalidateProductData();
  return product;
}

export async function updateProduct(id: string, formData: FormData) {
  if (!id) throw new Error("Thiếu ID sản phẩm cần cập nhật!");

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!existingProduct) throw new Error("Sản phẩm không tồn tại!");

  const name = (formData.get("name") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const price = Math.max(0, parseInt(formData.get("price") as string) || 0);
  const stock = Math.max(0, parseInt(formData.get("stock") as string) || 100);
  const sku = (formData.get("sku") as string)?.trim() || null;
  const barcode = (formData.get("barcode") as string)?.trim() || null;
  const shortDesc = (formData.get("shortDesc") as string)?.trim() || null;
  const active = formData.get("active") !== "false";

  const imageFile = formData.get("image") as File | null;
  const mainImageUrl = formData.get("mainImageUrl") as string | null;
  const variants = parseProductVariants(formData);

  if (!name) throw new Error("Vui lòng nhập tên sản phẩm!");
  if (!categoryId) throw new Error("Vui lòng chọn danh mục!");

  let imagePath = existingProduct.image;
  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadMediaFile(imageFile, "products");
    if (isBlobUrl(existingProduct.image) && existingProduct.image !== mainImageUrl) {
      await deleteMediaUrl(existingProduct.image);
    }
  } else if (mainImageUrl && mainImageUrl.trim()) {
    imagePath = mainImageUrl.trim();
  } else if (formData.get("removeImage") === "true") {
    if (isBlobUrl(existingProduct.image)) {
      await deleteMediaUrl(existingProduct.image);
    }
    imagePath = PLACEHOLDER_IMAGE;
  }

  let finalSlug = existingProduct.slug;
  if (existingProduct.name !== name) {
    let baseSlug = slugify(name);
    finalSlug = baseSlug;
    let count = 1;
    while (
      await prisma.product.findFirst({
        where: { slug: finalSlug, NOT: { id } },
      })
    ) {
      finalSlug = `${baseSlug}-${count++}`;
    }
  }

  const galleryResult = await processGalleryImages(formData, "products");
  await deleteRemovedBlobImages(existingProduct.images, galleryResult.images);

  const finalSku = variants.length > 0 ? null : sku;
  const finalBarcode = variants.length > 0 ? null : barcode;
  const finalStock = variants.length > 0
    ? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
    : stock;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: finalSlug,
      sku: finalSku,
      barcode: finalBarcode,
      stock: finalStock,
      price,
      shortDesc,
      active,
      image: imagePath,
      images: galleryResult.images,
      categoryId,
    },
  });

  // Re-create variants
  await prisma.$executeRawUnsafe(`DELETE FROM "ProductVariant" WHERE "productId" = $1`, id);
  for (const v of variants) {
    const vId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ProductVariant" ("id", "productId", "label", "price", "sku", "barcode", "stock", "sortOrder", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      vId,
      id,
      v.label,
      v.price,
      v.sku || null,
      v.barcode || null,
      v.stock ?? 100,
      v.sortOrder
    );
  }

  revalidateProductData();
  return updated;
}

export async function toggleProductActive(id: string, active: boolean) {
  const updated = await prisma.product.update({
    where: { id },
    data: { active },
  });
  revalidateProductData();
  return updated;
}

export async function deleteProduct(id: string) {
  if (!id) throw new Error("Thiếu ID sản phẩm cần xóa!");

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) throw new Error("Sản phẩm không tồn tại!");

  await deleteMediaUrl(existingProduct.image);
  await deleteRemovedBlobImages(existingProduct.images, []);

  const deleted = await prisma.product.delete({ where: { id } });
  revalidateProductData();
  return deleted;
}
