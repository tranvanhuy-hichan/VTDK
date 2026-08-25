"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { UserProfile, LoginDTO, RegisterDTO } from "../types/auth";
import {
  loginAction,
  registerAction,
  googleLoginAction,
  logoutAction,
  getProfileUserAction,
} from "../actions/authActions";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register", onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  login: (dto: LoginDTO) => Promise<{ success: boolean; error?: string; user?: UserProfile | null; isNotRegistered?: boolean }>;
  register: (dto: RegisterDTO) => Promise<{ success: boolean; error?: string; user?: UserProfile | null }>;
  loginWithGoogle: (credential: string) => Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile | null;
    isNewUser?: boolean;
    needsPassword?: boolean;
  }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const onSuccessRef = useRef<(() => void) | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const u = await getProfileUserAction();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const openAuthModal = useCallback((tab: "login" | "register" = "login", onSuccess?: () => void) => {
    setAuthModalTab(tab);
    if (onSuccess) onSuccessRef.current = onSuccess;
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    onSuccessRef.current = null;
  }, []);

  const triggerSuccessCallback = useCallback(() => {
    if (onSuccessRef.current) {
      const cb = onSuccessRef.current;
      onSuccessRef.current = null;
      cb();
    }
  }, []);

  const login = useCallback(
    async (dto: LoginDTO) => {
      const res = await loginAction(dto);
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        triggerSuccessCallback();
        return { success: true, user: res.user };
      }
      return {
        success: false,
        error: res.error || "Đăng nhập thất bại.",
        isNotRegistered: res.isNotRegistered,
      };
    },
    [triggerSuccessCallback]
  );

  const register = useCallback(
    async (dto: RegisterDTO) => {
      const res = await registerAction(dto);
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        triggerSuccessCallback();
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || "Đăng ký thất bại." };
    },
    [triggerSuccessCallback]
  );

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      const res = await googleLoginAction(credential);
      if (res.success && res.user) {
        setUser(res.user);
        if (!res.needsPassword && res.user.phone && res.user.address) {
          setIsAuthModalOpen(false);
          triggerSuccessCallback();
        }
        return {
          success: true,
          user: res.user,
          isNewUser: res.isNewUser,
          needsPassword: res.needsPassword,
        };
      }
      return { success: false, error: res.error || "Đăng nhập Google thất bại." };
    },
    [triggerSuccessCallback]
  );

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
