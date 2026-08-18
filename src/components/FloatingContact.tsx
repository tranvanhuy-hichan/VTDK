"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";
import type { CompanyContact } from "../lib/company";

interface FloatingContactProps {
  company: CompanyContact;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ company }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-1.5 pointer-events-auto sm:bottom-7 sm:right-6">
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
    </div>
  );
};
