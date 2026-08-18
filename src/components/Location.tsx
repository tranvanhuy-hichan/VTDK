import React from "react";
import { MapPin, Phone, MessageSquare, Navigation, ExternalLink, Globe } from "lucide-react";
import type { CompanyContact } from "../lib/company";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

interface LocationProps {
    company: CompanyContact;
}

export const Location: React.FC<LocationProps> = ({ company }) => {
    return (
        <section id="lien-he" className="py-8 sm:py-14 bg-white dark:bg-[#0F172A] relative transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100/70 dark:bg-blue-900/20 text-[#075FA8] dark:text-blue-400 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3">
                        BẢN ĐỒ &amp; ĐỊA CHỈ TRỰC TIẾP
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Ghé Đông Kha tại Đà Nẵng
                    </h2>
                    <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-300 font-normal">
                        Khách hàng và anh em thợ có thể đến xem vật tư, thử bo mạch &amp; nhận hàng trực tiếp tại cửa hàng.
                    </p>
                </div>

                {/* Main 2-Column Contact Info Box matching reference design */}
                <div className="bg-slate-50/70 dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 lg:p-10 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                        {/* Left Column: Company Intro & Registration */}
                        <div className="lg:col-span-7 flex flex-col text-left lg:border-r border-slate-200 dark:border-slate-800 lg:pr-10 space-y-4">

                            <h2 className="text-lg sm:text-xl font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-tight leading-snug">
                                {company.name}
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                Với phương châm luôn luôn đồng hành cùng Quý khách hàng để phát triển sản phẩm của những thương hiệu nổi tiếng thế giới - <strong className="text-slate-900 dark:text-white font-extrabold">"CHẤT LƯỢNG TỐT NHẤT"</strong>.
                            </p>

                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                Chúng tôi đặt nền tảng <strong className="text-slate-900 dark:text-white font-extrabold uppercase">UY TÍN</strong> là sự sống còn của doanh nghiệp.
                            </p>

                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                {company.name} tự hào là doanh nghiệp đi đầu trong ngành vật tư và giải pháp thi công điện lạnh tại Đà Nẵng và khu vực Miền Trung.
                            </p>

                            {/* Social Media Connections */}
                            <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Kết nối với chúng tôi:
                                </span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={company.facebookUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                        className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity"
                                    >
                                        <FacebookIcon className="w-4 h-4 fill-current" />
                                    </a>
                                    <a
                                        href={company.zaloUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Zalo"
                                        className="w-8 h-8 rounded-lg bg-[#0068FF] text-white flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity font-black text-[11px]"
                                    >
                                        Zalo
                                    </a>
                                    <a
                                        href={company.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Google Maps"
                                        className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity"
                                    >
                                        <MapPin className="w-4 h-4 fill-current" />
                                    </a>
                                </div>
                            </div>

                            {/* Company Meta Footer */}
                            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                                    {company.name}
                                </p>
                                <p className="font-medium">
                                    Phân phối sỉ &amp; lẻ ống đồng, gas lạnh, linh kiện điều hòa – tủ lạnh – máy giặt.
                                </p>
                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                    Số điện thoại liên hệ:{" "}
                                    <a
                                        href={`tel:${company.hotlineRaw}`}
                                        className="text-[#075FA8] dark:text-blue-400 hover:underline font-extrabold text-sm inline-block ml-1"
                                    >
                                        {company.hotline}
                                    </a>
                                </p>
                            </div>

                        </div>

                        {/* Right Column: Contact Detail Points */}
                        <div className="lg:col-span-5 flex flex-col text-left space-y-4">

                            <h3 className="text-lg sm:text-xl font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-tight leading-snug mb-1">
                                THÔNG TIN LIÊN HỆ
                            </h3>

                            <div className="space-y-4">

                                {/* Store / Head Office */}
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4.5 h-4.5 text-[#075FA8] dark:text-blue-400 fill-blue-100 dark:fill-blue-950 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                            Trụ sở &amp; Cửa hàng chính:
                                        </span>
                                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal block mt-0.5">
                                            {company.address}
                                        </span>
                                    </div>
                                </div>

                                {/* Warehouse */}
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4.5 h-4.5 text-[#075FA8] dark:text-blue-400 fill-blue-100 dark:fill-blue-950 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                            Kho hàng &amp; Trung tâm kỹ thuật:
                                        </span>
                                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal block mt-0.5">
                                            {company.address} (Kho vật tư điện lạnh sẵn số lượng lớn)
                                        </span>
                                    </div>
                                </div>

                                {/* Hotline & Zalo */}
                                <div className="flex items-start gap-2.5">
                                    <Phone className="w-4.5 h-4.5 text-orange-500 fill-orange-100 dark:fill-orange-950 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                            Hotline &amp; Zalo hỗ trợ 24/7:
                                        </span>
                                        <a
                                            href={`tel:${company.hotlineRaw}`}
                                            className="text-sm font-extrabold text-[#075FA8] dark:text-blue-400 hover:underline block mt-0.5"
                                        >
                                            {company.hotline}
                                        </a>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex items-start gap-2.5">
                                    <Globe className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                            Thời gian phục vụ:
                                        </span>
                                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal block mt-0.5">
                                            {company.workingHours}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Action buttons */}
                            <div className="pt-4 flex items-center gap-2.5">
                                <a
                                    href={`tel:${company.hotlineRaw}`}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-xs transition-colors"
                                >
                                    <Phone className="w-4 h-4 fill-current shrink-0" />
                                    <span>Gọi tư vấn</span>
                                </a>
                                <a
                                    href={company.zaloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-xs transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                    <span>Nhắn Zalo</span>
                                </a>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Small Compact Map Box Below */}
                <div id="dia-chi" className="mt-6 sm:mt-8 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
                    <div className="h-44 sm:h-56 w-full relative">
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
                        <div className="absolute bottom-3 right-3 z-10">
                            <a
                                href={company.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#075FA8] dark:text-blue-400 hover:text-slate-900 dark:hover:text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                                <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-100" />
                                <span>Mở Google Maps chỉ đường</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
