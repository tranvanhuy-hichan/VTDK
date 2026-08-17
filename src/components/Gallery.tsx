"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ZoomIn, X, Camera, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DynamicGalleryItem {
  id: string;
  url: string;
  title: string;
  filename: string;
}

export const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<DynamicGalleryItem[]>([]);
  const [activeImage, setActiveImage] = useState<DynamicGalleryItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGalleryItems(data);
        }
      })
      .catch(() => {});
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (galleryItems.length === 0) return null;

  return (
    <section id="hinh-anh" className="py-12 sm:py-16 bg-white dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Slider Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-[#075FA8] dark:text-blue-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
              HÌNH ẢNH THỰC TẾ
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hình ảnh hoạt động tại Đông Kha
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
              Hình ảnh thực tế cửa hàng, kho bãi và giao hàng tại Đà Nẵng. Vuốt ngang để xem thêm.
            </p>
          </div>

          {/* Slider Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              aria-label="Hình trước"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#075FA8] hover:text-white dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-700 transition-all shadow-xs !min-h-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Hình kế tiếp"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#075FA8] hover:text-white dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-700 transition-all shadow-xs !min-h-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 pt-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="snap-start shrink-0 w-[280px] sm:w-[340px] md:w-[380px] group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/3]"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 380px, 300px"
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
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-850/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow">
                Đông Kha Photo
              </div>
            </div>
          ))}
        </div>

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
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors !min-h-0"
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
