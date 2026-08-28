"use client";

import React, { useRef } from "react";
import { Printer, X, CheckCircle2, Download, QrCode } from "lucide-react";
import { formatCurrency, formatDate } from "../../../lib/format";
import { getBarcodeSvgDataUrl } from "../../../lib/barcode";

export interface PosInvoiceData {
  id: string;
  orderCode: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  subtotal: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  cashReceived?: number;
  cashChange?: number;
  items: {
    productName: string;
    variantLabel?: string | null;
    price: number;
    quantity: number;
    sku?: string | null;
  }[];
  company?: {
    brandName: string;
    fullName: string;
    address: string;
    hotline: string;
    taxCode?: string | null;
    logoUrl?: string;
  };
}

function formatNumber(value: unknown): string {
  const parsed = typeof value === "number" ? value : Number(value);
  return (Number.isFinite(parsed) ? parsed : 0).toLocaleString("vi-VN");
}
interface PosInvoiceModalProps {
  data: PosInvoiceData | null;
  company: PosInvoiceData["company"];
  onClose: () => void;
  onNewOrder: () => void;
}

export const PosInvoiceModal: React.FC<PosInvoiceModalProps> = ({
  data,
  company,
  onClose,
  onNewOrder,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const receiptCompany = data.company || company;

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "VIETQR":
        return "Chuyển khoản VietQR";
      case "CARD":
        return "Quẹt thẻ ngân hàng (POS)";
      case "OTHER":
        return "Hình thức khác";
      default:
        return "Tiền mặt";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Thanh Toán Thành Công!
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Mã đơn: {data.orderCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/60 flex justify-center">
          <div
            ref={receiptRef}
            id="printable-receipt"
            className="bg-white text-slate-900 p-6 rounded-2xl shadow-sm w-full max-w-[340px] text-xs font-sans border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
          >
            {/* Store Header */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                {receiptCompany?.brandName || receiptCompany?.fullName || "Đông Kha"}
              </h2>
              <p className="text-[11px] text-slate-600 leading-tight">
                {receiptCompany?.address || ""}
              </p>
              <p className="text-[11px] font-bold text-slate-700">
                Hotline: {receiptCompany?.hotline || "0905 487 441"}
              </p>
              {receiptCompany?.taxCode && (
                <p className="text-[10px] text-slate-500 font-mono">MST: {receiptCompany.taxCode}</p>
              )}
            </div>

            {/* Receipt Title */}
            <div className="text-center my-3 space-y-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                HÓA ĐƠN BÁN LẺ
              </h3>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Số: {data.orderCode}</span>
                <span>{formatDate(data.createdAt)}</span>
              </div>
              <div className="text-[11px] text-slate-600 text-left pt-1">
                <span>Khách hàng: </span>
                <span className="font-bold text-slate-900">{data.customerName}</span>
                {Boolean(data.customerPhone && data.customerPhone.trim() && !data.customerPhone.startsWith("0900000000") && !data.customerPhone.startsWith("0000000000")) && (
                  <span className="text-slate-500"> ({data.customerPhone})</span>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border-t border-b border-slate-300 py-2 my-2 space-y-2">
              <div className="flex justify-between font-black text-[11px] text-slate-700 uppercase border-b border-slate-200 pb-1">
                <span className="flex-1">Mặt hàng</span>
                <span className="w-8 text-center">SL</span>
                <span className="w-16 text-right">Đ.Giá</span>
                <span className="w-18 text-right">T.Tiền</span>
              </div>

              {data.items.map((item, i) => (
                <div key={i} className="flex justify-between text-[11px] leading-tight">
                  <div className="flex-1 pr-1">
                    <span className="font-bold text-slate-900 block">{item.productName}</span>
                    {item.variantLabel && (
                      <span className="text-[10px] text-slate-500 block">Quy cách: {item.variantLabel}</span>
                    )}
                  </div>
                  <span className="w-8 text-center font-bold text-slate-800">{item.quantity}</span>
                  <span className="w-16 text-right text-slate-600">{formatNumber(item.price)}</span>
                  <span className="w-18 text-right font-black text-slate-900">
                    {formatNumber(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations & Totals */}
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-bold">{formatNumber(data.subtotal)}đ</span>
              </div>

              {data.discountAmount ? (
                <div className="flex justify-between text-red-600">
                  <span>Chiết khấu / Giảm giá:</span>
                  <span className="font-bold">-{formatNumber(data.discountAmount)}đ</span>
                </div>
              ) : null}

              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-dashed border-slate-300">
                <span>TỔNG THANH TOÁN:</span>
                <span className="text-base">{formatNumber(data.totalAmount)}đ</span>
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Hình thức:</span>
                <span className="font-bold">{getPaymentMethodLabel(data.paymentMethod)}</span>
              </div>

              {data.paymentMethod === "CASH" && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Tiền khách đưa:</span>
                    <span>{formatNumber(data.cashReceived ?? data.totalAmount)}đ</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tiền thừa trả khách:</span>
                    <span className="font-bold text-emerald-700">
                      {formatNumber(data.cashChange)}đ
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Barcode & Footer */}
            <div className="text-center pt-4 mt-3 border-t border-dashed border-slate-300 space-y-2">
              <div className="flex justify-center">
                <img
                  src={getBarcodeSvgDataUrl(data.orderCode, 36)}
                  alt="Order Barcode"
                  className="max-h-12 object-contain"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-800">
                Cảm ơn Quý khách &amp; Hẹn gặp lại!
              </p>
              <p className="text-[9px] text-slate-400">
                Hóa đơn kiêm phiếu xuất kho và bảo hành linh kiện
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onNewOrder}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold transition-all cursor-pointer !min-h-0"
          >
            Đơn Hàng Mới (F2)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#075FA8] hover:bg-[#0B1F33] text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer !min-h-0"
            >
              <Printer className="w-4 h-4" />
              <span>In Hóa Đơn (F9)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
