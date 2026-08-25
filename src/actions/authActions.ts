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
import { checkRateLimit, resetRateLimit } from "../lib/rateLimit";
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

    // Rate limiting: Max 3 registration attempts per email / 10 minutes
    const rateCheck = checkRateLimit(`register:${email}`, 3, 600);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Quá nhiều yêu cầu đăng ký cho email này. Vui lòng thử lại sau ${rateCheck.resetInSeconds} giây.`,
      };
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

    resetRateLimit(`register:${email}`);
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

    // Rate limiting: Max 5 failed attempts per email / 5 minutes
    const rateCheck = checkRateLimit(`login:${email}`, 5, 300);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${rateCheck.resetInSeconds} giây để bảo vệ tài khoản.`,
      };
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

    // Clear rate limit on successful authentication
    resetRateLimit(`login:${email}`);

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

export async function googleLoginAction(credential: string): Promise<{
  success: boolean;
  user?: UserProfile;
  isNewUser?: boolean;
  needsPassword?: boolean;
  error?: string;
}> {
  try {
    const payload = await verifyGoogleToken(credential);
    if (!payload?.email) {
      return { success: false, error: "Xác thực Google không hợp lệ hoặc đã hết hạn." };
    }

    const email = payload.email.toLowerCase();
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isNewUser = false;
    let needsPassword = false;

    if (!user) {
      isNewUser = true;
      needsPassword = true;
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
      needsPassword = !user.passwordHash;
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
      hasPassword: !needsPassword,
    };

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true, user: profile, isNewUser, needsPassword };
  } catch (err: unknown) {
    console.error("googleLoginAction error:", err);
    return { success: false, error: "Đăng nhập Google thất bại." };
  }
}

export async function completeGoogleAccountAction(dto: {
  name: string;
  phone?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Bạn chưa đăng nhập." };

    const name = dto.name.trim();
    if (!name) {
      return { success: false, error: "Họ và tên không được để trống." };
    }

    const password = dto.password?.trim();
    const confirmPassword = dto.confirmPassword?.trim();

    if (!password) {
      return { success: false, error: "Vui lòng nhập mật khẩu tài khoản." };
    }

    if (password.length < 6) {
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại." };
    }

    const passwordHash = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone: dto.phone?.trim() || null,
        address: dto.address?.trim() || null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        avatar: true,
        passwordHash: true,
      },
    });

    const updatedProfile: UserProfile = {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      address: updated.address,
      role: updated.role,
      avatar: updated.avatar,
      hasPassword: true,
    };

    // Refresh JWT session cookie
    await setAuthCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/", "layout");
    return { success: true, user: updatedProfile };
  } catch (err) {
    console.error("completeGoogleAccountAction error:", err);
    return { success: false, error: "Không thể hoàn tất thiết lập tài khoản. Vui lòng thử lại." };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  await clearAuthCookie();
  revalidatePath("/");
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
        passwordHash: true,
      },
    });

    const updatedProfile: UserProfile = {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      address: updated.address,
      role: updated.role,
      avatar: updated.avatar,
      hasPassword: !!updated.passwordHash,
    };

    // Refresh JWT session cookie
    await setAuthCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/", "layout");
    return { success: true, user: updatedProfile };
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

