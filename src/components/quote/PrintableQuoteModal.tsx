"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  User,
  Edit3,
  Loader2,
  Truck,
} from "lucide-react";
import type { CompanyContact } from "../../lib/company";
import { COMPANY_DATA } from "../../data/company";
import { formatCurrency, formatDate } from "../../lib/format";

export interface QuoteItem {
  id: string;
  name: string;
  variantTitle?: string;
  unit?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface PrintableQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  company?: CompanyContact;
  mode?: "quote" | "delivery"; // 'quote' = Báo giá, 'delivery' = Phiếu xuất kho giao hàng
  orderCode?: string;
  initialCustomerName?: string;
  initialCustomerPhone?: string;
  initialCustomerAddress?: string;
  initialCustomerCompany?: string;
  initialCustomerTaxCode?: string;
  initialVatRate?: number;
  initialValidDays?: number;
  initialNote?: string;
  initialShippingFee?: number;
}

// Convert amount in VND to Vietnamese words
export function readVNDInWords(amount: number): string {
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
    } else if (tens === 1) {
      result += "mười ";
    } else if (hundreds > 0 && ones > 0) {
      result += "lẻ ";
    }

    if (tens > 1 && ones === 1) {
      result += "mốt";
    } else if (tens > 0 && ones === 5) {
      result += "lăm";
    } else if (ones > 0) {
      result += defaultNumbers[ones];
    }

    return result.trim();
  };

  let numStr = Math.round(amount).toString();
  const groups: string[] = [];
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

