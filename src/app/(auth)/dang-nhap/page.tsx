import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPageWrapper } from "../../../components/auth/AuthPageWrapper";
import { AuthLoadingSkeleton } from "../../../components/auth/AuthLoadingSkeleton";

export const metadata: Metadata = {
  title: "Đăng Nhập Tài Khoản | CÔNG TY TNHH VẬT TƯ ĐÔNG KHA",
  description: "Đăng nhập vào tài khoản Vật Tư Đông Kha để mua sắm, tra cứu đơn hàng và nhận chiết khấu thợ.",
};

export default function DangNhapPage() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <AuthPageWrapper defaultTab="login" />
    </Suspense>
  );
}
