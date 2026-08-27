export type ActionResponse<T = void> =
  | { success: true; data: T; error?: never; message?: string }
  | { success: false; error: string; data?: never; code?: string };

export function actionSuccess<T>(data: T, message?: string): ActionResponse<T> {
  return { success: true, data, message };
}

export function actionError(error: string, code?: string): ActionResponse<never> {
  return { success: false, error, code };
}
