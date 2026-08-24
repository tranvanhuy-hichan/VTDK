"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";
import { prisma } from "../lib/prisma";
import { comparePassword, setAuthCookie, clearAuthCookie, getCurrentAdmin } from "../lib/auth";
import { ensureDefaultAdmin, DEFAULT_ADMIN_EMAIL } from "../lib/seedAdmin";

const SESSION_COOKIE = "admin_session";
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// Simple slugify function
function slugify(text: string): string {
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

// Parse repeatable variant rows (label + price) from FormData
function parseVariants(formData: FormData) {
  const labels = formData.getAll("variantLabel") as string[];
  const prices = formData.getAll("variantPrice") as string[];

  const variants: { label: string; price: number; sortOrder: number }[] = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]?.trim();
    const price = parseInt(prices[i], 10);
    if (label && !isNaN(price)) {
      variants.push({ label, price, sortOrder: i });
    }
  }
  return variants;
}

// Parse repeatable feature bullet rows from FormData
function parseFeatures(formData: FormData) {
  return (formData.getAll("feature") as string[])
    .map((f) => f.trim())
    .filter((f) => f.length > 0);
}

const isBlobUrl = (url: string) =>
  url.startsWith("https://") && url.includes("public.blob.vercel-storage.com");

// Upload any new gallery image files (field "newImages") to Vercel Blob and
// combine with the existing URLs the client kept (field "existingImages").
async function processGalleryImages(
  formData: FormData,
  folder: string
): Promise<{ images: string[] } | { error: string }> {
  const existingImages = (formData.getAll("existingImages") as string[]).filter(Boolean);
  const newFiles = (formData.getAll("newImages") as File[]).filter((f) => f && f.size > 0);

  const uploadedUrls: string[] = [];
  for (const file of newFiles) {
    if (file.size > 5 * 1024 * 1024) {
      return { error: `Ảnh "${file.name}" vượt quá 5MB!` };
    }
    const ext = path.extname(file.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return { error: `Ảnh "${file.name}" sai định dạng. Chỉ chấp nhận JPG, JPEG, PNG, WEBP.` };
    }
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, { access: "public" });
    uploadedUrls.push(blob.url);
  }

  return { images: [...existingImages, ...uploadedUrls] };
}

// Delete blob-hosted images that were removed (present in oldImages but not in keptImages)
async function deleteRemovedBlobImages(oldImages: string[], keptImages: string[]) {
  const keptSet = new Set(keptImages);
  await Promise.all(
    oldImages
      .filter((url) => !keptSet.has(url) && isBlobUrl(url))
      .map((url) => del(url).catch(() => {}))
  );
}

// 1. Admin Login
export async function loginAction(emailOrPassword: string, maybePassword?: string) {
  let email = "";
  let password = "";
  if (maybePassword !== undefined) {
    email = emailOrPassword.trim().toLowerCase();
    password = maybePassword;
  } else {
    email = DEFAULT_ADMIN_EMAIL.toLowerCase();
    password = emailOrPassword;
  }

  await ensureDefaultAdmin();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== "ADMIN" || !user.passwordHash) {
    return { error: "Tài khoản quản trị không tồn tại hoặc không đúng quyền!" };
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return { error: "Mật khẩu không chính xác!" };
  }

  await setAuthCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "ADMIN",
  });

  return { success: true };
}

// 2. Admin Logout
export async function logoutAction() {
  await clearAuthCookie();
}

// Check session server-side helper (Database-backed role check)
export async function isAdminAuthenticated() {
  const admin = await getCurrentAdmin();
  return !!admin;
}


