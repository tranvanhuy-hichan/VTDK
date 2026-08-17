"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ZoomIn, X, Camera, Image as ImageIcon } from "lucide-react";
import { COMPANY_DATA } from "../data/company";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 9;

interface DynamicGalleryItem {
  id: string;
  url: string;
  title: string;
  filename: string;
}

export const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<DynamicGalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryItems(data);
        } else {
          // Fallback to static gallery data
          const fallbacks = COMPANY_DATA.gallery.map((g) => ({
            id: g.id,
            url: g.image,
            title: g.title,
            filename: g.id,
          }));
          setGalleryItems(fallbacks);
        }
      })
      .catch(() => {
        const fallbacks = COMPANY_DATA.gallery.map((g) => ({
          id: g.id,
          url: g.image,
          title: g.title,
          filename: g.id,
        }));
        setGalleryItems(fallbacks);
      });
  }, []);

  const [activeImage, setActiveImage] = useState<DynamicGalleryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(galleryItems.length / PAGE_SIZE));
  const pagedItems = galleryItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section id="hinh-anh" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#075FA8] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            HÌNH ẢNH THỰC TẾ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hình ảnh hoạt động tại Đông Kha
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Hình ảnh thực tế cửa hàng, kho bãi và giao hàng tại Đà Nẵng.
          </p>
        </div>

        {/* Gallery Grid (2 cols mobile, 3 cols desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pagedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/3]"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-left">
                <span className="text-[11px] font-extrabold text-[#F47A20] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Đông Kha Đà Nẵng
                </span>
                <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-200 font-medium">
                  <ZoomIn className="w-4 h-4 text-white" />
                  <span>Phóng to xem chi tiết</span>
                </div>
              </div>

              {/* Tag Category top left badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow">
                Đông Kha Photo
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {/* Lightbox Modal */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Top Header */}
              <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#F47A20]" />
                  <span className="font-bold text-sm sm:text-base">{activeImage.title}</span>
                </div>
                <button
                  onClick={() => setActiveImage(null)}
                  aria-label="Đóng lightbox"
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors min-h-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Content */}
              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2">
                <img
                  src={activeImage.url}
                  alt={activeImage.title}
                  className="max-w-full max-h-[70vh] object-contain rounded"
                />
              </div>

              {/* Bottom Caption */}
              <div className="p-4 bg-slate-950 text-left border-t border-slate-800">
                <p className="text-sm text-slate-300 font-medium">
                  {activeImage.title} - Vật Tư Điện Lạnh Đông Kha Đà Nẵng
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