export const PrintableQuoteModal: React.FC<PrintableQuoteModalProps> = ({
  isOpen,
  onClose,
  items,
  company,
  mode = "quote",
  orderCode,
  initialCustomerName = "",
  initialCustomerPhone = "",
  initialCustomerAddress = "",
  initialCustomerCompany = "",
  initialCustomerTaxCode = "",
  initialVatRate = 0,
  initialValidDays = 15,
  initialNote = "",
  initialShippingFee = 0,
}) => {
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  const [customerCompany, setCustomerCompany] = useState(initialCustomerCompany);
  const [customerAddress, setCustomerAddress] = useState(initialCustomerAddress);
  const [customerTaxCode, setCustomerTaxCode] = useState(initialCustomerTaxCode);
  const [documentNote, setDocumentNote] = useState(
    initialNote ||
      (mode === "quote"
        ? "Giá trên đã bao gồm chiết khấu đại lý. Hàng mới 100% chính hãng."
        : "Khách hàng kiểm tra hàng hóa, quy cách và số lượng trước khi nhận hàng.")
  );
  const [vatRate, setVatRate] = useState<number>(initialVatRate);
  const [validDays, setValidDays] = useState<number>(initialValidDays);
  const [shippingFee, setShippingFee] = useState<number>(initialShippingFee);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const comp = company || {
    name: COMPANY_DATA.fullName,
    fullName: COMPANY_DATA.fullName,
    shortName: COMPANY_DATA.shortName,
    brandName: COMPANY_DATA.brandName,
    tagline: COMPANY_DATA.tagline,
    address: COMPANY_DATA.address,
    hotline: COMPANY_DATA.hotline,
    taxCode: COMPANY_DATA.taxCode,
    email: COMPANY_DATA.email,
    logoUrl: COMPANY_DATA.logoUrl,
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatAmount = Math.round(subtotal * (vatRate / 100));
  const totalAmount = subtotal + vatAmount + (mode === "delivery" ? shippingFee : 0);

  const today = new Date();
  const documentNumber =
    orderCode ||
    (mode === "quote"
      ? `BG-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`
      : `XK-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`);

  // HTML content generator for printing / PDF export
  const generateFullHTMLBody = (): string => {
    const isDelivery = mode === "delivery";
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const hasVat = vatRate > 0;

    const itemsRows = items
      .map((item, idx) => {
        const lineTotal = item.price * item.quantity;
        return `
          <tr>
            <td style="border:1px solid #9ca3af;padding:6px 8px;text-align:center;font-weight:700;font-family:monospace;">${idx + 1}</td>
            <td style="border:1px solid #9ca3af;padding:6px 8px;">
              <div style="font-weight:700;color:#111;">${item.name}</div>
              ${item.variantTitle ? `<div style="font-size:10px;color:#555;margin-top:2px;">Quy cách: ${item.variantTitle}</div>` : ""}
            </td>
            <td style="border:1px solid #9ca3af;padding:6px 8px;text-align:center;color:#4b5563;">${item.unit || "Cái/Cuộn"}</td>
            <td style="border:1px solid #9ca3af;padding:6px 8px;text-align:center;font-weight:700;font-family:monospace;color:#111;">${item.quantity}</td>
            <td style="border:1px solid #9ca3af;padding:6px 8px;text-align:right;font-family:monospace;color:#374151;">${formatCurrency(item.price)}</td>
            ${hasVat ? `<td style="border:1px solid #9ca3af;padding:6px 8px;text-align:center;font-family:monospace;font-weight:700;color:#075FA8;">${vatRate}%</td>` : ""}
            <td style="border:1px solid #9ca3af;padding:6px 8px;text-align:right;font-family:monospace;font-weight:700;color:#111;">${formatCurrency(lineTotal)}</td>
          </tr>
        `;
      })
      .join("");

    const colSpanTotal = hasVat ? 6 : 5;

    if (isDelivery) {
      // 100% Exact original Phiếu Xuất Kho Kiêm Giao Hàng format
      return `
        <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#111827;line-height:1.45;font-size:11.5px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111827;padding-bottom:12px;margin-bottom:14px;gap:16px;">
            <div style="display:flex;align-items:center;gap:12px;flex:1;">
              ${comp.logoUrl ? `<img src="${comp.logoUrl}" alt="Logo" style="height:72px;max-width:160px;object-fit:contain;" />` : `<div style="padding:8px 12px;background:#075FA8;color:#fff;font-weight:800;border-radius:6px;font-size:13px;">${comp.shortName || "LOGO"}</div>`}
              <div style="font-size:11px;color:#374151;line-height:1.4;">
                <h2 style="font-size:14px;font-weight:800;text-transform:uppercase;color:#000;margin:0 0 2px 0;">${comp.fullName || comp.name}</h2>
                <div><strong>Địa chỉ: </strong>${comp.address}</div>
                <div style="margin-top:3px;">
                  <span>Hotline: <strong>${comp.hotline}</strong></span>
                  ${comp.taxCode ? `&nbsp;&nbsp;&nbsp;&nbsp;<span>MST: <strong>${comp.taxCode}</strong></span>` : ""}
                  ${comp.email ? `<div style="margin-top:2px;">Email: <strong>${comp.email}</strong></div>` : ""}
                </div>
              </div>
            </div>
            <div style="text-align:center;border:2px solid #111827;border-radius:8px;padding:6px 12px;background:#f9fafb;min-width:140px;flex-shrink:0;">
              <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">MÃ ĐƠN HÀNG</div>
              <div style="font-size:15px;font-weight:800;font-family:monospace;color:#000;margin-top:2px;">${documentNumber}</div>
            </div>
          </div>

          <!-- Title -->
          <div style="text-align:center;margin:12px 0 16px 0;">
            <h1 style="font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#000;margin:0 0 3px 0;">PHIẾU XUẤT KHO KIÊM GIAO HÀNG</h1>
            <p style="font-size:11px;color:#4b5563;margin:0;">
              Thời gian lập phiếu: <strong style="color:#000;font-family:monospace;">${hours}:${minutes}</strong> • Ngày <strong>${day}/${month}/${year}</strong>
            </p>
          </div>

          <!-- Customer Info -->
          <div style="border:1px solid #d1d5db;border-radius:8px;padding:10px 14px;margin-bottom:14px;background:#f9fafb;font-size:11.5px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">
              <div><strong>Khách hàng: </strong><span style="font-weight:700;text-transform:uppercase;">${customerName || "Khách hàng"}</span></div>
              <div><strong>Điện thoại: </strong><span style="font-weight:700;font-family:monospace;">${customerPhone || "Theo yêu cầu"}</span></div>
              <div><strong>Hình thức nhận: </strong><span>${customerAddress ? "Giao hàng tận nơi" : "Lấy tại kho cửa hàng"}</span></div>
              <div><strong>Địa chỉ giao: </strong><span>${customerAddress || `Nhận tại kho ${comp.shortName || comp.brandName || "Đông Kha"}`}</span></div>
              ${customerTaxCode ? `<div><strong>MST Khách: </strong><span style="font-family:monospace;font-weight:700;">${customerTaxCode}</span></div>` : ""}
            </div>
            ${documentNote ? `<div style="margin-top:5px;"><strong>Ghi chú đơn hàng: </strong><em>${documentNote}</em></div>` : ""}
          </div>

          <!-- Table -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:11.5px;">
            <thead>
              <tr style="background:#f3f4f6;font-weight:700;text-align:center;">
                <th style="width:35px;border:1px solid #9ca3af;padding:6px 8px;">STT</th>
                <th style="text-align:left;border:1px solid #9ca3af;padding:6px 8px;">Tên sản phẩm &amp; Quy cách vật tư</th>
                <th style="width:65px;border:1px solid #9ca3af;padding:6px 8px;">ĐVT</th>
                <th style="width:55px;border:1px solid #9ca3af;padding:6px 8px;">Số lượng</th>
                <th style="width:105px;text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Đơn giá</th>
                ${hasVat ? `<th style="width:65px;border:1px solid #9ca3af;padding:6px 8px;text-align:center;">Thuế VAT</th>` : ""}
                <th style="width:120px;text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr style="background:#f9fafb;font-weight:700;">
                <td colspan="${colSpanTotal}" style="text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Cộng tiền hàng (Tạm tính):</td>
                <td style="text-align:right;font-size:12px;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;font-weight:700;">${formatCurrency(subtotal)}</td>
              </tr>
              <tr style="background:#f9fafb;font-weight:700;">
                <td colspan="${colSpanTotal}" style="text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Phí vận chuyển:</td>
                <td style="text-align:right;font-size:12px;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;font-weight:700;">${formatCurrency(shippingFee)}</td>
              </tr>
              ${
                hasVat
                  ? `
                    <tr style="background:#f9fafb;font-weight:700;">
                      <td colspan="${colSpanTotal}" style="text-align:right;border:1px solid #9ca3af;padding:6px 8px;">Tiền thuế GTGT / VAT (${vatRate}%):</td>
                      <td style="text-align:right;font-size:12px;font-family:monospace;border:1px solid #9ca3af;padding:6px 8px;color:#075FA8;font-weight:700;">+${formatCurrency(vatAmount)}</td>
                    </tr>
                    <tr style="background:#eff6ff;font-weight:900;">
                      <td colspan="${colSpanTotal}" style="text-align:right;text-transform:uppercase;border:1px solid #9ca3af;padding:8px;color:#075FA8;">Tổng cộng tiền thanh toán (Đã gồm VAT &amp; Phí ship):</td>
                      <td style="text-align:right;font-size:13px;font-family:monospace;border:1px solid #9ca3af;padding:8px;font-weight:900;color:#dc2626;">${formatCurrency(totalAmount)}</td>
                    </tr>
                  `
                  : `
                    <tr style="background:#f9fafb;font-weight:800;">
                      <td colspan="${colSpanTotal}" style="text-align:right;text-transform:uppercase;border:1px solid #9ca3af;padding:8px;">Tổng cộng tiền thanh toán:</td>
                      <td style="text-align:right;font-size:13px;font-family:monospace;border:1px solid #9ca3af;padding:8px;font-weight:800;">${formatCurrency(totalAmount)}</td>
                    </tr>
                  `
              }
            </tfoot>
          </table>

          <!-- Amount in words -->
          <div style="font-size:11.5px;margin-bottom:20px;line-height:1.5;">
            <div><strong>Số tiền bằng chữ: </strong><em>${readVNDInWords(totalAmount)}</em></div>
            <div style="color:#4b5563;margin-top:2px;"><strong>Hình thức thanh toán: </strong>Thanh toán tiền mặt hoặc chuyển khoản khi nhận đủ hàng &amp; kiểm tra đúng quy cách.</div>
          </div>

          <!-- Signatures (4 columns) -->
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
        </div>
      `;
    }

    // Standard B2B Quotation format
    return `
      <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#0f172a;line-height:1.45;font-size:11.5px;">
        <!-- 1. Header: Company Info & Logo -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #075FA8;padding-bottom:12px;margin-bottom:12px;gap:16px;">
          <div style="max-width:68%;">
            <h1 style="font-size:15px;font-weight:900;text-transform:uppercase;color:#075FA8;margin:0 0 3px 0;">
              ${comp.fullName || comp.name}
            </h1>
            <p style="font-size:10.5px;color:#475569;font-weight:600;margin:0 0 4px 0;">
              ${comp.tagline || "Đại lý phân phối vật tư điện lạnh & thiết bị kỹ thuật chính hãng"}
            </p>
            <div style="font-size:10.5px;color:#475569;line-height:1.4;">
              <div><strong>Địa chỉ:</strong> ${comp.address}</div>
              <div><strong>Hotline / Zalo:</strong> ${comp.hotline} ${comp.email ? `&nbsp;•&nbsp;<strong>Email:</strong> ${comp.email}` : ""}</div>
              ${comp.taxCode ? `<div><strong>Mã số thuế:</strong> ${comp.taxCode}</div>` : ""}
            </div>
          </div>

          <div style="text-align:right;flex-shrink:0;">
            ${
              comp.logoUrl
                ? `<img src="${comp.logoUrl}" alt="Logo" style="height:76px;max-width:180px;object-fit:contain;" />`
                : `<div style="padding:10px 14px;background:#075FA8;color:#fff;font-weight:900;border-radius:8px;font-size:12px;">${comp.shortName || "LOGO"}</div>`
            }
          </div>
        </div>

        <!-- 2. Document Title -->
        <div style="text-align:center;margin:12px 0 14px 0;">
          <h2 style="font-size:17px;font-weight:900;text-transform:uppercase;color:#0f172a;letter-spacing:0.5px;margin:0 0 3px 0;">
            BẢNG BÁO GIÁ SẢN PHẨM
          </h2>
          <div style="font-size:10.5px;color:#64748b;">
            Mã báo giá: <strong>${documentNumber}</strong> • Ngày lập: <strong>${formatDate(today.toISOString())}</strong> • Hiệu lực: <strong>${validDays} ngày</strong>
          </div>
        </div>

        <!-- 3. Customer Info Box -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:11px;line-height:1.5;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;">
            <div><strong>Khách hàng / Đơn vị:</strong> <span style="font-weight:700;text-transform:uppercase;">${customerName || customerCompany || "Quý khách hàng / Đối tác"}</span></div>
            <div><strong>Điện thoại:</strong> <span style="font-weight:700;font-family:monospace;">${customerPhone || "Theo yêu cầu"}</span></div>
            ${customerCompany ? `<div><strong>Công ty:</strong> ${customerCompany}</div>` : ""}
            ${customerAddress ? `<div><strong>Địa chỉ:</strong> ${customerAddress}</div>` : ""}
            ${customerTaxCode ? `<div><strong>MST Khách:</strong> <span style="font-family:monospace;">${customerTaxCode}</span></div>` : ""}
          </div>
        </div>

        <!-- 4. Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:11px;">
          <thead>
            <tr style="background:#075FA8;color:#ffffff;text-align:center;font-weight:700;">
              <th style="border:1px solid #cbd5e1;padding:6px 8px;width:35px;">STT</th>
              <th style="border:1px solid #cbd5e1;padding:6px 8px;text-align:left;">Tên Sản Phẩm &amp; Quy Cách</th>
              <th style="border:1px solid #cbd5e1;padding:6px 8px;width:55px;">ĐVT</th>
              <th style="border:1px solid #cbd5e1;padding:6px 8px;width:50px;">SL</th>
              <th style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;width:105px;">Đơn Giá</th>
              ${hasVat ? `<th style="border:1px solid #cbd5e1;padding:6px 8px;text-align:center;width:65px;">Thuế VAT</th>` : ""}
              <th style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;width:115px;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr style="background:#f8fafc;font-weight:700;">
              <td colspan="${colSpanTotal}" style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;">Tổng tiền hàng (Tạm tính):</td>
              <td style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;font-family:monospace;font-weight:700;">${formatCurrency(subtotal)}</td>
            </tr>
            ${
              hasVat
                ? `<tr style="background:#f8fafc;font-weight:700;">
                    <td colspan="${colSpanTotal}" style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;">Thuế GTGT / VAT (${vatRate}%):</td>
                    <td style="border:1px solid #cbd5e1;padding:6px 8px;text-align:right;font-family:monospace;color:#075FA8;font-weight:700;">+${formatCurrency(vatAmount)}</td>
                  </tr>`
                : ""
            }
            <tr style="background:#eff6ff;font-weight:900;font-size:12px;">
              <td colspan="${colSpanTotal}" style="border:1px solid #cbd5e1;padding:8px;text-align:right;text-transform:uppercase;color:#075FA8;">Tổng Cộng Thanh Toán${hasVat ? " (Đã gồm VAT)" : ""}:</td>
              <td style="border:1px solid #cbd5e1;padding:8px;text-align:right;font-family:monospace;color:#dc2626;font-size:13px;">${formatCurrency(totalAmount)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- 5. Amount in words -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;margin-bottom:12px;font-size:11px;">
          <strong>Số tiền viết bằng chữ:</strong> <em style="font-weight:700;color:#0f172a;">${readVNDInWords(totalAmount)}</em>
        </div>

        <!-- 6. Terms / Notes -->
        <div style="font-size:10.5px;color:#475569;line-height:1.45;margin-bottom:20px;border-top:1px solid #e2e8f0;padding-top:8px;">
          <div style="font-weight:700;color:#0f172a;margin-bottom:3px;">ĐIỀU KHOẢN &amp; GHI CHÚ:</div>
          <div>• <strong>Bảo hành:</strong> 100% hàng chính hãng, đầy đủ chứng chỉ tiêu chuẩn và bảo hành nhà sản xuất.</div>
          <div>• <strong>Giao hàng:</strong> Hỗ trợ giao tận nơi / chành xe công trình toàn quốc.</div>
          <div>• <strong>Thanh toán:</strong> Tiền mặt hoặc chuyển khoản theo thỏa thuận khi nhận đủ hàng hóa.</div>
          ${documentNote ? `<div>• <strong>Ghi chú:</strong> ${documentNote}</div>` : ""}
        </div>

        <!-- 7. Signatures -->
        <div style="display:grid;grid-template-columns:1fr 1fr;text-align:center;font-size:11px;margin-top:20px;">
          <div>
            <div style="font-weight:800;text-transform:uppercase;color:#0f172a;">ĐẠI DIỆN KHÁCH HÀNG</div>
            <div style="font-size:9.5px;color:#94a3b8;font-style:italic;">(Ký, ghi rõ họ tên)</div>
            <div style="height:60px;"></div>
          </div>
          <div>
            <div style="font-weight:800;text-transform:uppercase;color:#075FA8;">ĐẠI DIỆN ${comp.shortName || comp.brandName || "DOANH NGHIỆP"}</div>
            <div style="font-size:9.5px;color:#94a3b8;font-style:italic;">(Ký, đóng dấu &amp; ghi rõ họ tên)</div>
            <div style="height:60px;"></div>
          </div>
        </div>

        <!-- 8. Footer note -->
        <div style="border-top:1px solid #f1f5f9;padding-top:6px;margin-top:14px;text-align:center;font-size:9.5px;color:#94a3b8;">
          Cảm ơn quý khách đã tin tưởng và đồng hành cùng ${comp.brandName || comp.shortName || "chúng tôi"}!
        </div>
      </div>
    `;
  };

  // Button Action 1: In trực tiếp qua Isolated Hidden Iframe
  const handleDirectPrint = () => {
    const bodyHtml = generateFullHTMLBody();
    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${mode === "delivery" ? `Phieu-xuat-kho-${documentNumber}` : `Bao-gia-${documentNumber}`}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background: #fff; line-height: 1.45; padding: 6px; width: 100%; max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  ${bodyHtml}
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

  // Button Action 2: Tải thẳng file PDF kích thước A4 chuẩn bằng jsPDF & html2canvas
  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "794px"; // Standard A4 width in pixels at 96 DPI
      container.style.padding = "28px 34px";
      container.style.backgroundColor = "#ffffff";
      container.style.color = "#0f172a";
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

      const filename =
        mode === "delivery"
          ? `Phieu-xuat-kho-${documentNumber}.pdf`
          : `Bao-gia-${documentNumber}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Có lỗi khi tạo file PDF, vui lòng thử lại bằng nút In.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-hidden print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* TOP MODAL ACTION BAR - RESPONSIVE */}
        <div className="p-2.5 sm:p-4 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 print:hidden shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-950 text-[#075FA8] dark:text-blue-400 flex items-center justify-center shrink-0">
                {mode === "delivery" ? <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  {mode === "delivery" ? "Phiếu Xuất Kho Kiêm Giao Hàng" : "Bảng Báo Giá Doanh Nghiệp (A4)"}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  {mode === "delivery"
                    ? "Xuất phiếu xuất kho chuẩn A4 để in hoặc lưu file PDF"
                    : "Xuất file báo giá chuẩn A4 để in hoặc gửi khách hàng / đối tác"}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer sm:hidden shrink-0"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {/* 1. Quick Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] sm:text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-1 cursor-pointer !min-h-0"
            >
              <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>{isEditingInfo ? "Xem bản in" : "Sửa thông tin"}</span>
            </button>

            {/* 2. SEPARATE BUTTON: IN TRỰC TIẾP */}
            <button
              type="button"
              onClick={handleDirectPrint}
              className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-[11px] sm:text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer !min-h-0 active:scale-95"
              title="In trực tiếp ra máy in chuẩn A4"
            >
              <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#075FA8] dark:text-blue-400" />
              <span>In (A4)</span>
            </button>

            {/* 3. SEPARATE BUTTON: TẢI FILE PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-[#075FA8] hover:bg-[#0B3D66] text-white text-[11px] sm:text-xs font-black shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer !min-h-0 active:scale-95 disabled:opacity-50"
              title="Tải thẳng file PDF về máy"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Tải PDF</span>
                </>
              )}
            </button>

            {/* Desktop Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 items-center justify-center cursor-pointer ml-1 !min-h-0"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CUSTOMER INFORMATION QUICK EDIT FORM (Hidden on Print) */}
        {isEditingInfo && (
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 space-y-3 print:hidden text-xs">
            <div className="font-black text-[#075FA8] dark:text-blue-300 uppercase tracking-wide text-[11px]">
              Tùy Chỉnh Thông Tin Phiếu:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Tên Khách Hàng / Đại diện:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Công Ty / Đơn Vị Mua Hàng:
                </label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  placeholder="Công ty TNHH Xây Dựng ABC"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Số Điện Thoại:
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0905.xxx.xxx"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Địa Chỉ Giao Hàng / Công Trình:
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Số 123 Đường ABC, Quận..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Mã Số Thuế Khách Hàng (nếu có):
                </label>
                <input
                  type="text"
                  value={customerTaxCode}
                  onChange={(e) => setCustomerTaxCode(e.target.value)}
                  placeholder="0400xxxxxx"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Thuế VAT (%):
                  </label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-bold"
                  >
                    <option value={0}>0% (Không VAT)</option>
                    <option value={8}>8% (VAT 8%)</option>
                    <option value={10}>10% (VAT 10%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Hiệu Lực (Ngày):
                  </label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Ghi Chú Trên Phiếu:
                </label>
                <input
                  type="text"
                  value={documentNote}
                  onChange={(e) => setDocumentNote(e.target.value)}
                  placeholder="Ghi chú thêm..."
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE A4 DOCUMENT CANVAS WRAPPER */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-6 print:p-0 print:bg-white print:overflow-visible">
          {/* Mobile swipe helper tip */}
          <div className="sm:hidden mb-2 text-center text-[11px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 py-1 px-3 rounded-lg border border-blue-200 dark:border-blue-900/50 flex items-center justify-center gap-1.5 font-medium print:hidden">
            <span>↔</span>
            <span>Vuốt ngang để xem đầy đủ bảng A4</span>
          </div>

          <div
            ref={printAreaRef}
            id="printable-quotation"
            className="w-full min-w-[560px] max-w-4xl mx-auto bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200/80 p-4 sm:p-8 space-y-5 print:p-0 print:shadow-none print:border-none print:min-w-0 print:rounded-none font-sans text-xs"
          >
            {mode === "delivery" ? (
              /* 100% Exact original Phiếu Xuất Kho Kiêm Giao Hàng on-screen view */
              <>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b-2 border-slate-900 pb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {comp.logoUrl ? (
                      <img
                        src={comp.logoUrl}
                        alt="Logo"
                        className="h-14 sm:h-16 w-auto max-w-[160px] object-contain shrink-0"
                      />
                    ) : (
                      <div className="p-2 sm:px-3 sm:py-1.5 bg-[#075FA8] text-white font-black rounded-lg text-xs shrink-0">
                        {comp.shortName || "LOGO"}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-700 space-y-0.5 min-w-0">
                      <h1 className="text-xs sm:text-sm font-black uppercase text-slate-900">
                        {comp.fullName || comp.name}
                      </h1>
                      <div className="truncate">
                        <strong>Địa chỉ: </strong>{comp.address}
                      </div>
                      <div className="flex flex-wrap gap-x-4">
                        <span>Hotline: <strong>{comp.hotline}</strong></span>
                        {comp.taxCode && <span>MST: <strong>{comp.taxCode}</strong></span>}
                        {comp.email && <span>Email: <strong>{comp.email}</strong></span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-center border-2 border-slate-900 rounded-lg p-1.5 bg-slate-50 min-w-[120px] shrink-0">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">MÃ ĐƠN HÀNG</div>
                    <div className="text-sm font-black font-mono text-slate-900 mt-0.5">{documentNumber}</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-0.5 py-1">
                  <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-slate-900">
                    PHIẾU XUẤT KHO KIÊM GIAO HÀNG
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Thời gian lập phiếu: <strong className="text-slate-800 font-mono">{String(today.getHours()).padStart(2, "0")}:{String(today.getMinutes()).padStart(2, "0")}</strong> • Ngày <strong>{formatDate(today.toISOString())}</strong>
                  </p>
                </div>

                {/* Customer Info Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-300 text-[11px] grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <strong>Khách hàng: </strong>
                    <span className="font-bold uppercase text-slate-900">{customerName || "Khách hàng"}</span>
                  </div>
                  <div>
                    <strong>Điện thoại: </strong>
                    <span className="font-bold font-mono text-slate-900">{customerPhone || "Theo yêu cầu"}</span>
                  </div>
                  <div>
                    <strong>Hình thức nhận: </strong>
                    <span>{customerAddress ? "Giao hàng tận nơi" : "Lấy tại kho cửa hàng"}</span>
                  </div>
                  <div>
                    <strong>Địa chỉ giao: </strong>
                    <span className="truncate block">{customerAddress || `Nhận tại kho ${comp.shortName || comp.brandName || "Đông Kha"}`}</span>
                  </div>
                  {customerTaxCode && (
                    <div>
                      <strong>MST Khách: </strong>
                      <span className="font-mono font-bold">{customerTaxCode}</span>
                    </div>
                  )}
                  {documentNote && (
                    <div className="col-span-2 text-amber-900 bg-amber-50/80 p-1.5 rounded-md mt-0.5">
                      <strong>Ghi chú đơn hàng: </strong><em>{documentNote}</em>
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-2 w-8">STT</th>
                        <th className="border border-slate-300 p-2 text-left min-w-[160px]">Tên sản phẩm &amp; Quy cách vật tư</th>
                        <th className="border border-slate-300 p-2 w-14 text-center">ĐVT</th>
                        <th className="border border-slate-300 p-2 w-12 text-center">Số lượng</th>
                        <th className="border border-slate-300 p-2 text-right w-24 whitespace-nowrap">Đơn giá</th>
                        {vatRate > 0 && (
                          <th className="border border-slate-300 p-2 text-center w-16 text-[#075FA8] whitespace-nowrap">Thuế VAT</th>
                        )}
                        <th className="border border-slate-300 p-2 text-right w-28 whitespace-nowrap">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 text-center font-mono font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2">
                            <div className="font-bold text-slate-900">{item.name}</div>
                            {item.variantTitle && (
                              <div className="text-[10px] text-slate-500">Quy cách: {item.variantTitle}</div>
                            )}
                          </td>
                          <td className="border border-slate-300 p-2 text-center text-slate-600">{item.unit || "Cái/Cuộn"}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold font-mono">{item.quantity}</td>
                          <td className="border border-slate-300 p-2 text-right font-mono whitespace-nowrap">{formatCurrency(item.price)}</td>
                          {vatRate > 0 && (
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-[#075FA8]">
                              {vatRate}%
                            </td>
                          )}
                          <td className="border border-slate-300 p-2 text-right font-mono font-bold whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {vatRate > 0 ? (
                        <>
                          <tr className="bg-slate-50 font-bold">
                            <td colSpan={6} className="border border-slate-300 p-2 text-right">
                              Cộng tiền hàng (Tạm tính):
                            </td>
                            <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                              {formatCurrency(subtotal)}
                            </td>
                          </tr>
                          <tr className="bg-slate-50 font-bold">
                            <td colSpan={6} className="border border-slate-300 p-2 text-right text-slate-700">
                              Tiền thuế GTGT / VAT ({vatRate}%):
                            </td>
                            <td className="border border-slate-300 p-2 text-right font-mono font-bold text-[#075FA8] whitespace-nowrap">
                              +{formatCurrency(vatAmount)}
                            </td>
                          </tr>
                          <tr className="bg-blue-50/80 font-black text-xs">
                            <td colSpan={6} className="border border-slate-300 p-2 text-right uppercase text-[#075FA8]">
                              Tổng cộng tiền thanh toán (Đã gồm VAT):
                            </td>
                            <td className="border border-slate-300 p-2 text-right font-mono font-black text-red-600 whitespace-nowrap">
                              {formatCurrency(totalAmount)}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={5} className="border border-slate-300 p-2 text-right uppercase">
                            Tổng cộng tiền thanh toán:
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-mono font-black text-xs text-slate-900 whitespace-nowrap">
                            {formatCurrency(totalAmount)}
                          </td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>

                {/* Amount in Words */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                  <div>
                    <strong>Số tiền bằng chữ: </strong>
                    <em className="text-slate-900 font-bold">{readVNDInWords(totalAmount)}</em>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    <strong>Hình thức thanh toán: </strong>Thanh toán tiền mặt hoặc chuyển khoản khi nhận đủ hàng &amp; kiểm tra đúng quy cách.
                  </div>
                </div>

                {/* Signatures (4 columns) */}
                <div className="grid grid-cols-4 gap-2 pt-4 text-center text-xs">
                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-slate-900 text-[10.5px]">Người lập phiếu</div>
                      <div className="text-[9px] text-slate-400 italic">(Ký &amp; họ tên)</div>
                    </div>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-slate-900 text-[10.5px]">Thủ kho xuất</div>
                      <div className="text-[9px] text-slate-400 italic">(Ký &amp; họ tên)</div>
                    </div>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-slate-900 text-[10.5px]">Người giao hàng</div>
                      <div className="text-[9px] text-slate-400 italic">(Ký &amp; họ tên)</div>
                    </div>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-slate-900 text-[10.5px]">Người nhận hàng</div>
                      <div className="text-[9px] text-slate-400 italic">(Ký &amp; họ tên)</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-2 text-center text-[10px] text-slate-500">
                  Cảm ơn quý khách đã tin tưởng và ủng hộ {comp.brandName || "chúng tôi"}! Quý khách vui lòng kiểm tra kỹ số lượng và quy cách hàng hóa trước khi ký nhận.
                </div>
              </>
            ) : (
              /* Standard B2B Quotation Layout */
              <>
                {/* 1. Header: Brand & Company Details */}
                <div className="flex items-start justify-between gap-4 border-b-2 border-[#075FA8] pb-3">
                  <div className="space-y-0.5 max-w-[68%]">
                    <h1 className="text-xs sm:text-sm font-black tracking-tight text-[#075FA8] uppercase">
                      {comp.fullName || comp.name}
                    </h1>
                    <p className="text-[10px] text-slate-600 font-bold">
                      {comp.tagline || "Đại lý phân phối vật tư điện lạnh & thiết bị kỹ thuật chính hãng"}
                    </p>
                    <div className="space-y-0.5 text-[10px] text-slate-600 pt-0.5">
                      <div className="truncate">
                        <span className="font-bold">Địa chỉ:</span> {comp.address}
                      </div>
                      <div className="flex flex-wrap gap-x-3">
                        <span><span className="font-bold">Hotline:</span> {comp.hotline}</span>
                        {comp.email && <span><span className="font-bold">Email:</span> {comp.email}</span>}
                      </div>
                      {comp.taxCode && (
                        <div>
                          <span className="font-bold">Mã số thuế:</span> {comp.taxCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="shrink-0 text-right">
                    {comp.logoUrl ? (
                      <img
                        src={comp.logoUrl}
                        alt="Company Logo"
                        className="h-16 sm:h-20 w-auto max-w-[180px] object-contain ml-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#075FA8] text-white font-black flex items-center justify-center text-xs shadow-xs ml-auto">
                        {comp.shortName || "LOGO"}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Document Title & Meta */}
                <div className="text-center space-y-0.5 py-1">
                  <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-slate-900">
                    BẢNG BÁO GIÁ SẢN PHẨM
                  </h2>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-bold">
                    <span>Mã báo giá: <strong className="text-slate-800 font-mono">{documentNumber}</strong></span>
                    <span>•</span>
                    <span>Ngày lập: <strong className="text-slate-800">{formatDate(today.toISOString())}</strong></span>
                    <span>•</span>
                    <span>Hiệu lực: <strong className="text-slate-800">{validDays} ngày</strong></span>
                  </div>
                </div>

                {/* 3. Customer Info Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] grid grid-cols-2 gap-x-4 gap-y-1.5 print:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-600">Khách hàng / Đơn vị:</span>{" "}
                    <strong className="text-slate-900 uppercase">
                      {customerName || customerCompany || "Quý khách hàng / Đối tác"}
                    </strong>
                  </div>

                  <div>
                    <span className="font-bold text-slate-600">Điện thoại liên hệ:</span>{" "}
                    <strong className="text-slate-900">{customerPhone || "Theo yêu cầu"}</strong>
                  </div>

                  {customerCompany && (
                    <div>
                      <span className="font-bold text-slate-600">Đơn vị / Công ty:</span>{" "}
                      <span className="text-slate-800">{customerCompany}</span>
                    </div>
                  )}

                  {customerAddress && (
                    <div>
                      <span className="font-bold text-slate-600">Địa chỉ giao:</span>{" "}
                      <span className="text-slate-800 truncate block">{customerAddress}</span>
                    </div>
                  )}

                  {customerTaxCode && (
                    <div>
                      <span className="font-bold text-slate-600">Mã số thuế:</span>{" "}
                      <span className="text-slate-800 font-mono">{customerTaxCode}</span>
                    </div>
                  )}
                </div>

                {/* 4. Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                    <thead>
                      <tr className="bg-[#075FA8] text-white print:bg-[#075FA8] print:text-white">
                        <th className="border border-slate-300 p-2 text-center w-8 font-bold">STT</th>
                        <th className="border border-slate-300 p-2 font-bold min-w-[160px]">Tên Sản Phẩm &amp; Quy Cách</th>
                        <th className="border border-slate-300 p-2 text-center w-14 font-bold">ĐVT</th>
                        <th className="border border-slate-300 p-2 text-center w-12 font-bold">SL</th>
                        <th className="border border-slate-300 p-2 text-right w-24 font-bold whitespace-nowrap">Đơn Giá</th>
                        {vatRate > 0 && (
                          <th className="border border-slate-300 p-2 text-center w-16 font-bold whitespace-nowrap">Thuế VAT</th>
                        )}
                        <th className="border border-slate-300 p-2 text-right w-28 font-bold whitespace-nowrap">Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={vatRate > 0 ? 7 : 6} className="p-4 text-center text-slate-400">
                            Chưa có sản phẩm nào trong danh sách.
                          </td>
                        </tr>
                      ) : (
                        items.map((item, idx) => {
                          const lineTotal = item.price * item.quantity;
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/60 even:bg-slate-50/40">
                              <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                              <td className="border border-slate-300 p-2">
                                <div className="font-bold text-slate-900">{item.name}</div>
                                {item.variantTitle && (
                                  <div className="text-[10px] text-slate-500">Quy cách: {item.variantTitle}</div>
                                )}
                              </td>
                              <td className="border border-slate-300 p-2 text-center text-slate-600">
                                {item.unit || "Cái"}
                              </td>
                              <td className="border border-slate-300 p-2 text-center font-bold text-slate-900">
                                {item.quantity}
                              </td>
                              <td className="border border-slate-300 p-2 text-right font-mono text-slate-700 whitespace-nowrap">
                                {formatCurrency(item.price)}
                              </td>
                              {vatRate > 0 && (
                                <td className="border border-slate-300 p-2 text-center font-mono font-bold text-[#075FA8]">
                                  {vatRate}%
                                </td>
                              )}
                              <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                                {formatCurrency(lineTotal)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={vatRate > 0 ? 5 : 4} className="border border-slate-300 p-2 text-right">
                          Tổng tiền hàng (Tạm tính):
                        </td>
                        <td colSpan={2} className="border border-slate-300 p-2 text-right font-mono text-xs whitespace-nowrap">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>

                      {vatRate > 0 && (
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={5} className="border border-slate-300 p-2 text-right">
                            Thuế GTGT / VAT ({vatRate}%):
                          </td>
                          <td colSpan={2} className="border border-slate-300 p-2 text-right font-mono text-xs text-[#075FA8] whitespace-nowrap">
                            +{formatCurrency(vatAmount)}
                          </td>
                        </tr>
                      )}

                      <tr className="bg-blue-50/80 text-slate-900 font-black text-xs">
                        <td colSpan={vatRate > 0 ? 5 : 4} className="border border-slate-300 p-2 text-right uppercase text-[#075FA8]">
                          Tổng Cộng Thanh Toán{vatRate > 0 ? " (Đã gồm VAT)" : ""}:
                        </td>
                        <td colSpan={2} className="border border-slate-300 p-2 text-right font-mono text-red-600 font-black whitespace-nowrap">
                          {formatCurrency(totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 5. Amount in Words */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="font-bold text-slate-700">Số tiền viết bằng chữ:</span>{" "}
                  <em className="text-slate-900 font-bold">{readVNDInWords(totalAmount)}</em>
                </div>

                {/* 6. Terms & Notes */}
                <div className="space-y-0.5 text-[10px] text-slate-600 leading-relaxed border-t border-slate-200 pt-2.5">
                  <div className="font-bold text-slate-800 text-[11px] mb-1">GHI CHÚ &amp; ĐIỀU KHOẢN:</div>
                  <div>• <strong>Bảo hành:</strong> 100% hàng chính hãng, đầy đủ tem mác và phiếu bảo hành tiêu chuẩn nhà sản xuất.</div>
                  <div>• <strong>Giao hàng:</strong> Hỗ trợ giao hàng tận nơi / chành xe công trình toàn quốc.</div>
                  <div>• <strong>Thanh toán:</strong> Tiền mặt hoặc chuyển khoản theo thỏa thuận.</div>
                  {documentNote && <div>• <strong>Ghi chú thêm:</strong> {documentNote}</div>}
                </div>

                {/* 7. Signatures */}
                <div className="grid grid-cols-2 gap-4 pt-4 text-center text-xs">
                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-slate-900 text-[11px]">ĐẠI DIỆN KHÁCH HÀNG</div>
                      <div className="text-[9.5px] text-slate-400 italic">(Ký, ghi rõ họ tên)</div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <div className="font-bold uppercase text-[#075FA8] text-[11px]">
                        ĐẠI DIỆN {comp.shortName || comp.brandName || "DOANH NGHIỆP"}
                      </div>
                      <div className="text-[9.5px] text-slate-400 italic">(Ký, đóng dấu &amp; ghi rõ họ tên)</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
