import React from "react";
import { Navigation, ExternalLink } from "lucide-react";
import type { CompanyContact } from "../lib/company";

interface LocationProps {
    company: CompanyContact;
}

export const Location: React.FC<LocationProps> = ({ company }) => {
    return (
        <section id="lien-he" className="py-8 sm:py-14 bg-white dark:bg-[#0F172A] relative transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-[#075FA8] dark:text-blue-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
            BẢN ĐỒ &amp; ĐỊA CHỈ TRỰC TIẾP
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Ghé Đông Kha tại Đà Nẵng
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-300 font-normal">
            Khách hàng và anh em thợ có thể đến xem vật tư, thử bo mạch &amp; nhận hàng trực tiếp tại cửa hàng.
          </p>
                </div>

                {/* Standalone Map Box */}
                <div id="dia-chi" className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative">
                    <div className="h-72 sm:h-96 md:h-[420px] w-full relative">
                        <iframe
                            title="Bản đồ chỉ đường đến Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
                            src={company.googleMapsEmbed}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        />
                        <div className="absolute bottom-4 right-4 z-10">
                            <a
                                href={company.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#075FA8] dark:text-blue-400 hover:text-slate-900 dark:hover:text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                                <Navigation className="w-4 h-4 text-red-500 fill-red-100" />
                                <span>Mở Google Maps chỉ đường</span>
                                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
