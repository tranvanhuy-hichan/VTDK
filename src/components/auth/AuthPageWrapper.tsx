"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Store,
  Wrench,
  Star,
  LogIn,
  UserPlus,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { COMPANY_DATA } from "../../data/company";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { CompleteProfileForm } from "./CompleteProfileForm";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { AuthLoadingSkeleton } from "./AuthLoadingSkeleton";
import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../types/auth";

interface AuthPageWrapperProps {
  defaultTab?: "login" | "register";
}

const BRAND_FEATURES = [
  { icon: Truck, text: "Giao hỏa tốc 1 - 2h" },
  { icon: ShieldCheck, text: "100% CO / CQ chính hãng" },
  { icon: Wrench, text: "Giá sỉ độc quyền cho thợ" },
  { icon: Store, text: "Kho sẵn: 400 Phạm Hùng" },
];

export const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({ defaultTab = "login" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [completeProfileUser, setCompleteProfileUser] = useState<UserProfile | null>(null);
  const [redirectingInfo, setRedirectingInfo] = useState<{ isRedirecting: boolean; isAdmin: boolean } | null>(null);

  const isRedirectingRef = useRef(false);

  // If already logged in and has profile completed, redirect away safely
  useEffect(() => {
    if (user && !completeProfileUser && !isRedirectingRef.current) {
      if (user.role === "ADMIN") {
        isRedirectingRef.current = true;
        setRedirectingInfo({ isRedirecting: true, isAdmin: true });
        const target = redirectUrl.startsWith("/admin") ? redirectUrl : "/admin";
        window.location.replace(target);
      } else if (!user.hasPassword || !user.phone || !user.address) {
        // If missing password, phone, or address, allow completing profile
        setCompleteProfileUser(user);
      } else {
        isRedirectingRef.current = true;
        setRedirectingInfo({ isRedirecting: true, isAdmin: false });
        router.push(redirectUrl);
      }
    }
  }, [user, completeProfileUser, redirectUrl, router]);

  if (isLoading) {
    return <AuthLoadingSkeleton />;
  }

  const handleSuccess = (
    loggedUser?: UserProfile | null,
    isNewUser?: boolean,
    needsPassword?: boolean
  ) => {
    if (isRedirectingRef.current) return;
    const active = loggedUser || user;
    if (active?.role === "ADMIN") {
      isRedirectingRef.current = true;
      setRedirectingInfo({ isRedirecting: true, isAdmin: true });
      const target = redirectUrl.startsWith("/admin") ? redirectUrl : "/admin";
      window.location.replace(target);
      return;
    }

    if (
      active &&
      (isNewUser ||
        needsPassword ||
        !active.hasPassword ||
        !active.phone ||
        !active.address)
    ) {
      setCompleteProfileUser(active);
      return;
    }

    isRedirectingRef.current = true;
    setRedirectingInfo({ isRedirecting: true, isAdmin: false });
    router.push(redirectUrl);
  };

  const handleSwitchToRegister = (email?: string) => {
    if (email) setPrefilledEmail(email);
    setTab("register");
  };

  return (
    <div className="h-screen max-h-screen h-[100dvh] max-h-[100dvh] overflow-hidden w-full flex flex-col lg:flex-row bg-white text-slate-900 transition-colors duration-300 animate-in fade-in duration-300 relative [color-scheme:light]">
      {/* Dynamic Smooth Redirecting Overlay */}
      {redirectingInfo?.isRedirecting && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Ambient top glowing line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#075FA8] via-cyan-400 to-[#075FA8]" />

            {/* Glowing Icon */}
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-ping opacity-75" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg flex items-center justify-center shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 animate-in zoom-in duration-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3" />
                <span>Xác thực thành công</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {redirectingInfo.isAdmin
                  ? "Đang mở Bảng điều khiển Quản trị..."
                  : "Đang chuyển tiếp đến trang chủ..."}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                Hệ thống đang chuẩn bị dữ liệu và phiên làm việc, vui lòng chờ trong giây lát.
              </p>
            </div>

            {/* Shimmering Progress Bar */}
            <div className="pt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#075FA8] via-cyan-400 to-[#075FA8] rounded-full animate-indeterminate-bar" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 1. Left Showcase Column (Clean, Corporate, Uncluttered) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 bg-gradient-to-br from-[#064B85] via-[#073863] to-[#0A1F33] p-8 xl:p-10 flex-col justify-between relative overflow-hidden text-white shrink-0 shadow-2xl border-r border-blue-900/50">
        {/* Ambient Glowing Blobs */}
        <div className="absolute -top-24 -left-24 w-88 h-88 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-88 h-88 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-88 h-88 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Corporate Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="p-2 rounded-2xl bg-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src={COMPANY_DATA.logoUrl}
                alt="Đông Kha Logo"
                width={48}
                height={48}
                priority
                className="h-11 w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] text-amber-300 font-extrabold uppercase tracking-widest leading-none">
                CÔNG TY TNHH VẬT TƯ ĐÔNG KHA
              </div>
              <div className="font-black text-xl tracking-tight text-white leading-none mt-1.5">
                VẬT TƯ ĐÔNG KHA
              </div>
            </div>
          </Link>
        </div>

        {/* Middle Clean Intro */}
        <div className="relative z-10 space-y-3.5 my-auto py-2">
          <h2 className="text-2xl xl:text-3xl font-black text-white leading-snug tracking-tight">
            Phân phối vật tư điện lạnh &amp; linh kiện chính hãng tại Đà Nẵng
          </h2>

          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed">
            Đăng nhập để nhận chính sách giá sỉ ưu đãi cho thợ, quản lý lịch sử đơn hàng và đặt mua linh kiện nhanh chóng.
          </p>

          {/* 4 Clean Minimal Chips */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {BRAND_FEATURES.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-xs font-bold text-white shadow-2xs transition-colors"
              >
                <item.icon className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="truncate">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof & Hotline */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span className="text-white text-[11px] font-bold">5.000+ Thợ &amp; Đối tác tin cậy</span>
          </div>

          <a
            href={`tel:${COMPANY_DATA.hotline}`}
            className="text-[11px] font-bold text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            Hotline: <span className="text-emerald-300 font-mono">{COMPANY_DATA.hotline}</span>
          </a>
        </div>
      </div>

      {/* 2. Right Form Column (Locked viewport, Overflow Hidden, Zero Scroll) */}
      <div className="flex-1 flex flex-col justify-center items-center p-3.5 sm:p-6 lg:p-8 h-full max-h-screen max-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative">
        {/* Background Visual Effects: Ambient Orbs & Dot Grid */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
        <div className="absolute top-1/2 -left-28 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-12 w-96 h-96 bg-cyan-200/45 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#075FA8_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.18] pointer-events-none" />

        <div className="w-full max-w-md transition-all duration-300 space-y-2.5 sm:space-y-4 my-auto relative z-10">
          {/* If user needs to complete profile (e.g. from Google login) */}
          {completeProfileUser ? (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xl shadow-slate-300/40 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
              {/* Subtle top accent bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#075FA8] via-cyan-400 to-[#075FA8]" />

              {/* Mobile-Only Brand Header */}
              <div className="lg:hidden flex flex-col items-center text-center space-y-1 pb-1">
                <Link href="/" className="inline-flex flex-col items-center gap-2 group">
                  <Image
                    src={COMPANY_DATA.logoUrl}
                    alt="Đông Kha Logo"
                    width={140}
                    height={140}
                    priority
                    className="h-24 sm:h-28 w-auto object-contain"
                  />
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#EA580C] leading-tight">
                    VẬT TƯ ĐÔNG KHA
                  </span>
                </Link>
              </div>

              <div className="text-center space-y-1 pt-1 pb-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {!completeProfileUser.hasPassword
                    ? "Thiết lập tài khoản & Mật khẩu"
                    : "Hoàn thiện thông tin nhận hàng"}
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {!completeProfileUser.hasPassword
                    ? "Nhập thông tin cá nhân và thiết lập mật khẩu đăng nhập để hoàn tất tài khoản."
                    : "Cung cấp số điện thoại & địa chỉ nhận hàng để tiện lợi cho các đơn hàng tiếp theo."}
                </p>
              </div>

              <CompleteProfileForm
                user={completeProfileUser}
                onComplete={() => router.push(redirectUrl)}
                onSkip={
                  completeProfileUser.hasPassword
                    ? () => router.push(redirectUrl)
                    : undefined
                }
              />
            </div>
          ) : (
            /* Form Card (Pure White Light Mode - Integrated Header) */
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xl shadow-slate-300/40 text-left space-y-4 relative overflow-hidden">
              {/* Mobile-Only: Large Brand Header */}
              <div className="lg:hidden flex flex-col items-center justify-center text-center pb-1">
                <Link href="/" className="inline-flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                  <Image
                    src={COMPANY_DATA.logoUrl}
                    alt="Đông Kha Logo"
                    width={160}
                    height={160}
                    priority
                    className="h-28 sm:h-32 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#EA580C] leading-tight">
                    VẬT TƯ ĐÔNG KHA
                  </span>
                </Link>
              </div>

              {/* PC / Desktop: Title 'Đăng nhập' or 'Đăng ký' */}
              <div className="hidden lg:block text-center pb-1">
                <h1 className="text-2xl xl:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  {tab === "login" ? "Đăng nhập" : "Đăng ký"}
                </h1>
              </div>

              {/* Form component with smooth animated transition */}
              <div className="transition-all duration-300">
                {tab === "login" ? (
                  <LoginForm
                    onSuccess={handleSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                    initialEmail={prefilledEmail}
                  />
                ) : (
                  <RegisterForm
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => setTab("login")}
                    initialEmail={prefilledEmail}
                  />
                )}
              </div>

              {/* Clean Horizontal Divider */}
              <div className="flex items-center gap-3 my-2 w-full">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                  Hoặc tiếp tục với
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Google Login Button */}
              <GoogleLoginButton onSuccess={handleSuccess} />
            </div>
          )}

          {/* Footer note */}
          <p className="text-[10px] text-center text-slate-400">
            Bảo mật thông tin khách hàng tuyệt đối • CÔNG TY TNHH VẬT TƯ ĐÔNG KHA
          </p>
        </div>
      </div>
    </div>
  );
};
