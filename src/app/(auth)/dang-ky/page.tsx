import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPageWrapper } from "../../../components/auth/AuthPageWrapper";
import { AuthLoadingSkeleton } from "../../../components/auth/AuthLoadingSkeleton";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản | CÔNG TY TNHH VẬT TƯ ĐÔNG KHA",
  description: "Tạo tài khoản thành viên Vật Tư Đông Kha để lưu địa chỉ và mua hàng nhanh chóng.",
};

export default function DangKyPage() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <AuthPageWrapper defaultTab="register" />
    </Suspense>
  );
}
