import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import type { CompanyContact } from "../lib/company";

interface FloatingContactProps {
  company: CompanyContact;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ company }) => {
  return (
    <>
      {/* Floating Contact Buttons (Right side sticky, visible on both desktop & mobile) */}
      <div className="fixed bottom-8 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">

        {/* Zalo Button */}
        <a
          href={company.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo"
          className="group flex items-center bg-[#0068FF] text-white p-3 rounded-full shadow-xl md:hover:shadow-2xl transition-all duration-300 md:hover:scale-105"
        >
          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap md:group-hover:max-w-[200px] md:group-hover:opacity-100 md:group-hover:pr-3 transition-all duration-300 font-extrabold text-sm">
            Nhắn Zalo tư vấn
          </span>
          <div className="w-8 h-8 flex items-center justify-center bg-white text-[#0068FF] rounded-full shrink-0">
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
          </div>
        </a>

        {/* Call Hotline Button with subtle pulse effect */}
        <a
          href={`tel:${company.hotlineRaw}`}
          aria-label="Gọi điện hotline"
          className="group flex items-center bg-[#075FA8] md:hover:bg-[#F47A20] text-white p-3 rounded-full shadow-xl md:hover:shadow-2xl transition-all duration-300 animate-pulse-subtle md:hover:scale-105"
        >
          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap md:group-hover:max-w-[200px] md:group-hover:opacity-100 md:group-hover:pr-3 transition-all duration-300 font-extrabold text-sm">
            Gọi ngay: {company.hotline}
          </span>
          <div className="w-8 h-8 flex items-center justify-center bg-white text-[#075FA8] rounded-full shrink-0">
            <Phone className="w-4.5 h-4.5 fill-current" />
          </div>
        </a>

      </div>
    </>
  );
};
