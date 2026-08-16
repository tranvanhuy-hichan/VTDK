import React from "react";
import { Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const ContactCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#0B1F33] text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#075FA8]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Box */}
        <div className="bg-gradient-to-br from-slate-900 via-[#075FA8]/30 to-slate-900 border border-blue-700/50 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl text-center relative">
          
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-[#F47A20] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
            <Phone className="w-4 h-4 animate-bounce" />
            HỖ TRỢ &amp; BÁO GIÁ NHANH
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            Bạn đang cần tìm vật tư điện lạnh?
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
            Liên hệ Đông Kha ngay để được hỗ trợ nhanh về sản phẩm, linh kiện và giải pháp điện lạnh phù hợp nhất với nhu cầu của bạn.
          </p>

          {/* Large Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-10">
            {/* Phone Button */}
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-[#075FA8] hover:bg-blue-600 text-white font-extrabold text-lg sm:text-xl px-8 py-4 sm:py-5 rounded-2xl shadow-xl shadow-blue-900/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Phone className="w-6 h-6 fill-current text-white" />
              <span>Gọi {COMPANY_DATA.hotline}</span>
            </a>

            {/* Zalo Button */}
            <a
              href={COMPANY_DATA.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-[#0068FF] hover:bg-blue-600 text-white font-extrabold text-lg sm:text-xl px-8 py-4 sm:py-5 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Nhắn Zalo ngay</span>
            </a>
          </div>

          {/* Quick Info Strip */}
          <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F47A20]" />
              <span>400 Phạm Hùng, Hòa Xuân, Đà Nẵng</span>
            </div>
            <div className="hidden sm:block text-slate-700">•</div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Phục vụ: {COMPANY_DATA.workingHours}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
