import React from "react";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import type { CompanyContact } from "../../lib/company";

interface QuickContactBarProps {
  company: CompanyContact;
}

export const QuickContactBar: React.FC<QuickContactBarProps> = ({ company }) => {
  return (
    <section className="bg-gradient-to-r from-[#0B1F33] via-[#075FA8] to-[#0B1F33] text-white py-3.5 sm:py-6 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center md:text-left">

          {/* Question Text */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-[#F47A20] shrink-0">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold tracking-tight text-white leading-tight">
                Bạn đang cần tìm vật tư hoặc tư vấn kỹ thuật điện lạnh?
              </h3>
              <p className="text-[11px] sm:text-sm text-blue-100/90 font-medium mt-0.5 sm:mt-1">
                {company.brandName || "Chúng tôi"} luôn sẵn sàng báo giá sỉ &amp; lẻ và hỗ trợ bạn nhanh chóng nhất.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            {/* Call */}
            <a
              href={`tel:${company.hotlineRaw}`}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-[#F47A20] hover:bg-[#E06912] text-white font-extrabold px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow transition-all duration-200 text-xs sm:text-base whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>Gọi ngay</span>
            </a>

            {/* Zalo */}
            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow transition-all duration-200 text-xs sm:text-base whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Zalo</span>
            </a>

            {/* Directions */}
            <a
              href={company.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 text-xs sm:text-base whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
              <span>Chỉ đường</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
