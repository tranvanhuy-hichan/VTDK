"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Store,
  Wrench,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { COMPANY_DATA } from "../../data/company";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useAuth } from "../../context/AuthContext";

interface AuthPageWrapperProps {
  defaultTab?: "login" | "register";
}

const BRAND_FEATURES = [
  { icon: Truck, title: "Giao hỏa tốc nội thành", desc: "Nhận hàng nhanh trong 1 - 2h tại Đà Nẵng" },
  { icon: ShieldCheck, title: "100% Hàng chính hãng", desc: "Đầy đủ CO/CQ, bảo hành uy tín" },
  { icon: Wrench, title: "Giá sỉ ưu đãi cho thợ", desc: "Chiết khấu tốt nhất cho thợ & nhà thầu" },
  { icon: Store, title: "Kho hàng sẵn sàng", desc: "400 Phạm Hùng, Hoà Xuân, Cẩm Lệ" },
];

export const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({ defaultTab = "login" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { user } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        router.push(redirectUrl);
      }
    }
  }, [user, redirectUrl, router]);

  const handleSuccess = () => {
    if (user?.role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full flex flex-col lg:flex-row bg-[#071626] text-white">
      {/* 1. Left Showcase Column (Brand Identity & Key Highlights) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 bg-gradient-to-br from-[#0B1F33] via-[#072444] to-[#075FA8] p-6 xl:p-8 flex-col justify-between relative overflow-hidden border-r border-slate-800 h-full shrink-0">
        {/* Background decorative glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src={COMPANY_DATA.logoUrl}
              alt="Đông Kha Logo"
              width={48}
              height={48}
              priority
              className="h-10 w-auto object-contain rounded-xl bg-white/10 p-1 backdrop-blur-xs border border-white/20 transition-transform group-hover:scale-105"
            />
            <div>
              <div className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>ĐÔNG KHA</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md uppercase">
                  Chính Hãng
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
                Vật Tư &amp; Thiết Bị Điện Lạnh
              </p>
            </div>
          </Link>
        </div>

        {/* Middle Brand Intro */}
        <div className="relative z-10 space-y-4 my-auto py-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tổng kho phân phối vật tư điện lạnh miền Trung</span>
          </div>

          <h2 className="text-xl xl:text-2xl font-black text-white leading-snug tracking-tight">
            Kho vật tư điện lạnh &amp; giải pháp HVAC chuyên nghiệp tại Đà Nẵng
          </h2>

          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed font-normal">
            Đăng nhập tài khoản để đặt hàng nhanh, ghi nhớ địa chỉ giao hàng, lưu lại lịch sử đơn hàng và nhận chính sách giá sỉ ưu đãi độc quyền.
          </p>

          {/* 4 Brand Pillars in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {BRAND_FEATURES.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-0.5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-white">
                  <div className="p-1 rounded-md bg-blue-500/20 text-blue-300 shrink-0">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold truncate">{item.title}</h4>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight pl-5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hơn 5.000+ thợ &amp; đối tác tin cậy</span>
          </div>
          <span className="font-mono text-[11px]">Hotline: {COMPANY_DATA.hotline}</span>
        </div>
      </div>

      {/* 2. Right Form Column (Login / Register Card) */}
      <div className="flex-1 flex flex-col justify-center items-center p-3.5 sm:p-6 lg:p-8 h-full overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md transition-all duration-300 space-y-3.5 my-auto">
          {/* Top navigation bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer !min-h-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Quay lại trang chủ</span>
            </Link>

            {/* Mobile-only logo */}
            <div className="lg:hidden flex items-center gap-1.5">
              <span className="text-xs font-black text-white">ĐÔNG KHA</span>
              <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.2 rounded">
                HVAC
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-7 shadow-2xl backdrop-blur-xl text-left space-y-4">
            {/* Segmented Tab Switcher (Đăng nhập / Đăng ký) */}
            <div className="grid grid-cols-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer !min-h-0 ${
                  tab === "login"
                    ? "bg-[#075FA8] text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("register")}
                className={`py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer !min-h-0 ${
                  tab === "register"
                    ? "bg-[#075FA8] text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </button>
            </div>

            {/* Sleek Header Title & Subtitle */}
            <div className="text-center space-y-1 pt-1 pb-0.5">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản thành viên"}
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {tab === "login"
                  ? "Đăng nhập để tra cứu đơn hàng & nhận chiết khấu thợ."
                  : "Đăng ký để đặt hàng nhanh & lưu sẵn địa chỉ giao nhận."}
              </p>
            </div>

            {/* Form component */}
            {tab === "login" ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}

            {/* Clean Horizontal Divider */}
            <div className="flex items-center gap-3 my-2 w-full">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap shrink-0">
                Hoặc tiếp tục với
              </span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton onSuccess={handleSuccess} />
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-center text-slate-500">
            Bảo mật thông tin khách hàng tuyệt đối • Vật Tư Điện Lạnh Đông Kha
          </p>
        </div>
      </div>
    </div>
  );
};
