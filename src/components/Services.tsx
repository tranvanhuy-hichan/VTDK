import React from "react";
import { 
  Building2, 
  Fan, 
  Wind, 
  ThermometerSun, 
  CheckCircle2, 
  Phone, 
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import type { CompanyContact } from "../lib/company";

interface ServicesProps {
  company: CompanyContact;
}

export const Services: React.FC<ServicesProps> = ({ company }) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-8 h-8 text-[#075FA8]" />;
      case "Fan":
        return <Fan className="w-8 h-8 text-sky-600 animate-spin-slow" />;
      case "Wind":
        return <Wind className="w-8 h-8 text-[#F47A20]" />;
      default:
        return <ThermometerSun className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <section id="dich-vu" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 text-[#F47A20] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            GIẢI PHÁP &amp; THI CÔNG KỸ THUẬT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Không chỉ cung cấp vật tư
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Đông Kha còn cung cấp các giải pháp điện lạnh toàn diện từ dân dụng đến công nghiệp.
          </p>
        </div>

        {/* Services List (Alternating Layouts) */}
        <div className="space-y-12 sm:space-y-16">
          {COMPANY_DATA.services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F6F8FA] rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Image Col (5 cols) */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[16/10] bg-slate-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow text-xs font-bold text-slate-800 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-600" />
                      <span>Cam kết chuẩn kỹ thuật 100%</span>
                    </div>
                  </div>
                </div>

                {/* Content Col (7 cols) */}
                <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"} text-left`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow border border-slate-200 shrink-0">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#F47A20] uppercase tracking-wider">
                        Giải Pháp #{index + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-[#075FA8] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${company.hotlineRaw}`}
                      className="inline-flex items-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold px-5 py-3 rounded-xl shadow transition-colors text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span>Tư vấn kỹ thuật: {company.hotline}</span>
                    </a>
                    <a
                      href={company.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold px-5 py-3 rounded-xl shadow-xs transition-colors text-sm sm:text-base"
                    >
                      <MessageSquare className="w-4 h-4 text-[#0068FF]" />
                      <span>Gửi thông tin công trình</span>
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