// 3. Create Product
export async function createProductAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const categoryId = formData.get("categoryId") as string;
    const active = formData.get("active") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!name || !priceStr || !categoryId) {
      return { error: "Vui lòng nhập đầy đủ các trường bắt buộc!" };
    }

    const price = parseInt(priceStr, 10);
    if (isNaN(price)) {
      return { error: "Giá sản phẩm phải là số hợp lệ!" };
    }

    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    let imagePath = PLACEHOLDER_IMAGE;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });
      imagePath = blob.url;
    } else if (mainImageUrl && mainImageUrl.trim()) {
      imagePath = mainImageUrl.trim();
    }

    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${count++}`;
    }

    const variants = parseVariants(formData);

    const galleryResult = await processGalleryImages(formData, "products");
    if ("error" in galleryResult) {
      return { error: galleryResult.error };
    }

    await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        price,
        shortDesc: shortDesc || null,
        image: imagePath,
        images: galleryResult.images,
        active,
        categoryId,
        variants: { create: variants },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi thêm sản phẩm!" };
  }
}

// 4. Update Product
export async function updateProductAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const formData = idOrFormData instanceof FormData ? idOrFormData : maybeFormData!;
    const id = idOrFormData instanceof FormData ? (formData.get("id") as string) : (idOrFormData as string);

    if (!id) {
      return { error: "Thiếu ID sản phẩm cần cập nhật!" };
    }
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const categoryId = formData.get("categoryId") as string;
    const active = formData.get("active") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!name || !priceStr || !categoryId) {
      return { error: "Vui lòng nhập đầy đủ các trường bắt buộc!" };
    }

    const price = parseInt(priceStr, 10);
    if (isNaN(price)) {
      return { error: "Giá sản phẩm phải là số hợp lệ!" };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { error: "Sản phẩm không tồn tại!" };
    }

    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    let imagePath = existingProduct.image;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });

      if (isBlobUrl(existingProduct.image) && existingProduct.image !== mainImageUrl) {
        await del(existingProduct.image).catch(() => {});
      }

      imagePath = blob.url;
    } else if (mainImageUrl && mainImageUrl.trim()) {
      imagePath = mainImageUrl.trim();
    } else if (formData.get("removeImage") === "true") {
      if (isBlobUrl(existingProduct.image)) {
        await del(existingProduct.image).catch(() => {});
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

    const variants = parseVariants(formData);

    const galleryResult = await processGalleryImages(formData, "products");
    if ("error" in galleryResult) {
      return { error: galleryResult.error };
    }
    await deleteRemovedBlobImages(existingProduct.images, galleryResult.images);

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        price,
        shortDesc: shortDesc || null,
        image: imagePath,
        images: galleryResult.images,
        active,
        categoryId,
        variants: {
          deleteMany: {},
          create: variants,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi sửa sản phẩm!" };
  }
}

// 5. Toggle Product Active Status
export async function toggleProductActiveAction(id: string, active: boolean) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    await prisma.product.update({
      where: { id },
      data: { active },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống!" };
  }
}

// 6. Delete Product
export async function deleteProductAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { error: "Sản phẩm không tồn tại!" };
    }

    if (existingProduct.image.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", existingProduct.image);
      await fs.unlink(filePath).catch(() => {});
    } else if (isBlobUrl(existingProduct.image)) {
      await del(existingProduct.image).catch(() => {});
    }
    await Promise.all(
      existingProduct.images.filter(isBlobUrl).map((url) => del(url).catch(() => {}))
    );

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi xóa sản phẩm!" };
  }
}

// 7. Upload Gallery Image
export async function createGalleryImageAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const title = (formData.get("title") as string)?.trim();
    const imageFile = formData.get("image") as File | null;

    if (!title) {
      return { error: "Vui lòng nhập tiêu đề ảnh!" };
    }
    if (!imageFile || imageFile.size === 0) {
      return { error: "Vui lòng chọn tệp hình ảnh!" };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
    }

    const ext = path.extname(imageFile.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
    }

    const blob = await put(`gallery/${Date.now()}-${imageFile.name}`, imageFile, {
      access: "public",
    });

    const maxOrder = await prisma.galleryImage.aggregate({
      _max: { sortOrder: true },
    });

    await prisma.galleryImage.create({
      data: {
        url: blob.url,
        title,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    revalidatePath("/api/gallery");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi thêm ảnh!" };
  }
}

// 8. Delete Gallery Image
export async function deleteGalleryImageAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existingImage) {
      return { error: "Ảnh không tồn tại!" };
    }

    if (
      existingImage.url.startsWith("https://") &&
      existingImage.url.includes("public.blob.vercel-storage.com")
    ) {
      await del(existingImage.url).catch(() => {});
    }

    await prisma.galleryImage.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    revalidatePath("/api/gallery");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi xóa ảnh!" };
  }
}

// 9. Update Company Info
export async function updateCompanyInfoAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const name = (formData.get("name") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const hotline = (formData.get("hotline") as string)?.trim();
    const hotlineRaw = (formData.get("hotlineRaw") as string)?.trim();
    const zaloUrl = (formData.get("zaloUrl") as string)?.trim();
    const whatsAppUrl = (formData.get("whatsAppUrl") as string)?.trim();
    const facebookUrl = (formData.get("facebookUrl") as string)?.trim();
    const googleMapsUrl = (formData.get("googleMapsUrl") as string)?.trim();
    const googleMapsEmbed = (formData.get("googleMapsEmbed") as string)?.trim();
    const workingHours = (formData.get("workingHours") as string)?.trim();
    const hasDelivery = formData.get("hasDelivery") === "true";
    const imageFile = formData.get("image") as File | null;

    if (
      !name ||
      !address ||
      !hotline ||
      !hotlineRaw ||
      !zaloUrl ||
      !whatsAppUrl ||
      !facebookUrl ||
      !googleMapsUrl ||
      !googleMapsEmbed ||
      !workingHours
    ) {
      return { error: "Vui lòng nhập đầy đủ các trường!" };
    }

    const existing = await prisma.companyInfo.findFirst();

    let imagePath = existing?.image ?? "/images/storefront.png";

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      const blob = await put(`company/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });

      if (existing && isBlobUrl(existing.image)) {
        await del(existing.image).catch(() => {});
      }

      imagePath = blob.url;
    } else if (formData.get("removeImage") === "true") {
      if (existing && isBlobUrl(existing.image)) {
        await del(existing.image).catch(() => {});
      }
      imagePath = PLACEHOLDER_IMAGE;
    }

    const galleryResult = await processGalleryImages(formData, "company");
    if ("error" in galleryResult) {
      return { error: galleryResult.error };
    }
    if (existing) {
      await deleteRemovedBlobImages(existing.images, galleryResult.images);
    }

    const data = {
      name,
      address,
      hotline,
      hotlineRaw,
      zaloUrl,
      whatsAppUrl,
      facebookUrl,
      googleMapsUrl,
      googleMapsEmbed,
      workingHours,
      hasDelivery,
      image: imagePath,
      images: galleryResult.images,
    };

    if (existing) {
      await prisma.companyInfo.update({ where: { id: existing.id }, data });
    } else {
      await prisma.companyInfo.create({ data });
    }

    revalidatePath("/");
    revalidatePath("/admin/company");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi cập nhật thông tin công ty!" };
  }
}

