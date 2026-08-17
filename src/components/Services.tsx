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
import type { CompanyContact } from "../lib/company";
import { ImageCarousel } from "./ImageCarousel";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  images: string[];
}

interface ServicesProps {
  company: CompanyContact;
  services: ServiceItem[];
}

export const Services: React.FC<ServicesProps> = ({ company, services }) => {
  if (services.length === 0) return null;

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
    <section id="dich-vu" className="py-16 sm:py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100/80 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 text-[#F47A20] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            GIẢI PHÁP &amp; THI CÔNG KỸ THUẬT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Không chỉ cung cấp vật tư
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-300 font-normal">
            Đông Kha còn cung cấp các giải pháp điện lạnh toàn diện từ dân dụng đến công nghiệp.
          </p>
        </div>

        {/* Services List (Alternating Layouts) */}
        <div className="space-y-6 sm:space-y-8">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300`}
              >
                {/* Image Col (4 cols) */}
                <div className={`lg:col-span-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative rounded-xl overflow-hidden shadow-sm aspect-[16/10] bg-slate-200 dark:bg-slate-950">
                    <ImageCarousel
                      images={[service.image, ...service.images]}
                      alt={service.title}
                      className="w-full h-full"
                      imgClassName="hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kỹ thuật 100%</span>
                    </div>
                  </div>
                </div>

                {/* Content Col (8 cols) */}
                <div className={`lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"} text-left`}>
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 shrink-0">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-[#F47A20] uppercase tracking-wider">
                        Giải Pháp #{index + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-5 pl-1">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="flex items-center gap-2.5">
                    <a
                      href={`tel:${company.hotlineRaw}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-colors text-xs sm:text-sm whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse-subtle" />
                      <span className="sm:hidden">Gọi {company.hotline}</span>
                      <span className="hidden sm:inline">Tư vấn kỹ thuật: {company.hotline}</span>
                    </a>
                    <a
                      href={company.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors text-xs sm:text-sm whitespace-nowrap"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                      <span className="sm:hidden">Nhắn Zalo</span>
                      <span className="hidden sm:inline">Gửi thông tin công trình</span>
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
