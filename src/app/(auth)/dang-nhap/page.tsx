import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPageWrapper } from "../../../components/auth/AuthPageWrapper";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Đăng Nhập Tài Khoản | Vật Tư Điện Lạnh Đông Kha",
  description: "Đăng nhập vào tài khoản Vật Tư Điện Lạnh Đông Kha để mua sắm và theo dõi đơn hàng.",
};

export default function DangNhapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#071626]">
          <Loader2 className="w-8 h-8 text-[#075FA8] animate-spin" />
        </div>
      }
    >
      <AuthPageWrapper defaultTab="login" />
    </Suspense>
  );
}
