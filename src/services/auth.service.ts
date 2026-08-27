import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../lib/auth";
import { ensureDefaultAdmin, DEFAULT_ADMIN_EMAIL } from "../lib/seedAdmin";
import { verifyGoogleToken } from "../lib/googleAuth";
import { checkRateLimit, resetRateLimit } from "../lib/rateLimit";
import type { RegisterDTO, LoginDTO, UserProfile } from "../types/auth";

export async function register(dto: RegisterDTO): Promise<UserProfile> {
  const email = dto.email.trim().toLowerCase();
  const name = dto.name.trim();
  const password = dto.password;

  if (!email || !password || !name) {
    throw new Error("Vui lòng điền đầy đủ họ tên, email và mật khẩu.");
  }

  if (password.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
  }

  // Rate limiting: Max 3 registration attempts per email / 10 minutes
  const rateCheck = checkRateLimit(`register:${email}`, 3, 600);
  if (!rateCheck.allowed) {
    throw new Error(
      `Quá nhiều yêu cầu đăng ký cho email này. Vui lòng thử lại sau ${rateCheck.resetInSeconds} giây.`
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email này đã được đăng ký. Vui lòng đăng nhập.");
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

  resetRateLimit(`register:${email}`);
  return user;
}

export async function login(dto: LoginDTO): Promise<{ user: UserProfile }> {
  const email = dto.email.trim().toLowerCase();
  const password = dto.password;

  if (!email || !password) {
    throw new Error("Vui lòng nhập email và mật khẩu.");
  }

  // Rate limiting: Max 5 failed attempts per email / 5 minutes
  const rateCheck = checkRateLimit(`login:${email}`, 5, 300);
  if (!rateCheck.allowed) {
    throw new Error(
      `Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${rateCheck.resetInSeconds} giây để bảo vệ tài khoản.`
    );
  }

  if (email === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    await ensureDefaultAdmin();
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error: any = new Error("Email này chưa có tài khoản trong hệ thống.");
    error.isNotRegistered = true;
    throw error;
  }

  if (!user.passwordHash) {
    throw new Error("Tài khoản này được đăng ký qua Google. Vui lòng chọn Đăng nhập bằng Google.");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
  }

  resetRateLimit(`login:${email}`);

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    address: user.address,
    role: user.role,
    avatar: user.avatar,
    hasPassword: true,
  };

  return { user: profile };
}

export async function googleLogin(credential: string): Promise<{
  user: UserProfile;
  isNewUser: boolean;
  needsPassword: boolean;
}> {
  const payload = await verifyGoogleToken(credential);
  if (!payload?.email) {
    throw new Error("Xác thực Google không hợp lệ hoặc đã hết hạn.");
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

  return { user: profile, isNewUser, needsPassword };
}

export async function completeGoogleAccount(
  dto: {
    name: string;
    phone?: string;
    address?: string;
    password?: string;
    confirmPassword?: string;
  },
  userId: string
): Promise<UserProfile> {
  const name = dto.name.trim();
  if (!name) {
    throw new Error("Họ và tên không được để trống.");
  }

  const password = dto.password?.trim();
  const confirmPassword = dto.confirmPassword?.trim();

  if (!password) {
    throw new Error("Vui lòng nhập mật khẩu tài khoản.");
  }
  if (password.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
  }
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
  }

  const passwordHash = await hashPassword(password);
  const updated = await prisma.user.update({
    where: { id: userId },
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

  return {
    id: updated.id,
    email: updated.email,
    name: updated.name,
    phone: updated.phone,
    address: updated.address,
    role: updated.role,
    avatar: updated.avatar,
    hasPassword: true,
  };
}

export async function updateUserProfile(
  dto: { name: string; phone?: string; address?: string },
  userId: string
): Promise<UserProfile> {
  const name = dto.name.trim();
  if (!name) throw new Error("Họ và tên không được để trống.");

  const updated = await prisma.user.update({
    where: { id: userId },
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

  return {
    id: updated.id,
    email: updated.email,
    name: updated.name,
    phone: updated.phone,
    address: updated.address,
    role: updated.role,
    avatar: updated.avatar,
    hasPassword: !!updated.passwordHash,
  };
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  userId: string
): Promise<void> {
  if (!oldPassword || !newPassword) {
    throw new Error("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.");
  }
  if (newPassword.length < 6) {
    throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw new Error("Tài khoản không tồn tại hoặc chưa tạo mật khẩu.");
  }

  const isValid = await comparePassword(oldPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Mật khẩu hiện tại không chính xác.");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
