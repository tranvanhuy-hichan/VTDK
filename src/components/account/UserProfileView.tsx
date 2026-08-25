"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  KeyRound,
  ShieldCheck,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  updateUserProfileInfoAction,
  changePasswordAction,
} from "../../actions/authActions";
import { ProductDetailHeader } from "../product/ProductDetailHeader";
import { VietnamAddressSelector } from "../address/VietnamAddressSelector";

export const UserProfileView: React.FC = () => {
  const router = useRouter();
  const { user, refreshUser, isLoading: isAuthLoading, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  if (isAuthLoading) {
    return (
      <section className="pt-2 sm:pt-4 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
          <ProductDetailHeader productName="Thông tin tài khoản" />
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-8 h-8 text-[#075FA8] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="pt-2 sm:pt-4 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4 text-left">
          <ProductDetailHeader productName="Thông tin tài khoản" />
          <div className="max-w-md mx-auto text-center pt-6 sm:pt-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center mx-auto">
                <User className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Đăng nhập để quản lý tài khoản</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vui lòng đăng nhập để cập nhật thông tin cá nhân và thay đổi mật khẩu tài khoản của bạn.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Họ và tên không được để trống." });
      return;
    }

    setProfileSaving(true);
    try {
      const res = await updateUserProfileInfoAction({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (res.success && res.user) {
        await refreshUser();
        setProfileMsg({ type: "success", text: "Cập nhật thông tin cá nhân thành công!" });
      } else {
        setProfileMsg({ type: "error", text: res.error || "Không thể cập nhật thông tin." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Có lỗi xảy ra trong quá trình lưu." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setPasswordMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: res.error || "Không thể đổi mật khẩu." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Có lỗi xảy ra khi đổi mật khẩu." });
    } finally {
      setPasswordSaving(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="pt-0 pb-16 bg-[#F6F8FA] dark:bg-[#071626] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-4 text-left">
        <ProductDetailHeader productName="Thông tin tài khoản" />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-start">
          {/* Left Sidebar Menu (4 cols on desktop, horizontal card on mobile) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            {/* User Overview Card - Sleek Horizontal on Mobile, Card on Desktop */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs flex lg:flex-col items-center lg:text-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-tr from-[#075FA8] to-[#00A896] text-white flex items-center justify-center text-base sm:text-xl lg:text-2xl font-black shrink-0 shadow-md">
                {initials || <User className="w-5 h-5 sm:w-8 sm:h-8" />}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white truncate">
                  {user.name}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {user.email}
                </p>
                {user.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-bold rounded-full border border-amber-200 dark:border-amber-900">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Quản trị viên
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-300 text-[10px] sm:text-xs font-bold rounded-full border border-blue-200 dark:border-blue-900">
                    Khách hàng
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Tabs - 2 Segmented Buttons on Mobile, Vertical on Desktop */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-1.5 sm:p-2 shadow-xs grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setProfileMsg(null);
                }}
                className={`flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer !min-h-0 ${
                  activeTab === "profile"
                    ? "bg-[#075FA8] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">Hồ sơ cá nhân</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("password");
                  setPasswordMsg(null);
                }}
                className={`flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer !min-h-0 ${
                  activeTab === "password"
                    ? "bg-[#075FA8] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span className="truncate">Đổi mật khẩu</span>
              </button>
            </div>
          </div>

          {/* Right Content Area (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 lg:p-7 shadow-xs">
            {activeTab === "profile" ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white">
                    Hồ sơ cá nhân
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Cập nhật thông tin liên hệ và địa chỉ nhận hàng mặc định của bạn.
                  </p>
                </div>

                {profileMsg && (
                  <div
                    className={`p-3 rounded-xl sm:rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
                      profileMsg.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                        : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    }`}
                  >
                    {profileMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#075FA8]/30"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Địa chỉ Email (Cố định)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Số điện thoại liên hệ
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#075FA8]/30"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Vietnam Address Selector */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Địa chỉ giao hàng mặc định
                    </label>
                    <VietnamAddressSelector
                      initialAddress={address}
                      required={false}
                      onChange={(newAddr) => setAddress(newAddr)}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer !min-h-0"
                  >
                    {profileSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{profileSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white">
                    Đổi mật khẩu
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Để bảo mật tài khoản, vui lòng đặt mật khẩu mạnh có ít nhất 6 ký tự.
                  </p>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-xl sm:rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                        : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    }`}
                  >
                    {passwordMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="space-y-3.5 sm:space-y-4 max-w-lg">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#075FA8]/30"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer !min-h-0"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Ít nhất 6 ký tự"
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#075FA8]/30"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer !min-h-0"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#075FA8]/30"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer !min-h-0"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer !min-h-0"
                  >
                    {passwordSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>{passwordSaving ? "Đang đổi..." : "Cập nhật mật khẩu"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
