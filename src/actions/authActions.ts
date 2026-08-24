"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import {
  hashPassword,
  comparePassword,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUser,
} from "../lib/auth";
import { ensureDefaultAdmin, DEFAULT_ADMIN_EMAIL } from "../lib/seedAdmin";
import { verifyGoogleToken } from "../lib/googleAuth";
import type { RegisterDTO, LoginDTO, UserProfile } from "../types/auth";

export async function registerAction(dto: RegisterDTO): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const email = dto.email.trim().toLowerCase();
    const name = dto.name.trim();
    const password = dto.password;

    if (!email || !password || !name) {
      return { success: false, error: "Vui lòng điền đầy đủ họ tên, email và mật khẩu." };
    }

    if (password.length < 6) {
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." };
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Email này đã được đăng ký. Vui lòng đăng nhập." };
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        phone: dto.phone?.trim() || null,
        address: dto.address?.trim() || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        avatar: true,
      },
    });

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true, user };
  } catch (err: unknown) {
    console.error("registerAction error:", err);
    return { success: false, error: "Đăng ký thất bại. Vui lòng thử lại." };
  }
}

export async function loginAction(dto: LoginDTO): Promise<{ success: boolean; user?: UserProfile; error?: string; isNotRegistered?: boolean }> {
  try {
    const email = dto.email.trim().toLowerCase();
    const password = dto.password;

    if (!email || !password) {
      return { success: false, error: "Vui lòng nhập email và mật khẩu." };
    }

    // If it's the default admin email, ensure the admin record exists
    if (email === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      await ensureDefaultAdmin();
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        isNotRegistered: true,
        error: "Email này chưa có tài khoản trong hệ thống.",
      };
    }

    if (!user.passwordHash) {
      return {
        success: false,
        error: "Tài khoản này được đăng ký qua Google. Vui lòng chọn Đăng nhập bằng Google.",
      };
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Tài khoản hoặc mật khẩu không chính xác." };
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      avatar: user.avatar,
    };

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true, user: profile };
  } catch (err: unknown) {
    console.error("loginAction error:", err);
    return { success: false, error: "Đăng nhập thất bại. Vui lòng thử lại." };
  }
}

export async function googleLoginAction(credential: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const payload = await verifyGoogleToken(credential);
    if (!payload?.email) {
      return { success: false, error: "Xác thực Google không hợp lệ hoặc đã hết hạn." };
    }

    const email = payload.email.toLowerCase();
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: payload.name || email.split("@")[0],
          avatar: payload.picture,
          googleId: payload.sub,
          role: "CUSTOMER",
        },
      });
    } else {
      // Update avatar or googleId if missing
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || payload.sub,
          avatar: user.avatar || payload.picture,
        },
      });
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      avatar: user.avatar,
    };

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true, user: profile };
  } catch (err: unknown) {
    console.error("googleLoginAction error:", err);
    return { success: false, error: "Đăng nhập Google thất bại." };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  await clearAuthCookie();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getProfileUserAction(): Promise<UserProfile | null> {
  return getCurrentUser();
}

export async function updateUserAddressAction(address: string, phone?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Bạn chưa đăng nhập." };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        address: address.trim(),
        ...(phone ? { phone: phone.trim() } : {}),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("updateUserAddressAction error:", err);
    return { success: false, error: "Không thể lưu địa chỉ." };
  }
}

export async function updateUserProfileInfoAction(dto: {

  name: string;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Bạn chưa đăng nhập." };

    const name = dto.name.trim();
    if (!name) {
      return { success: false, error: "Họ và tên không được để trống." };
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone: dto.phone?.trim() || null,
        address: dto.address?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        avatar: true,
      },
    });

    // Refresh JWT session cookie
    await setAuthCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/", "layout");
    return { success: true, user: updated };
  } catch (err) {
    console.error("updateUserProfileInfoAction error:", err);
    return { success: false, error: "Không thể cập nhật thông tin cá nhân." };
  }
}

export async function changePasswordAction(dto: {
  currentPassword?: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Bạn chưa đăng nhập." };

    const newPassword = dto.newPassword;
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự." };
    }

    const userInDb = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, passwordHash: true },
    });

    if (!userInDb) {
      return { success: false, error: "Tài khoản không tồn tại." };
    }

    // If user already has a password, verify currentPassword
    if (userInDb.passwordHash) {
      if (!dto.currentPassword) {
        return { success: false, error: "Vui lòng nhập mật khẩu hiện tại." };
      }
      const isValid = await comparePassword(dto.currentPassword, userInDb.passwordHash);
      if (!isValid) {
        return { success: false, error: "Mật khẩu hiện tại không chính xác." };
      }
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { passwordHash: newHash },
    });

    return { success: true };
  } catch (err) {
    console.error("changePasswordAction error:", err);
    return { success: false, error: "Không thể đổi mật khẩu." };
  }
}

