"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { CompleteProfileForm } from "./CompleteProfileForm";
import { GoogleLoginButton } from "./GoogleLoginButton";
import type { UserProfile } from "../../types/auth";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, user } = useAuth();
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [completeProfileUser, setCompleteProfileUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      setCompleteProfileUser(null);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  const handleLoginSuccess = (loggedUser?: UserProfile | null) => {
    const active = loggedUser || user;
    if (active?.role === "ADMIN") {
      window.location.replace("/admin");
      return;
    }
    if (active && (!active.phone || !active.address)) {
      setCompleteProfileUser(active);
    } else {
      closeAuthModal();
    }
  };

  if (!isAuthModalOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-left overflow-y-auto animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#075FA8]/10 dark:bg-blue-500/20 flex items-center justify-center text-[#075FA8] dark:text-blue-400 font-black text-sm">
              {completeProfileUser ? (
                <UserPlus className="w-4 h-4" />
              ) : authModalTab === "login" ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {completeProfileUser
                ? "Hoàn thiện thông tin nhận hàng"
                : authModalTab === "login"
                ? "Đăng nhập tài khoản"
                : "Đăng ký tài khoản mới"}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Đóng"
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completeProfileUser ? (
          <div className="p-5">
            <CompleteProfileForm
              user={completeProfileUser}
              onComplete={closeAuthModal}
              onSkip={closeAuthModal}
            />
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="px-5 pt-4">
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer !min-h-0 ${
                    authModalTab === "login"
                      ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-white shadow-xs font-black"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("register")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer !min-h-0 ${
                    authModalTab === "register"
                      ? "bg-white dark:bg-slate-700 text-[#075FA8] dark:text-white shadow-xs font-black"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <GoogleLoginButton onSuccess={handleLoginSuccess} />

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  hoặc
                </span>
              </div>

              {authModalTab === "login" ? (
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onSwitchToRegister={(email) => {
                    if (email) setPrefilledEmail(email);
                    openAuthModal("register");
                  }}
                  initialEmail={prefilledEmail}
                />
              ) : (
                <RegisterForm onSuccess={closeAuthModal} initialEmail={prefilledEmail} />
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
