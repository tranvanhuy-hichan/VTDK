"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building2,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";

interface ContactViewProps {
  company: CompanyContact;
}

export const ContactView: React.FC<ContactViewProps> = ({ company }) => {
  const [formSent, setFormSent] = useState(false);
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
      <section className="bg-gradient-to-r from-[#075FA8] via-[#08457A] to-[#0B2540] text-white py-6 sm:py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-blue-200 border border-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5 text-amber-300" />
            <span>KẾT NỐI TRỰC TIẾP &amp; HỖ TRỢ 24/7</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Liên Hệ Tổng Kho Vật Tư Đông Kha
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto font-medium">
            Phân phối sỉ lẻ vật tư điện lạnh chính hãng, báo giá công trình &amp; hỗ trợ kỹ thuật tại Đà Nẵng.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Cột trái: Thông tin liên hệ & Giờ làm việc */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            {/* Thẻ công ty */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <div className="text-[10px] font-black text-[#075FA8] dark:text-blue-400 uppercase tracking-wider">
                  ĐƠN VỊ CHỦ QUẢN
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {company.name}
                </h2>
              </div>

              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Địa chỉ kho hàng</span>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{company.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Hotline &amp; Đặt hàng</span>
                    <a
                      href={`tel:${company.hotlineRaw}`}
                      className="text-[#075FA8] dark:text-blue-400 font-extrabold hover:underline font-mono"
                    >
                      {company.hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#0068FF] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Zalo tư vấn báo giá</span>
                    <a
                      href={company.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0068FF] font-extrabold hover:underline"
                    >
                      Nhắn tin Zalo trực tiếp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Thời gian làm việc</span>
                    <span className="text-slate-600 dark:text-slate-300">{company.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <a
                  href={`tel:${company.hotlineRaw}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#08457A] text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer !min-h-0"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Gọi Hotline</span>
                </a>

                <a
                  href={company.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer !min-h-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Chat Zalo</span>
                </a>
              </div>
            </div>

            {/* Thẻ gửi thông tin nhanh */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-2">
                Gửi yêu cầu báo giá vật tư
              </h3>

              {formSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Cảm ơn bạn đã gửi thông tin!
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Bộ phận kinh doanh Đông Kha sẽ liên hệ lại trong ít phút.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Họ tên của bạn *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Số điện thoại / Zalo *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Danh sách vật tư hoặc nội dung cần tư vấn..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#075FA8] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-[#F47A20] hover:bg-orange-600 text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer !min-h-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi yêu cầu tư vấn</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Cột phải: Bản đồ Google Maps chỉ đường */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Vị Trí Cửa Hàng &amp; Kho Hàng
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    400 Phạm Hùng, Hòa Phước, Hòa Vang, Đà Nẵng
                  </p>
                </div>

                <a
                  href={company.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#075FA8] dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-500 fill-red-100" />
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex-1 min-h-[350px] sm:min-h-[420px] w-full relative bg-slate-100 dark:bg-slate-800">
                <iframe
                  title="Bản đồ chỉ đường đến Vật Tư Điện Lạnh Đông Kha Đà Nẵng"
                  src={company.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[350px] sm:min-h-[420px]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
