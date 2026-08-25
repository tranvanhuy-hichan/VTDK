"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
  Truck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { Breadcrumb } from "../common/Breadcrumb";

interface ContactViewProps {
  company: CompanyContact;
}

const INQUIRY_TYPES = [
  "Báo giá sỉ cho thợ",
  "Vật tư dự án / công trình",
  "Hỏi linh kiện / bo mạch",
  "Gas lạnh & Ống đồng",
  "Khác",
];

export const ContactView: React.FC<ContactViewProps> = ({ company }) => {
  const [formSent, setFormSent] = useState(false);
  const [selectedType, setSelectedType] = useState(INQUIRY_TYPES[0]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setFormSent(true);
  };

  return (
    <div className="w-full bg-[#F6F8FA] dark:bg-[#0F172A] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-16">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] text-white pt-0 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto">
          {/* Seamless Banner Breadcrumb */}
          <Breadcrumb items={[{ label: "Liên hệ" }]} variant="banner" />
        </div>

        <div className="max-w-4xl mx-auto space-y-2 text-center pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-blue-100 border border-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>KẾT NỐI TRỰC TIẾP &amp; HỖ TRỢ BÁO GIÁ 24/7</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Liên Hệ Tổng Kho Vật Tư Đông Kha
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto font-medium">
            Hân hạnh phục vụ Quý khách hàng, quý anh em thợ điện lạnh và các nhà thầu cơ điện tại Đà Nẵng &amp; Miền Trung.
          </p>
        </div>
      </section>

      {/* 2. Top 3 Quick-Action Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Card 1: Hotline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Sẵn sàng 24/7
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Hotline &amp; Đặt hàng</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                {company.hotline}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Tư vấn chọn linh kiện, báo giá sỉ &amp; xác nhận đơn hỏa tốc.
              </p>
            </div>

            <a
              href={`tel:${company.hotlineRaw}`}
              className="inline-flex items-center justify-center gap-1.5 w-full bg-[#075FA8] hover:bg-[#064B85] text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer !min-h-0"
            >
              <Phone className="w-3.5 h-3.5 fill-current animate-pulse-subtle" />
              <span>Gọi điện ngay</span>
            </a>
          </div>

          {/* Card 2: Zalo */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0068FF] flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0068FF] border border-blue-200 dark:border-blue-800">
                Phản hồi 5 phút
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Zalo Báo Giá Nhanh</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Nhắn Zalo Tư Vấn
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gửi ảnh mẫu linh kiện, mã bo mạch hoặc bản vẽ BOQ dự án.
              </p>
            </div>

            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full bg-[#0068FF] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer !min-h-0"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Chat Zalo Báo Giá</span>
            </a>
          </div>

          {/* Card 3: Storefront Address */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Kho sẵn hàng
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Cửa Hàng &amp; Kho Tổng</div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                {company.address}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{company.workingHours}</span>
              </p>
            </div>

            <a
              href={company.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer !min-h-0"
            >
              <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-100" />
              <span>Chỉ đường Google Maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Quote Form + Store Map */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Cột trái: Form gửi yêu cầu tư vấn */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#075FA8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3 h-3" />
                <span>Báo giá trực tuyến</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1.5">
                Gửi Yêu Cầu Báo Giá Vật Tư
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Điền thông tin bên dưới để nhận bảng giá chiết khấu sỉ trong ít phút.
              </p>
            </div>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-300">
                  Yêu Cầu Đã Gửi Thành Công!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Cảm ơn Quý khách <strong className="font-bold">{fullName}</strong>. Chuyên viên kinh doanh Đông Kha sẽ gọi đến số <strong className="font-mono">{phone}</strong> trong ít phút.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSent(false);
                    setFullName("");
                    setPhone("");
                    setNote("");
                  }}
                  className="mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Nhu cầu Tag Buttons */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    Nhu cầu của bạn:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {INQUIRY_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer !min-h-0 ${
                          selectedType === type
                            ? "bg-[#075FA8] border-[#075FA8] text-white shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A (Thợ điện lạnh)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại nhận báo giá..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Nội dung cần tư vấn hoặc danh sách vật tư
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập tên linh kiện, số lượng cuộn ống đồng, số bình gas cần lấy..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#F47A20] hover:bg-orange-600 text-white font-black py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer !min-h-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Báo Giá Nhanh</span>
                </button>
              </form>
            )}
          </div>

          {/* Cột phải: Bản đồ Google Maps & Chỉ dẫn kho */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-lg flex flex-col">
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#075FA8] dark:text-blue-400">
                    BẢN ĐỒ KHO HÀNG
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                    Vị Trí Cửa Hàng &amp; Kho Tổng Đông Kha
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {company.address}
                  </p>
                </div>

                <a
                  href={company.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#075FA8] dark:text-blue-400 font-bold text-xs px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-100" />
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="h-[360px] sm:h-[420px] w-full relative bg-slate-100 dark:bg-slate-800">
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
              </div>
            </div>

            {/* 2 Guide Chips under Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">Bãi Đỗ Xe Tải Rộng Rãi</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Tiện lợi bốc dỡ ống đồng &amp; thiết bị lớn</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">Hỗ Trợ Thử Bo Mạch Tại Chỗ</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Kỹ thuật viên kiểm tra trực tiếp cho thợ</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
