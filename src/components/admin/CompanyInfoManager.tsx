"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Loader2, ArrowLeft, Save, ImageIcon } from "lucide-react";
import { updateCompanyInfoAction, logoutAction } from "../../app/admin/actions";
import type { CompanyContact } from "../../lib/company";

interface CompanyInfoManagerProps {
  initialCompany: CompanyContact;
}

const FIELDS: { key: keyof CompanyContact; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "name", label: "Tên công ty", placeholder: "Công ty TNHH Vật Tư Đông Kha" },
  { key: "address", label: "Địa chỉ", placeholder: "400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng" },
  { key: "workingHours", label: "Giờ mở cửa - đóng cửa", placeholder: "07:00 – 18:30 (Tất cả các ngày trong tuần)" },
  { key: "hotline", label: "Hotline hiển thị", placeholder: "0905 487 441" },
  { key: "hotlineRaw", label: "Hotline (số thuần, dùng để gọi)", placeholder: "0905487441" },
  { key: "zaloUrl", label: "Link Zalo", placeholder: "https://zalo.me/0905487441" },
  { key: "whatsAppUrl", label: "Link WhatsApp", placeholder: "https://wa.me/84905487441" },
  { key: "facebookUrl", label: "Link Facebook", placeholder: "https://www.facebook.com/..." },
  { key: "googleMapsUrl", label: "Link Google Maps (chỉ đường)", placeholder: "https://www.google.com/maps/..." },
  { key: "googleMapsEmbed", label: "Link Google Maps nhúng (embed)", placeholder: "https://www.google.com/maps/embed?...", multiline: true },
];

export const CompanyInfoManager: React.FC<CompanyInfoManagerProps> = ({ initialCompany }) => {
  const [form, setForm] = useState<CompanyContact>(initialCompany);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleChange = (key: keyof CompanyContact, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedMessage(null);

    const formData = new FormData();
    FIELDS.forEach(({ key }) => formData.append(key, form[key]));

    const res = await updateCompanyInfoAction(formData);

    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setSavedMessage("Đã lưu thông tin công ty thành công!");
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">ĐÔNG KHA ADMIN</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Thông tin công ty
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/gallery"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Hình ảnh</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm !min-h-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-left">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#075FA8] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại danh sách sản phẩm
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">THÔNG TIN CÔNG TY</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Địa chỉ, số điện thoại, giờ mở cửa và các liên kết liên hệ hiển thị trên toàn bộ trang web.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-5 text-left"
        >
          {FIELDS.map(({ key, label, placeholder, multiline }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {label}
              </label>
              {multiline ? (
                <textarea
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              ) : (
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
                />
              )}
            </div>
          ))}

          {savedMessage && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs sm:text-sm text-emerald-700 font-bold">
              {savedMessage}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold py-3 px-6 rounded-xl text-center text-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 !min-h-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU THÔNG TIN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
