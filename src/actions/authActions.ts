"use server";

import { revalidatePath } from "next/cache";
import { setAuthCookie, clearAuthCookie, getCurrentUser } from "../lib/auth";
import * as authService from "../services/auth.service";
import type { RegisterDTO, LoginDTO, UserProfile } from "../types/auth";

export async function registerAction(
  dto: RegisterDTO
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const user = await authService.register(dto);
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Đăng ký thất bại. Vui lòng thử lại." };
  }
}

export async function loginAction(
  dto: LoginDTO
): Promise<{ success: boolean; user?: UserProfile; error?: string; isNotRegistered?: boolean }> {
  try {
    const { user } = await authService.login(dto);
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return { success: true, user };
  } catch (err: any) {
    return {
      success: false,
      isNotRegistered: err.isNotRegistered || false,
      error: err.message || "Đăng nhập thất bại. Vui lòng thử lại.",
    };
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
    const result = await authService.googleLogin(credential);
    await setAuthCookie({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });
    return {
      success: true,
      user: result.user,
      isNewUser: result.isNewUser,
      needsPassword: result.needsPassword,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Đăng nhập Google thất bại." };
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

    const updated = await authService.completeGoogleAccount(dto, user.id);
    await setAuthCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/", "layout");
    return { success: true, user: updated };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Không thể hoàn tất thiết lập tài khoản. Vui lòng thử lại.",
    };
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

export async function updateUserAddressAction(
  address: string,
  phone?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Bạn chưa đăng nhập." };

    await authService.updateUserProfile({ name: user.name, phone: phone || user.phone || undefined, address }, user.id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể lưu địa chỉ." };
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

    const updated = await authService.updateUserProfile(dto, user.id);
    await setAuthCookie({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    revalidatePath("/tai-khoan");
    return { success: true, user: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể cập nhật thông tin." };
  }
}

export async function changePasswordAction(
  dtoOrOldPass: string | { currentPassword?: string; newPassword?: string; oldPassword?: string },
  maybeNewPass?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Bạn chưa đăng nhập." };

    let oldPass = "";
    let newPass = "";

    if (typeof dtoOrOldPass === "object") {
      oldPass = dtoOrOldPass.currentPassword || dtoOrOldPass.oldPassword || "";
      newPass = dtoOrOldPass.newPassword || "";
    } else {
      oldPass = dtoOrOldPass;
      newPass = maybeNewPass || "";
    }

    await authService.changePassword(oldPass, newPass, user.id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Không thể đổi mật khẩu." };
  }
}