const SERVICE_ICONS = ["Building2", "Fan", "Wind", "ThermometerSun"];

// 10. Create Service
export async function createServiceAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const icon = (formData.get("icon") as string) || "ThermometerSun";
    const imageFile = formData.get("image") as File | null;
    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    const features = parseFeatures(formData);
    let imagePath = "";

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }
      if (!SERVICE_ICONS.includes(icon)) {
        return { error: "Biểu tượng không hợp lệ!" };
      }

      const blob = await put(`services/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });
      imagePath = blob.url;
    } else if (mainImageUrl && mainImageUrl.trim()) {
      imagePath = mainImageUrl.trim();
    } else {
      return { error: "Vui lòng chọn hình ảnh cho giải pháp!" };
    }

    const maxOrder = await prisma.service.aggregate({ _max: { sortOrder: true } });

    const galleryResult = await processGalleryImages(formData, "services");
    if ("error" in galleryResult) {
      return { error: galleryResult.error };
    }

    await prisma.service.create({
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

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi thêm giải pháp!" };
  }
}

// 11. Update Service
export async function updateServiceAction(
  idOrFormData: string | FormData,
  maybeFormData?: FormData
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const formData = idOrFormData instanceof FormData ? idOrFormData : maybeFormData!;
    const id = idOrFormData instanceof FormData ? (formData.get("id") as string) : (idOrFormData as string);

    if (!id) {
      return { error: "Thiếu ID giải pháp cần cập nhật!" };
    }
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const icon = (formData.get("icon") as string) || "ThermometerSun";
    const imageFile = formData.get("image") as File | null;
    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    const features = parseFeatures(formData);

    if (!title || !description) {
      return { error: "Vui lòng nhập đầy đủ tiêu đề và mô tả!" };
    }
    if (!SERVICE_ICONS.includes(icon)) {
      return { error: "Biểu tượng không hợp lệ!" };
    }

    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return { error: "Giải pháp không tồn tại!" };
    }

    let imagePath = existingService.image;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      const blob = await put(`services/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });

      if (isBlobUrl(existingService.image) && existingService.image !== mainImageUrl) {
        await del(existingService.image).catch(() => {});
      }

      imagePath = blob.url;
    } else if (mainImageUrl && mainImageUrl.trim()) {
      imagePath = mainImageUrl.trim();
    } else if (formData.get("removeImage") === "true") {
      if (isBlobUrl(existingService.image)) {
        await del(existingService.image).catch(() => {});
      }
      imagePath = PLACEHOLDER_IMAGE;
    }

    const galleryResult = await processGalleryImages(formData, "services");
    if ("error" in galleryResult) {
      return { error: galleryResult.error };
    }
    await deleteRemovedBlobImages(existingService.images, galleryResult.images);

    await prisma.service.update({
      where: { id },
      data: { title, description, features, icon, image: imagePath, images: galleryResult.images },
    });

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi sửa giải pháp!" };
  }
}

// 12. Delete Service
export async function deleteServiceAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return { error: "Giải pháp không tồn tại!" };
    }

    if (isBlobUrl(existingService.image)) {
      await del(existingService.image).catch(() => {});
    }
    await Promise.all(
      existingService.images.filter(isBlobUrl).map((url: string) => del(url).catch(() => {}))
    );

    await prisma.service.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi xóa giải pháp!" };
  }
}

// 13. Create Category
export async function createCategoryAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Tên danh mục không được để trống!" };

    const slug = slugify(name);
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) return { error: "Danh mục này đã tồn tại!" };

    await prisma.category.create({
      data: { name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi tạo danh mục!" };
  }
}

// 14. Update Category
export async function updateCategoryAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    if (!id || !name) return { error: "Thông tin danh mục không hợp lệ!" };

    const slug = slugify(name);
    const existing = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ name }, { slug }] },
        ],
      },
    });
    if (existing) return { error: "Tên danh mục mới bị trùng với danh mục khác!" };

    await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi sửa danh mục!" };
  }
}

// 15. Delete Category
export async function deleteCategoryAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { error: "Chưa đăng nhập!" };

  try {
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return { error: `Không thể xóa danh mục đang có ${count} sản phẩm! Vui lòng xóa hoặc đổi danh mục sản phẩm trước.` };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi xóa danh mục!" };
  }
}
