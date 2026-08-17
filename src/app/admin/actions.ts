"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
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

      // Save file locally in public/uploads/
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const filename = `${timestamp}-${random}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      imagePath = `/uploads/${filename}`;
    }

    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let count = 1;

    // Check duplicate slug
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${count++}`;
    }

    await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        price,
        shortDesc: shortDesc || null,
        image: imagePath,
        active,
        categoryId,
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

      // Save file locally in public/uploads/
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const filename = `${timestamp}-${random}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      // Optional: Delete old image if it was in /uploads/
      if (existingProduct.image.startsWith("/uploads/")) {
        const oldFilePath = path.join(process.cwd(), "public", existingProduct.image);
        await fs.unlink(oldFilePath).catch(() => {});
      }

      imagePath = `/uploads/${filename}`;
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

    // Delete image if it is in /uploads/
    if (existingProduct.image.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", existingProduct.image);
      await fs.unlink(filePath).catch(() => {});
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
