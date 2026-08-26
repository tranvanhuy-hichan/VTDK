import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const DEFAULT_ADMIN_EMAIL = "vtdldongkha@gmail.com";
export const OLD_ADMIN_EMAIL = "vattudongkha@gmail.com";
export const DEFAULT_ADMIN_PASSWORD_RAW = "vattudongkhaadmin2026@";

export async function ensureDefaultAdmin() {
  try {
    // 1. Check if user exists with old email and update to new email
    const oldAdmin = await prisma.user.findUnique({
      where: { email: OLD_ADMIN_EMAIL },
    });

    if (oldAdmin) {
      await prisma.user.update({
        where: { id: oldAdmin.id },
        data: {
          email: DEFAULT_ADMIN_EMAIL,
          role: "ADMIN",
        },
      });
      console.log(`[Seed] Migrated admin email from ${OLD_ADMIN_EMAIL} to ${DEFAULT_ADMIN_EMAIL}`);
      return;
    }

    // 2. Check if user already exists with new email
    const existing = await prisma.user.findUnique({
      where: { email: DEFAULT_ADMIN_EMAIL },
    });

    if (!existing) {
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD_RAW, 10);
      await prisma.user.create({
        data: {
          email: DEFAULT_ADMIN_EMAIL,
          passwordHash,
          name: "Quản trị viên Đông Kha",
          role: "ADMIN",
          phone: "0905487441",
        },
      });
      console.log(`[Seed] Created default admin user: ${DEFAULT_ADMIN_EMAIL}`);
    } else if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN" },
      });
      console.log(`[Seed] Upgraded user ${DEFAULT_ADMIN_EMAIL} to ADMIN`);
    }
  } catch (err) {
    console.error("[Seed] Failed to ensure default admin:", err);
  }
}
