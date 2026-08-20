import React from "react";
import { Layers, Headphones, BadgePercent, Store, Phone, MessageSquare, MapPin } from "lucide-react";
import { COMPANY_DATA } from "../../data/company";
import type { CompanyContact } from "../../lib/company";

interface WhyChooseUsProps {
  company?: CompanyContact;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ company }) => {
  const hotlineRaw = company?.hotlineRaw || COMPANY_DATA.hotlineRaw;
  const zaloUrl = company?.zaloUrl || COMPANY_DATA.zaloUrl;
  const googleMapsUrl = company?.googleMapsUrl || COMPANY_DATA.googleMapsUrl;

  const getPillarIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 sm:w-6 sm:h-6";
    switch (iconName) {
      case "Layers":
        return <Layers className={`${iconClass} text-[#075FA8]`} />;
      case "Headphones":
        return <Headphones className={`${iconClass} text-[#F47A20]`} />;
      case "BadgePercent":
        return <BadgePercent className={`${iconClass} text-emerald-600`} />;
      default:
        return <Store className={`${iconClass} text-[#075FA8]`} />;
    }
  };

  return (
    <section id="gioi-thieu" className="py-8 sm:py-14 bg-[#0B1F33] text-white relative overflow-hidden transition-colors duration-300">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/80 text-blue-300 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
            CAM KẾT THƯƠNG HIỆU
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Vì sao khách hàng chọn Đông Kha?
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-300 font-normal">
            Chúng tôi tạo dựng uy tín bằng sản phẩm chuẩn kỹ thuật, báo giá minh bạch và phong cách phục vụ tận tâm.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 mb-8 sm:mb-12">
          {COMPANY_DATA.whyChooseUs.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-5 hover:border-[#075FA8] hover:bg-slate-900 transition-all duration-300 flex flex-col text-left group shadow-lg"
            >
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 group-hover:border-[#075FA8] transition-all shrink-0">
                {getPillarIcon(pillar.icon)}
              </div>

              <span className="text-[9px] sm:text-[10px] font-bold text-[#F47A20] uppercase tracking-wider mb-0.5">
                Ưu thế #0{idx + 1}
              </span>

              <h3 className="text-xs sm:text-base font-extrabold text-white mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors leading-snug">
                {pillar.title}
              </h3>

              <p className="text-[11px] sm:text-sm text-slate-300 leading-tight sm:leading-relaxed font-medium">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seamless Combined Contact Bar at Bottom */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3.5 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-[#F47A20] shrink-0">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-xs sm:text-base font-extrabold text-white leading-snug">
                Bạn cần tìm vật tư hoặc tư vấn kỹ thuật điện lạnh?
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 font-normal mt-0.5">
                Đông Kha sẵn sàng báo giá sỉ &amp; lẻ và hỗ trợ bạn nhanh chóng nhất.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full md:w-auto shrink-0">
            <a
              href={`tel:${hotlineRaw}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#F47A20] hover:bg-[#E06912] text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow transition-all text-xs whitespace-nowrap active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Gọi ngay</span>
            </a>

            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow transition-all text-xs whitespace-nowrap active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Zalo</span>
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all text-xs whitespace-nowrap active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Chỉ đường</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
