"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    const res = await login({ email: email.trim(), password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } else {
      if (res.user?.role === "ADMIN") {
        window.location.href = "/admin";
        return;
      }
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      {error && (
        <div className="p-2.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
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
            className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
          Mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8] dark:focus:ring-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Ẩn hiện mật khẩu"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 !min-h-0 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer pt-1"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang đăng nhập...</span>
          </>
        ) : (
          <span>Đăng nhập</span>
        )}
      </button>
    </form>
  );
};
