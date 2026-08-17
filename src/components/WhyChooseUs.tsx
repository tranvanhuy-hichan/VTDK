import React from "react";
import { Layers, Headphones, BadgePercent, Store } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const WhyChooseUs: React.FC = () => {
  const getPillarIcon = (iconName: string) => {
    const iconClass = "w-6 h-6";
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
    <section id="gioi-thieu" className="py-12 sm:py-16 bg-[#0B1F33] text-white relative overflow-hidden">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/80 text-blue-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
            CAM KẾT THƯƠNG HIỆU
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Vì sao khách hàng chọn Đông Kha?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal">
            Chúng tôi tạo dựng uy tín bằng sản phẩm chuẩn kỹ thuật, báo giá minh bạch và phong cách phục vụ tận tâm.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {COMPANY_DATA.whyChooseUs.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-[#075FA8] hover:bg-slate-900 transition-all duration-300 flex flex-col text-left group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-[#075FA8] transition-all">
                {getPillarIcon(pillar.icon)}
              </div>

              <span className="text-[10px] font-bold text-[#F47A20] uppercase tracking-wider mb-0.5">
                Ưu thế #0{idx + 1}
              </span>

              <h3 className="text-base sm:text-lg font-extrabold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {pillar.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
