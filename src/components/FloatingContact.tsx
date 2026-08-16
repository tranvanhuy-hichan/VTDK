import React from "react";
import { Phone, MessageSquare, Navigation } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const FloatingContact: React.FC = () => {
  return (
    <>
      {/* Desktop Floating Contact Buttons (Right side sticky) */}
      <div className="hidden md:flex fixed bottom-8 right-6 z-40 flex-col items-end gap-3 pointer-events-auto">
        
        {/* Zalo Button */}
        <a
          href={COMPANY_DATA.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo"
          className="group flex items-center gap-3 bg-[#0068FF] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-extrabold text-sm pl-1">
            Nhắn Zalo tư vấn
          </span>
          <div className="w-7 h-7 flex items-center justify-center bg-white text-[#0068FF] font-black rounded-full text-xs">
            Zalo
          </div>
        </a>

        {/* Call Hotline Button with subtle pulse effect */}
        <a
          href={`tel:${COMPANY_DATA.hotlineRaw}`}
          aria-label="Gọi điện hotline"
          className="group flex items-center gap-3 bg-[#075FA8] hover:bg-[#F47A20] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-subtle hover:scale-105"
        >
          <span className="font-extrabold text-sm pl-2">
            ☎ {COMPANY_DATA.hotline}
          </span>
          <div className="w-7 h-7 flex items-center justify-center bg-white text-[#075FA8] rounded-full">
            <Phone className="w-4 h-4 fill-current" />
          </div>
        </a>

      </div>

      {/* Mobile Fixed Bottom Contact Bar (Height: 64px, Touch target: >= 44px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1F33]/95 backdrop-blur-md border-t border-slate-700/80 shadow-2xl px-2 py-2 flex items-center justify-around gap-1.5 h-[64px]">
        
        {/* Call Button */}
        <a
          href={`tel:${COMPANY_DATA.hotlineRaw}`}
          className="flex-1 flex flex-col items-center justify-center bg-[#075FA8] text-white rounded-xl py-1.5 px-2 active:scale-95 transition-transform h-full"
        >
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 fill-current" />
            <span className="font-extrabold text-sm tracking-tight">GỌI NGAY</span>
          </div>
          <span className="text-[10px] text-blue-100 leading-none">{COMPANY_DATA.hotline}</span>
        </a>

        {/* Zalo Button */}
        <a
          href={COMPANY_DATA.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center bg-[#0068FF] text-white rounded-xl py-1.5 px-2 active:scale-95 transition-transform h-full"
        >
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span className="font-extrabold text-sm tracking-tight">ZALO</span>
          </div>
          <span className="text-[10px] text-blue-100 leading-none">Tư vấn nhanh</span>
        </a>

        {/* Maps Directions Button */}
        <a
          href={COMPANY_DATA.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center bg-[#EA4335] text-white rounded-xl py-1.5 px-2 active:scale-95 transition-transform h-full"
        >
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 fill-current" />
            <span className="font-extrabold text-sm tracking-tight">CHỈ ĐƯỜNG</span>
          </div>
          <span className="text-[10px] text-red-100 leading-none">400 Phạm Hùng</span>
        </a>

      </div>
    </>
  );
};
