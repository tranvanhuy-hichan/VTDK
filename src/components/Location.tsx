import React from "react";
import { MapPin, Phone, MessageSquare, Navigation, Clock, ShieldCheck } from "lucide-react";
import type { CompanyContact } from "../lib/company";

interface LocationProps {
  company: CompanyContact;
}

export const Location: React.FC<LocationProps> = ({ company }) => {
  return (
    <section id="lien-he" className="py-16 bg-[#F6F8FA] dark:bg-[#0F172A] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-[#075FA8] dark:text-blue-400 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            BẢN ĐỒ &amp; ĐỊA CHỈ TRỰC TIẾP
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ghé Đông Kha tại Đà Nẵng
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
            Khách hàng và anh em thợ có thể đến xem vật tư, thử bo mạch &amp; nhận hàng trực tiếp tại cửa hàng.
          </p>
        </div>

        {/* 2 Column Layout (Desktop: Maps Left / Info Right; Mobile: Info Top / Maps Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Desktop Left / Mobile Bottom: Google Maps Container (7 cols) */}
          <div id="dia-chi" className="lg:col-span-7 order-2 lg:order-1 flex flex-col">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex-1 min-h-[340px] sm:min-h-[420px] relative">
              <iframe
                title="Bản đồ chỉ đường đến Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
                src={company.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[340px] sm:min-h-[420px]"
              />
            </div>
          </div>

          {/* Desktop Right / Mobile Top: Store Contact Card (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left transition-colors duration-300">
            
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#F47A20] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                CỬA HÀNG VẬT TƯ CHÍNH THỨC
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Vật Tư Điện Lạnh Đông Kha
              </h3>

              {/* Detailed Contact List */}
              <div className="space-y-5 mb-8">
                
                {/* Address Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-blue-50 dark:bg-slate-800 text-[#075FA8] dark:text-blue-400 rounded-lg shrink-0 mt-0.5 border border-blue-100 dark:border-slate-700">
                    <MapPin className="w-4.5 h-4.5 fill-blue-600 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-0.5">
                      Địa chỉ cửa hàng
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-200 leading-snug block">
                      {company.address}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                      (Mặt tiền đường Phạm Hùng, Phường Hòa Xuân, quận Cẩm Lệ, Đà Nẵng)
                    </span>
                  </div>
                </div>

                {/* Hotline Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-orange-50 dark:bg-slate-800 text-[#F47A20] dark:text-orange-400 rounded-lg shrink-0 mt-0.5 border border-orange-100 dark:border-slate-700">
                    <Phone className="w-4.5 h-4.5 fill-current animate-pulse-subtle" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-0.5">
                      Hotline &amp; Zalo hỗ trợ
                    </span>
                    <a
                      href={`tel:${company.hotlineRaw}`}
                      className="text-lg sm:text-xl font-extrabold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-amber-400 transition-colors block"
                    >
                      {company.hotline}
                    </a>
                  </div>
                </div>

                {/* Hours Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-0.5">
                      Thời gian mở cửa
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      {company.workingHours}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Direct Action Buttons Grid */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2.5">
              
              {/* Directions */}
              <a
                href={company.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-extrabold py-3 px-1 rounded-lg transition-colors text-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-100 dark:fill-red-950" />
                <span>Chỉ đường</span>
              </a>

              {/* Call */}
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-extrabold py-3 px-1 rounded-lg transition-colors text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Gọi ngay</span>
              </a>

              {/* Zalo */}
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-extrabold py-3 px-1 rounded-lg transition-colors text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#0068FF]" />
                <span>Zalo</span>
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
