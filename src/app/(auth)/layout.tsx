import React from "react";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#071626] text-slate-100 antialiased font-sans flex flex-col justify-center">
          {children}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
