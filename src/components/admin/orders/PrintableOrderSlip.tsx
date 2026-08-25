"use client";

import React, { useState, useRef, useEffect } from "react";
import type { OrderDetail } from "@/types/order";
import type { CompanyContact } from "@/lib/company";
import { COMPANY_DATA } from "@/data/company";
import { formatCurrency } from "@/lib/format";
import { Printer, Download, ChevronDown, Loader2 } from "lucide-react";

interface PrintableOrderSlipProps {
  order: OrderDetail;
  company?: CompanyContact;
  className?: string;
  triggerButton?: React.ReactNode;
}

// Convert amount in VND to Vietnamese words
function readVNDInWords(amount: number): string {
  if (!amount || amount <= 0) return "Không đồng";
  const defaultNumbers = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  const readThreeDigits = (n: number, isLastGroup: boolean): string => {
    const hundreds = Math.floor(n / 100);
    const tens = Math.floor((n % 100) / 10);
    const ones = n % 10;
    let result = "";

    if (hundreds > 0 || !isLastGroup) {
      result += defaultNumbers[hundreds] + " trăm ";
    }

    if (tens > 1) {
      result += defaultNumbers[tens] + " mươi ";
      if (ones === 1) result += "mốt ";
      else if (ones === 5) result += "lăm ";
      else if (ones > 0) result += defaultNumbers[ones] + " ";
    } else if (tens === 1) {
      result += "mười ";
      if (ones === 5) result += "lăm ";
      else if (ones > 0) result += defaultNumbers[ones] + " ";
    } else {
      if (hundreds > 0 && ones > 0) result += "lẻ ";
      if (ones > 0) result += defaultNumbers[ones] + " ";
    }
    return result.trim();
  };

  let numStr = Math.round(amount).toString();
  let groups: string[] = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(Math.max(0, numStr.length - 3)));
    numStr = numStr.slice(0, Math.max(0, numStr.length - 3));
  }

  let words = "";
  for (let i = 0; i < groups.length; i++) {
    const groupNum = parseInt(groups[i], 10);
    if (groupNum > 0) {
      const isLastGroup = i === 0;
      const groupWords = readThreeDigits(groupNum, isLastGroup);
      const unit = units[groups.length - 1 - i];
      words += (groupWords + " " + unit + " ").trim() + " ";
    }
  }

  words = words.trim();
  if (!words) return "Không đồng";
  return words.charAt(0).toUpperCase() + words.slice(1) + " đồng chẵn.";
}

