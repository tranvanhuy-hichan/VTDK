import { getCurrentAdmin, getCurrentUser } from "../lib/auth";
import { ActionResponse, actionSuccess, actionError } from "./response";
import { type ZodSchema } from "zod";

/**
 * Executes an action with standard try/catch error handling.
 */
export async function createSafeAction<TInput, TOutput>(
  handler: (input: TInput) => Promise<TOutput>,
  input: TInput
): Promise<ActionResponse<TOutput>> {
  try {
    const result = await handler(input);
    return actionSuccess(result);
  } catch (err: any) {
    console.error("[SafeAction Error]:", err);
    return actionError(err?.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại!");
  }
}

/**
 * Executes an action requiring ADMIN authorization.
 */
export async function createAdminAction<TInput, TOutput>(
  handler: (input: TInput, adminUser: NonNullable<Awaited<ReturnType<typeof getCurrentAdmin>>>) => Promise<TOutput>,
  input: TInput
): Promise<ActionResponse<TOutput>> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return actionError("Bạn chưa đăng nhập hoặc không có quyền Quản trị viên!", "UNAUTHORIZED");
    }
    const result = await handler(input, admin);
    return actionSuccess(result);
  } catch (err: any) {
    console.error("[AdminAction Error]:", err);
    return actionError(err?.message || "Đã xảy ra lỗi hệ thống khi xử lý yêu cầu quản trị!");
  }
}
