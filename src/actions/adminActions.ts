import { getCurrentAdmin } from "../lib/auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return Boolean(admin);
}

// Re-export all domain-specific async server actions for 100% backward compatibility
export * from "./productActions";
export * from "./categoryActions";
export * from "./serviceActions";
export * from "./galleryActions";
export * from "./companyActions";
export * from "./authActions";
export * from "./analyticsActions";
export * from "./posActions";
export * from "./orderActions";
