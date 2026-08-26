"use client";

import React, { useState } from "react";
import type { OrderDetail } from "@/types/order";
import type { CompanyContact } from "@/lib/company";
import { Printer, FileText } from "lucide-react";
import { PrintableQuoteModal, type QuoteItem } from "@/components/quote/PrintableQuoteModal";

interface PrintableOrderSlipProps {
  order: OrderDetail;
  company?: CompanyContact;
  className?: string;
  triggerButton?: React.ReactNode;
}

export const PrintableOrderSlip: React.FC<PrintableOrderSlipProps> = ({
  order,
  company,
  className = "",
  triggerButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const items: QuoteItem[] = order.items.map((item) => ({
    id: item.id,
    name: item.productName,
    variantTitle: item.variantLabel || undefined,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
  }));

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setIsOpen(true)}>{triggerButton}</div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 shadow-xs transition-colors shrink-0 whitespace-nowrap cursor-pointer !min-h-0 ${className}`}
          title="Xem & in phiếu xuất kho kiêm giao hàng"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          <span>In phiếu xuất kho</span>
        </button>
      )}

      {/* Unified Printable Modal in Delivery Mode */}
      <PrintableQuoteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        company={company}
        mode="delivery"
        orderCode={order.orderCode}
        initialCustomerName={order.customerName}
        initialCustomerPhone={order.customerPhone}
        initialCustomerAddress={order.address || undefined}
        initialNote={order.note || undefined}
      />
    </>
  );
};
