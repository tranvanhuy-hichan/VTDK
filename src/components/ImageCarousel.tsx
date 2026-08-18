"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  // Optimized single-image rendering (No overflow-x wrapper = Smooth vertical page scrolling)
  if (images.length === 1) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className={`object-cover ${imgClassName}`}
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </div>
    );
  }

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  };

  return (
    <div className={`relative group/carousel ${className}`}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar w-full h-full scroll-smooth touch-pan-y"
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative w-full h-full shrink-0 snap-start">
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className={`object-cover ${imgClassName}`}
              priority={priority && i === 0}
              loading={priority && i === 0 ? undefined : "lazy"}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          scrollToIndex(activeIndex - 1);
        }}
        aria-label="Ảnh trước"
        className="!min-h-0 absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-md opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          scrollToIndex(activeIndex + 1);
        }}
        aria-label="Ảnh sau"
        className="!min-h-0 absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-md opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToIndex(i);
            }}
            aria-label={`Xem ảnh ${i + 1}`}
            className={`!min-h-0 h-1.5 rounded-full transition-all cursor-pointer ${
              i === activeIndex ? "w-4 bg-white shadow-xs" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
