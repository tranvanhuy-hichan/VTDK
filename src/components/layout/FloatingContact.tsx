"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MessageCircle, ChevronUp, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { CompanyContact } from "../../lib/company";

interface FloatingContactProps {
  company: CompanyContact;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ company }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 250);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-21 right-3.5 z-30 flex flex-col items-center gap-1.5 pointer-events-auto sm:bottom-7 sm:right-6">
      {/* Floating Scroll to Top Chevron Icon Only (No circle background, no vertical stem line) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Về đầu trang"
        className={`p-1 flex items-center justify-center transition-all duration-300 hover:scale-125 active:scale-95 cursor-pointer !min-h-0 ${
          showScrollTop ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-2 pointer-events-none"
        }`}
      >
        <ChevronUp className="w-7 h-7 text-[#075FA8] dark:text-blue-400 drop-shadow-md stroke-[3]" />
      </button>

      {/* If user is ADMIN: Replace 2 contact buttons with Admin Dashboard Link */}
      {isAdmin ? (
        <Link
          href="/admin"
          aria-label="Vào trang quản trị"
          className="group flex items-center bg-gradient-to-r from-slate-900 via-[#075FA8] to-slate-900 text-white p-2.5 rounded-full shadow-2xl hover:shadow-[#075FA8]/50 transition-all duration-300 hover:scale-105 border-2 border-amber-400/90 ring-4 ring-amber-400/20"
        >
          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap md:group-hover:max-w-[200px] md:group-hover:opacity-100 md:group-hover:pr-3 transition-all duration-300 font-extrabold text-sm text-amber-300">
            Trang Quản Trị
          </span>
          <div className="w-7 h-7 flex items-center justify-center bg-amber-400 text-slate-950 rounded-full shrink-0 shadow-md">
            <LayoutDashboard className="w-4 h-4" />
          </div>
        </Link>
      ) : (
        <>
          {/* Zalo Button */}
          <a
            href={company.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn Zalo"
            className="group flex items-center bg-[#0068FF] text-white p-2.5 rounded-full shadow-xl md:hover:shadow-2xl transition-all duration-300 md:hover:scale-105"
          >
            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap md:group-hover:max-w-[200px] md:group-hover:opacity-100 md:group-hover:pr-3 transition-all duration-300 font-extrabold text-sm">
              Nhắn Zalo tư vấn
            </span>
            <div className="w-7 h-7 flex items-center justify-center bg-white text-[#0068FF] rounded-full shrink-0">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
          </a>

          {/* Call Hotline Button */}
          <a
            href={`tel:${company.hotlineRaw}`}
            aria-label="Gọi điện hotline"
            className="group flex items-center bg-[#075FA8] md:hover:bg-[#F47A20] text-white p-2.5 rounded-full shadow-xl md:hover:shadow-2xl transition-all duration-300 animate-pulse-subtle md:hover:scale-105"
          >
            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap md:group-hover:max-w-[200px] md:group-hover:opacity-100 md:group-hover:pr-3 transition-all duration-300 font-extrabold text-sm">
              Gọi ngay: {company.hotline}
            </span>
            <div className="w-7 h-7 flex items-center justify-center bg-white text-[#075FA8] rounded-full shrink-0">
              <Phone className="w-4 h-4 fill-current" />
            </div>
          </a>
        </>
      )}
    </div>
  );
};
