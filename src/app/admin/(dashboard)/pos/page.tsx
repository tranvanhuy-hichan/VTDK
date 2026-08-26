import React from "react";
import { prisma } from "../../../../lib/prisma";
import { getCompanyInfo } from "../../../../lib/company";
import { PosTerminal } from "../../../../components/admin/pos/PosTerminal";
import { PosProductItem } from "../../../../actions/posActions";

export const revalidate = 0; // Fresh inventory and products on each load

export default async function AdminPosPage() {
  const [categories, rawProducts, company] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      where: { active: true },
      include: {
        category: { select: { name: true } },
        variants: {
          select: { id: true, label: true, price: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 60,
    }),
    getCompanyInfo(),
  ]);

  const initialProducts: PosProductItem[] = (rawProducts as any[]).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    sku: p.sku || null,
    barcode: p.barcode || null,
    stock: p.stock ?? 100,
    image: p.image || "/images/placeholder.svg",
    categoryName: p.category?.name || "Khác",
    variants: p.variants || [],
  }));

  if (company.enablePosModule === false) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
          🏪
        </div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          Phân Hệ Bán Hàng Tại Quầy (POS) Đang Tắt
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Tính năng bán hàng tại quầy và quét mã vạch đã được quản trị viên tắt trong cấu hình doanh nghiệp.
        </p>
        <div className="pt-2">
          <a
            href="/admin/company"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#075FA8] hover:bg-[#064B85] text-white font-bold text-sm shadow-md transition-all"
          >
            Đến Cài Đặt Doanh Nghiệp Để Bật
          </a>
        </div>
      </div>
    );
  }

  return (
    <PosTerminal
      initialProducts={initialProducts}
      categories={categories}
      company={company}
    />
  );
}
