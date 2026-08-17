"use client";

import React, { useState } from "react";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await loginAction(password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Success, redirect to Admin page
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-left">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img
              src="/images/logo.png"
              alt="Logo Đông Kha"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">ĐÔNG KHA ADMIN</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Đăng nhập hệ thống quản lý vật tư điện lạnh
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Mật khẩu truy cập
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu admin..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs sm:text-sm text-red-600 font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>
      </div>
    </div>
  );
}
