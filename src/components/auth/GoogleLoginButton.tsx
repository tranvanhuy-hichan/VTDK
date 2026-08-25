"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import type { UserProfile } from "../../types/auth";

interface GoogleLoginButtonProps {
  onSuccess?: (user?: UserProfile | null, isNewUser?: boolean, needsPassword?: boolean) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: unknown) => void) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "480688489128-uq790355apb0gp1vc7ppfic15230p8bl.apps.googleusercontent.com";

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleRendered, setIsGoogleRendered] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const initGoogleAuth = () => {
    if (typeof window === "undefined" || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          if (!response?.credential) {
            setError("Không nhận được thông tin xác thực từ Google.");
            return;
          }
          setError(null);
          setLoading(true);
          try {
            const res = await loginWithGoogle(response.credential);
            if (res.success) {
              onSuccess?.(res.user, res.isNewUser, res.needsPassword);
            } else {
              setError(res.error || "Đăng nhập Google thất bại.");
            }
          } catch {
            setError("Lỗi xử lý đăng nhập Google.");
          } finally {
            setLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleBtnContainerRef.current) {
        googleBtnContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
          width: 320,
          locale: "vi",
        });
        setIsGoogleRendered(true);
      }
    } catch (err) {
      console.error("Google Auth init error:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      initGoogleAuth();
    }
  }, []);

  const handleCustomClick = () => {
    setError(null);
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError("Đang kết nối Google Identity Services, vui lòng thử lại sau 1-2 giây...");
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          initGoogleAuth();
        }}
      />

      {error && (
        <div className="w-full p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Render Google's native official button */}
      <div
        ref={googleBtnContainerRef}
        className={`w-full flex justify-center min-h-[44px] items-center ${
          isGoogleRendered ? "block" : "hidden"
        }`}
      />

      {/* Fallback button ONLY if official Google button is not rendered yet */}
      {!isGoogleRendered && (
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={loading}
          className="w-full max-w-[320px] inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm py-2.5 px-4 border border-slate-300 rounded-full shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50 !min-h-[44px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Tiếp tục với Google</span>
        </button>
      )}
    </div>
  );
};
