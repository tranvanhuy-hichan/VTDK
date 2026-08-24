"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { VietnamAddressSelector } from "../address/VietnamAddressSelector";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Basic email format check
    if (!email.includes("@") || !email.includes(".")) {
      setError("Định dạng email không hợp lệ (ví dụ: ten@gmail.com).");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu tài khoản.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự để đảm bảo bảo mật.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setStep(1);
      setError("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Đăng ký thất bại. Vui lòng thử lại.");
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-3 text-left">
      {/* 2-Step Progress Indicator */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer !min-h-0 ${
            step === 1
              ? "text-[#075FA8] dark:text-blue-400 font-extrabold"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              step === 1
                ? "bg-[#075FA8] text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {step === 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : 1}
          </div>
          <span>1. Tài khoản</span>
        </button>

        <div className={`flex-1 h-0.5 rounded-full mx-1 transition-all ${
          step === 2 ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
        }`} />

        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${
            step === 2
              ? "text-[#075FA8] dark:text-blue-400 font-extrabold"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              step === 2
                ? "bg-[#075FA8] text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            2
          </div>
          <span>2. Địa chỉ</span>
        </div>
      </div>

      {error && (
        <div className="p-2.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
          {error}
        </div>
      )}

      {/* STEP 1: Account Information */}
      {step === 1 && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* Họ và tên & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0905..."
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email & Mật khẩu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                Email đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full pl-8 pr-8 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Ẩn hiện mật khẩu"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 !min-h-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer mt-1"
          >
            <span>Tiếp tục (Bước 2: Địa chỉ)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 2: Address Information */}
      {step === 2 && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
            <span>Địa chỉ nhận hàng mặc định (Có thể bổ sung sau khi mua hàng):</span>
          </div>

          {/* 2-Tier Administrative Address Selector */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-700/80">
            <VietnamAddressSelector
              initialAddress={address}
              onChange={(full) => setAddress(full)}
              required={false}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer !min-h-0 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer !min-h-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <span>Hoàn tất Đăng ký</span>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
