import React from "react";
import { Cpu, Flame, Shield, Wind, Zap, Layers, Settings, Compass } from "lucide-react";

interface Brand {
  name: string;
  country?: string;
  icon: React.ReactNode;
}

export const BrandSlider: React.FC = () => {
  const brands: Brand[] = [
    { name: "DAIKIN", country: "Japan", icon: <Wind className="w-5 h-5 text-sky-500" /> },
    { name: "PANASONIC", country: "Japan", icon: <Cpu className="w-5 h-5 text-blue-600" /> },
    { name: "LUVATA", country: "Thailand", icon: <Layers className="w-5 h-5 text-amber-600" /> },
    { name: "TOÀN PHÁT", country: "Vietnam", icon: <Shield className="w-5 h-5 text-emerald-600" /> },
    { name: "CHEMOURS", country: "USA", icon: <Flame className="w-5 h-5 text-orange-500" /> },
    { name: "HONEYWELL", country: "USA", icon: <Zap className="w-5 h-5 text-yellow-500" /> },
    { name: "SUPERLON", country: "Malaysia", icon: <Settings className="w-5 h-5 text-red-500" /> },
    { name: "LG", country: "Korea", icon: <Compass className="w-5 h-5 text-rose-600" /> },
    { name: "TOSHIBA", country: "Japan", icon: <Wind className="w-5 h-5 text-blue-500" /> },
    { name: "COPELAND", country: "USA", icon: <Cpu className="w-5 h-5 text-cyan-600" /> },
  ];

  // Double the list to create a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-4 bg-[#F6F8FA] border-y border-slate-200/80 relative overflow-hidden select-none">
      {/* Absolute Gradient Overlays on Sides to create a fading edge effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F6F8FA] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F6F8FA] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-2.5 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Thương hiệu vật tư phân phối &amp; đối tác liên kết
        </p>
      </div>

      {/* Infinite Scroll Container */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex gap-5 py-1">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-lg px-4 py-1.5 shadow-2xs hover:border-slate-350 transition-colors shrink-0"
            >
              <div className="p-1 bg-slate-50 border border-slate-100 rounded-md">
                {brand.icon}
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide block">
                  {brand.name}
                </span>
                {brand.country && (
                  <span className="text-[8px] font-semibold text-slate-400 block uppercase leading-none mt-0.5">
                    {brand.country}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
