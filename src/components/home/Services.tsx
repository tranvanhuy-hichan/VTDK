import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Fan, 
  Wind, 
  ThermometerSun, 
  CheckCircle2, 
  Phone, 
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { ImageCarousel } from "../product/ImageCarousel";

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

  const featuredService = services[0];

  const getServiceIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 sm:w-8 sm:h-8";
    switch (iconName) {
      case "Building2":
        return <Building2 className={`${iconClass} text-[#075FA8]`} />;
      case "Fan":
        return <Fan className={`${iconClass} text-sky-600 animate-spin-slow`} />;
      case "Wind":
        return <Wind className={`${iconClass} text-[#F47A20]`} />;
      default:
        return <ThermometerSun className={`${iconClass} text-amber-500`} />;
    }
  };

  return (
    <section id="dich-vu" className="py-8 sm:py-16 bg-white dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100/80 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 text-[#F47A20] px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GIẢI PHÁP &amp; THI CÔNG KỸ THUẬT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Giải Pháp Điện Lạnh Toàn Diện
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-300 font-normal">
            Không chỉ phân phối vật tư, Đông Kha còn đồng hành tư vấn &amp; hỗ trợ kỹ thuật chuyên sâu cho mọi công trình.
          </p>
        </div>

        {/* Single Featured Service Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300">
          {/* Image Col (4 cols) */}
          <div className="lg:col-span-4">
            <div className="relative rounded-xl overflow-hidden shadow-sm aspect-[16/10] bg-slate-200 dark:bg-slate-950">
              <ImageCarousel
                images={[featuredService.image, ...featuredService.images]}
                alt={featuredService.title}
                className="w-full h-full"
                imgClassName="hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kỹ thuật 100% CO/CQ</span>
              </div>
            </div>
          </div>

          {/* Content Col (8 cols) */}
          <div className="lg:col-span-8 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 shrink-0">
                {getServiceIcon(featuredService.icon)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#F47A20] uppercase tracking-wider block">
                  GIẢI PHÁP TIÊU BIỂU
                </span>
                <h3 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {featuredService.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {featuredService.description}
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 py-1">
              {featuredService.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap sm:flex-nowrap">
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-colors text-xs sm:text-sm whitespace-nowrap cursor-pointer !min-h-0"
              >
                <Phone className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse-subtle" />
                <span>Tư vấn kỹ thuật: {company.hotline}</span>
              </a>

              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors text-xs sm:text-sm whitespace-nowrap cursor-pointer !min-h-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                <span>Nhắn Zalo công trình</span>
              </a>
            </div>
          </div>
        </div>

        {/* View All Button leading to /giai-phap */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/giai-phap"
            className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#075FA8] hover:text-white dark:hover:bg-[#075FA8] text-slate-800 dark:text-slate-200 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-300 group cursor-pointer !min-h-0"
          >
            <span>Xem tất cả giải pháp kỹ thuật ({services.length})</span>
            <ArrowRight className="w-4 h-4 text-[#075FA8] dark:text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

      </div>
    </section>
  );
};
