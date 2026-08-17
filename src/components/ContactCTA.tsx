import React from "react";
import { Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const ContactCTA: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#0B1F33] text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#075FA8]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Box */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl text-center relative">
          
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            HỖ TRỢ &amp; BÁO GIÁ NHANH
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-2xl mx-auto mb-4">
            Bạn đang cần tìm vật tư điện lạnh?
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
            Liên hệ Đông Kha ngay để được hỗ trợ nhanh về sản phẩm, linh kiện và giải pháp điện lạnh phù hợp nhất với nhu cầu của bạn.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-8">
            {/* Phone Button */}
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#F47A20] hover:bg-[#E06912] text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-colors"
            >
              <Phone className="w-4 h-4 fill-current text-white" />
              <span>Gọi {COMPANY_DATA.hotline}</span>
            </a>

            {/* Zalo Button */}
            <a
              href={COMPANY_DATA.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border border-white/20 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Nhắn Zalo ngay</span>
            </a>
          </div>

          {/* Quick Info Strip */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400/80" />
              <span>400 Phạm Hùng, Hòa Xuân, Đà Nẵng</span>
            </div>
            <div className="hidden sm:block text-slate-800">•</div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500/80" />
              <span>Phục vụ: {COMPANY_DATA.workingHours}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
