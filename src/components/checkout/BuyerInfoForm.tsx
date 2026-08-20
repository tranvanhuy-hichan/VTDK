"use client";

import React, { useState } from "react";
import type { BuyerInfo } from "../../lib/zaloMessage";

interface BuyerInfoFormProps {
  onSubmit: (buyer: BuyerInfo) => void;
}

export const BuyerInfoForm: React.FC<BuyerInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress) return;
    onSubmit({ name: trimmedName, phone: trimmedPhone, address: trimmedAddress });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Họ tên</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Số điện thoại</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0905 487 441"
          className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Địa chỉ nhận hàng</label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Số nhà, đường, phường/xã, quận/huyện..."
          className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#075FA8] focus:ring-1 focus:ring-[#075FA8] transition-all"
        />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Thông tin này sẽ được gửi kèm qua Zalo để shop xác nhận đơn và giao hàng cho bạn.
      </p>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98"
      >
        Tiếp tục
      </button>
    </form>
  );
};
