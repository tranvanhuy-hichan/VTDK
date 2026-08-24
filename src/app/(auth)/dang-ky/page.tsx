import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPageWrapper } from "../../../components/auth/AuthPageWrapper";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản | Vật Tư Điện Lạnh Đông Kha",
  description: "Tạo tài khoản thành viên Vật Tư Điện Lạnh Đông Kha để lưu địa chỉ và mua hàng thuận tiện.",
};

export default function DangKyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#071626]">
          <Loader2 className="w-8 h-8 text-[#075FA8] animate-spin" />
        </div>
      }
    >
      <AuthPageWrapper defaultTab="register" />
    </Suspense>
  );
}
