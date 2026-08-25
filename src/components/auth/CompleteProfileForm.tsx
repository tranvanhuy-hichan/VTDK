"use client";

import React, { useState } from "react";
import { User, Phone, MapPin, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import type { UserProfile } from "../../types/auth";
import { updateUserProfileInfoAction, completeGoogleAccountAction } from "../../actions/authActions";
import { VietnamAddressSelector } from "../address/VietnamAddressSelector";
import { useAuth } from "../../context/AuthContext";

interface CompleteProfileFormProps {
  user: UserProfile;
  onComplete: () => void;
  onSkip?: () => void;
}

export const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  user,
  onComplete,
  onSkip,
}) => {
  const { refreshUser } = useAuth();
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState(user.address || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPassword = !user.hasPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (needsPassword) {
      if (!password) {
        setError("Vui lòng nhập mật khẩu cho tài khoản.");
        return;
      }
      if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }
      if (!confirmPassword) {
        setError("Vui lòng xác nhận lại mật khẩu.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.");
        return;
      }
    }

    setLoading(true);
    try {
      if (needsPassword) {
        const res = await completeGoogleAccountAction({
          name: trimmedName,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          password,
          confirmPassword,
        });

        if (!res.success) {
          setError(res.error || "Không thể lưu thông tin. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      } else {
        const res = await updateUserProfileInfoAction({
          name: trimmedName,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || "Không thể cập nhật thông tin.");
          setLoading(false);
          return;
        }
      }

      await refreshUser();
      onComplete();
    } catch {
      setError("Đã xảy ra lỗi khi lưu thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left animate-in fade-in zoom-in-95 duration-200">
      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-left space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Xác thực Google thành công!</span>
        </div>
        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
          {needsPassword
            ? "Vui lòng nhập thông tin tài khoản và thiết lập mật khẩu để hoàn tất đăng ký."
            : "Vui lòng bổ sung Số điện thoại và Địa chỉ để hệ thống tự động điền khi bạn đặt hàng."}
        </p>
      </div>

      {error && (
        <div className="p-2.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
          {error}
        </div>
      )}

      {/* Họ tên & Số điện thoại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
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
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0905..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mật khẩu & Xác nhận Mật khẩu (Thiết lập mật khẩu khi đăng nhập bằng Google lần đầu) */}
      {needsPassword && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mật khẩu tài khoản <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
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

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Ẩn hiện xác nhận mật khẩu"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 !min-h-0 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Địa chỉ nhận hàng */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#075FA8] dark:text-blue-400 shrink-0" />
          <span>Địa chỉ nhận hàng mặc định (Có thể bổ sung sau)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <VietnamAddressSelector
            initialAddress={address}
            onChange={(full) => setAddress(full)}
            required={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        {onSkip && !needsPassword && (
          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer !min-h-0"
          >
            Bỏ qua bước này
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer !min-h-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu thông tin...</span>
            </>
          ) : (
            <>
              <span>{needsPassword ? "Hoàn tất đăng ký tài khoản" : "Lưu & Tiếp tục"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