export const PrintableOrderSlip: React.FC<PrintableOrderSlipProps> = ({
  order,
  company,
  className = "",
  triggerButton,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const comp = company || {
    fullName: COMPANY_DATA.fullName,
    shortName: COMPANY_DATA.shortName,
    brandName: COMPANY_DATA.brandName,
    address: COMPANY_DATA.address,
    hotline: COMPANY_DATA.hotline,
    taxCode: COMPANY_DATA.taxCode,
    email: COMPANY_DATA.email,
    logoUrl: COMPANY_DATA.logoUrl,
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const generateFullHTMLBody = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const itemsRows = order.items
      .map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        return `
          <tr>
            <td style="text-align:center;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;">${idx + 1}</td>
            <td style="border:1px solid #9ca3af;padding:6px 8px;">
              <div style="font-weight:700;color:#111;">${item.productName}</div>
              ${item.variantLabel ? `<div style="font-size:10px;color:#555;">Quy cách: ${item.variantLabel}</div>` : ""}
            </td>
            <td style="text-align:center;border:1px solid #9ca3af;padding:6px 8px;">Cái/Cuộn</td>
            <td style="text-align:center;font-weight:700;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;">${item.quantity}</td>
            <td style="text-align:right;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;">${formatCurrency(item.price)}</td>
            <td style="text-align:right;font-weight:700;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;">${formatCurrency(itemTotal)}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111827;padding-bottom:12px;margin-bottom:14px;gap:16px;">
        <div style="display:flex;align-items:center;gap:12px;flex:1;">
          <img src="${comp.logoUrl || "/images/logo.png"}" alt="Logo" style="height:60px;max-width:130px;object-fit:contain;" />
          <div style="font-size:11px;color:#374151;line-height:1.4;">
            <h2 style="font-size:14px;font-weight:800;text-transform:uppercase;color:#000;margin-bottom:2px;">${comp.fullName}</h2>
            <p><strong>Địa chỉ: </strong>${comp.address}</p>
            <div style="margin-top:3px;">
              <span>Hotline: <strong>${comp.hotline}</strong></span>
              ${comp.taxCode ? `&nbsp;&nbsp;&nbsp;&nbsp;<span>MST: <strong>${comp.taxCode}</strong></span>` : ""}
              ${comp.email ? `<div style="margin-top:2px;">Email: <strong>${comp.email}</strong></div>` : ""}
            </div>
          </div>
        </div>
        <div style="text-align:center;border:2px solid #111827;border-radius:8px;padding:6px 12px;background:#f9fafb;min-width:140px;flex-shrink:0;">
          <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">MÃ ĐƠN HÀNG</div>
          <div style="font-size:15px;font-weight:800;font-family:monospace;color:#000;margin-top:2px;">${order.orderCode}</div>
        </div>
      </div>

      <!-- Title -->
      <div style="text-align:center;margin:12px 0 16px 0;">
        <h1 style="font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#000;">PHIẾU XUẤT KHO KIÊM GIAO HÀNG</h1>
        <p style="font-size:11px;color:#4b5563;margin-top:3px;">
          Thời gian lập phiếu: <strong style="color:#000;font-family:monospace;">${hours}:${minutes}</strong> • Ngày <strong>${day}/${month}/${year}</strong>
        </p>
      </div>

      <!-- Customer Info -->
      <div style="border:1px solid #d1d5db;border-radius:8px;padding:10px 14px;margin-bottom:14px;background:#f9fafb;font-size:11.5px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">
          <div><strong>Khách hàng: </strong><span style="font-weight:700;text-transform:uppercase;">${order.customerName}</span></div>
          <div><strong>Điện thoại: </strong><span style="font-weight:700;font-family:monospace;">${order.customerPhone}</span></div>
          <div><strong>Hình thức nhận: </strong><span>${order.shippingMethod === "STORE_PICKUP" ? "Lấy tại kho cửa hàng" : "Giao hàng tận nơi"}</span></div>
          <div><strong>Địa chỉ giao: </strong><span>${order.address || "Nhận tại kho Đông Kha"}</span></div>
        </div>
        ${order.note ? `<div style="margin-top:5px;"><strong>Ghi chú đơn hàng: </strong><em>${order.note}</em></div>` : ""}
      </div>

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:11.5px;">
        <thead>
          <tr style="background:#f3f4f6;font-weight:700;text-align:center;">
            <th style="width:35px;border:1px solid #9ca3af;padding:6px 8px;">STT</th>
            <th style="text-align:left;border:1px solid #9ca3af;padding:6px 8px;">Tên sản phẩm &amp; Quy cách vật tư</th>
            <th style="width:65px;border:1px solid #9ca3af;padding:6px 8px;">ĐVT</th>
            <th style="width:60px;border:1px solid #9ca3af;padding:6px 8px;">Số lượng</th>
            <th style="width:110px;text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Đơn giá</th>
            <th style="width:125px;text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
        <tfoot>
          <tr style="background:#f9fafb;font-weight:800;">
            <td colspan="5" style="text-align:right;text-transform:uppercase;border:1px solid #9ca3af;padding:8px;">Tổng cộng tiền thanh toán:</td>
            <td style="text-align:right;font-size:13px;font-family:monospace;border:1px solid #9ca3af;padding:8px;">${formatCurrency(order.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Amount in words -->
      <div style="font-size:11.5px;margin-bottom:20px;line-height:1.5;">
        <div><strong>Số tiền bằng chữ: </strong><em>${readVNDInWords(order.totalAmount)}</em></div>
        <div style="color:#4b5563;margin-top:2px;"><strong>Hình thức thanh toán: </strong>Thanh toán tiền mặt hoặc chuyển khoản khi nhận đủ hàng &amp; kiểm tra đúng quy cách.</div>
      </div>

      <!-- Signatures -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;text-align:center;font-size:11px;margin-top:24px;">
        <div>
          <div style="font-weight:800;text-transform:uppercase;color:#111827;">Người lập phiếu</div>
          <div style="font-size:9.5px;font-style:italic;color:#6b7280;margin-top:1px;">(Ký &amp; ghi rõ họ tên)</div>
          <div style="height:60px;"></div>
        </div>
        <div>
          <div style="font-weight:800;text-transform:uppercase;color:#111827;">Thủ kho xuất</div>
          <div style="font-size:9.5px;font-style:italic;color:#6b7280;margin-top:1px;">(Ký &amp; ghi rõ họ tên)</div>
          <div style="height:60px;"></div>
        </div>
        <div>
          <div style="font-weight:800;text-transform:uppercase;color:#111827;">Người giao hàng</div>
          <div style="font-size:9.5px;font-style:italic;color:#6b7280;margin-top:1px;">(Ký &amp; ghi rõ họ tên)</div>
          <div style="height:60px;"></div>
        </div>
        <div>
          <div style="font-weight:800;text-transform:uppercase;color:#111827;">Người nhận hàng</div>
          <div style="font-size:9.5px;font-style:italic;color:#6b7280;margin-top:1px;">(Ký &amp; ghi rõ họ tên)</div>
          <div style="height:60px;"></div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #e5e7eb;padding-top:8px;margin-top:18px;text-align:center;font-size:10px;color:#6b7280;">
        Cảm ơn quý khách đã tin tưởng và ủng hộ ${comp.brandName || "chúng tôi"}! Quý khách vui lòng kiểm tra kỹ số lượng và quy cách hàng hóa trước khi ký nhận.
      </div>
    `;
  };

  // Option 1: Print directly via an isolated hidden iframe
  const handleDirectPrint = () => {
    setIsMenuOpen(false);
    const bodyContent = generateFullHTMLBody();
    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Donhang-${order.orderCode}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; background: #fff; line-height: 1.45; padding: 10px; width: 100%; max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 300);
    }
  };

  // Option 2: Direct PDF download with Donhang-{orderCode}.pdf filename using jsPDF & html2canvas
  const handleDownloadPdf = async () => {
    setIsMenuOpen(false);
    setIsExportingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "794px"; // Standard A4 width in pixels at 96 DPI
      container.style.padding = "24px 32px";
      container.style.backgroundColor = "#ffffff";
      container.style.color = "#111827";
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      container.innerHTML = generateFullHTMLBody();
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const margin = 10; // 10mm margin
      const contentWidth = pdfWidth - margin * 2; // 190mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
      pdf.save(`Donhang-${order.orderCode}.pdf`);
    } catch (err) {
      console.error("Lỗi tạo file PDF:", err);
      alert("Có lỗi khi tạo file PDF. Vui lòng thử lại!");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Trigger Button */}
      {triggerButton ? (
        <div onClick={() => !isExportingPdf && setIsMenuOpen(!isMenuOpen)}>{triggerButton}</div>
      ) : (
        <button
          type="button"
          disabled={isExportingPdf}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 shadow-xs transition-colors shrink-0 whitespace-nowrap cursor-pointer !min-h-0 ${className}`}
        >
          {isExportingPdf ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : (
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{isExportingPdf ? "Đang xuất PDF..." : "In phiếu"}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}

      {/* Dropdown Menu: 2 Options (In hoặc Tải về PDF trực tiếp) */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-150 text-left">
          <button
            type="button"
            onClick={handleDirectPrint}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer !min-h-0"
          >
            <Printer className="w-4 h-4 text-cyan-500 shrink-0" />
            <div>
              <span className="block font-extrabold text-slate-900 dark:text-white">In ra máy in (Print)</span>
              <span className="block text-[10px] text-slate-400 font-normal">Mở hộp thoại in toàn trang khổ A4</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer !min-h-0"
          >
            <Download className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="block font-extrabold text-slate-900 dark:text-white">Tải về file PDF</span>
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-mono truncate max-w-[160px] font-bold">
                Donhang-{order.orderCode}.pdf
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
