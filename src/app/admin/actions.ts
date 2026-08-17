"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";
import { prisma } from "../../lib/prisma";

const SESSION_COOKIE = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dongkha123";

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

// 1. Admin Login
export async function loginAction(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }
  return { error: "Mật khẩu không chính xác!" };
}

// 2. Admin Logout
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Check session server-side helper
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "authenticated";
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

    let imagePath = "/images/storefront.png"; // Default image

    if (imageFile && imageFile.size > 0) {
      // Validate file size (<= 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }

      // Validate file type
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      // Upload directly to Vercel Blob cloud storage
      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });

      imagePath = blob.url;
    }

    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let count = 1;

    // Check duplicate slug
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${count++}`;
    }

    const variants = parseVariants(formData);

    await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        price,
        shortDesc: shortDesc || null,
        image: imagePath,
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
export async function updateProductAction(id: string, formData: FormData) {
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { error: "Sản phẩm không tồn tại!" };
    }

    let imagePath = existingProduct.image;

    if (imageFile && imageFile.size > 0) {
      // Validate file size (<= 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 5MB!" };
      }

      // Validate file type
      const ext = path.extname(imageFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG, WEBP." };
      }

      // Upload directly to Vercel Blob cloud storage
      const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });

      // Optional: Delete old image if it was a Vercel Blob
      if (
        existingProduct.image.startsWith("https://") &&
        existingProduct.image.includes("public.blob.vercel-storage.com")
      ) {
        await del(existingProduct.image).catch(() => {});
      }

      imagePath = blob.url;
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

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        price,
        shortDesc: shortDesc || null,
        image: imagePath,
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

    // Delete image if it is in /uploads/ or Vercel Blob
    if (existingProduct.image.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", existingProduct.image);
      await fs.unlink(filePath).catch(() => {});
    } else if (
      existingProduct.image.startsWith("https://") &&
      existingProduct.image.includes("public.blob.vercel-storage.com")
    ) {
      await del(existingProduct.image).catch(() => {});
    }

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
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Lỗi hệ thống khi xóa ảnh!" };
  }
}
