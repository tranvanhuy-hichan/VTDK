"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Wrench,
  CheckCircle2,
  Building2,
  Fan,
  Wind,
  ThermometerSun,
} from "lucide-react";
import { Pagination } from "../product/Pagination";

const PAGE_SIZE = 9; // 3x3 grid for Services

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  images: string[];
  features: string[];
  sortOrder: number;
}

interface ServiceManagerProps {
  initialServices: Service[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Fan,
  Wind,
  ThermometerSun,
};

export const ServiceManager: React.FC<ServiceManagerProps> = ({ initialServices }) => {
  const router = useRouter();
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(initialServices.length / PAGE_SIZE));
  const pagedServices = initialServices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCardClick = (id: string) => {
    setNavigatingId(id);
    router.push(`/admin/services/${id}`);
  };

  return (
    <>
      {/* Top Action Bar */}
      <div className="flex justify-end mb-2.5 text-left">
        <Link
          href="/admin/services/new"
          className="h-8.5 inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-xs px-3.5 rounded-lg shadow-xs transition-all cursor-pointer w-full sm:w-auto !min-h-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Thêm giải pháp mới</span>
        </Link>
      </div>

      {/* Services Grid */}
      {initialServices.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {pagedServices.map((service) => {
              const IconComp = ICON_MAP[service.icon] || ThermometerSun;
              const isNavigating = navigatingId === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => handleCardClick(service.id)}
                  className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all cursor-pointer overflow-hidden flex flex-col group ${
                    isNavigating
                      ? "opacity-60 bg-blue-50/70 dark:bg-slate-800/70 animate-pulse pointer-events-none"
                      : "hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                  }`}
                >
                  <div className="relative aspect-[16/9] bg-slate-50 dark:bg-slate-800">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white p-1.5 rounded-lg backdrop-blur-xs shadow-xs">
                      <IconComp className="w-4 h-4 text-blue-400" />
                    </div>
                    {service.images && service.images.length > 0 && (
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        +{service.images.length} ảnh
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1.5 leading-snug group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3 font-medium">
                      {service.description}
                    </p>
                    {service.features.length > 0 && (
                      <div className="mt-auto space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {service.features.slice(0, 3).map((f, i) => (
                          <div
                            key={i}
                            className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 truncate"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Chưa có giải pháp nào</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Nhấp nút "Thêm giải pháp" ở trên để tạo giải pháp đầu tiên.
          </p>
        </div>
      )}
    </>
  );
};
