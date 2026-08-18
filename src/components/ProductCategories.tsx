import React, { useState } from "react";
import { 
  Pipette, 
  Flame, 
  Wind, 
  Refrigerator, 
  Disc, 
  Wrench, 
  Phone, 
  MessageSquare, 
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Images
} from "lucide-react";
import { COMPANY_DATA, type ProductCategory } from "../data/company";
import { getCategoryImages } from "../utils/imageLoader";

interface CategoryImageSliderProps {
  cat: ProductCategory;
}

const CategoryImageSlider: React.FC<CategoryImageSliderProps> = ({ cat }) => {
  const folderImages = getCategoryImages(cat.id);
  const images = folderImages.length > 0 ? folderImages : [cat.image];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 group/slider">
      <img
        src={images[currentIndex]}
        alt={`${cat.name} - Ảnh ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />

      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-start z-10 pointer-events-none">
        {cat.badge && (
          <span className="bg-[#F47A20] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
            {cat.badge}
          </span>
        )}

        {images.length > 1 && (
          <span className="bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
            <Images className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentIndex + 1}/{images.length}</span>
          </span>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 -translate-y-1/2 !w-8 !h-8 !min-h-0 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 top-1/2 -translate-y-1/2 !w-8 !h-8 !min-h-0 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`!h-1.5 !min-h-0 rounded-full transition-all ${
                  idx === currentIndex ? "w-5 bg-white shadow" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Chuyển đến ảnh ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const ProductCategories: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductCategory | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Pipette":
        return <Pipette className="w-5 h-5 text-[#075FA8]" />;
      case "Flame":
        return <Flame className="w-5 h-5 text-[#F47A20]" />;
      case "Wind":
        return <Wind className="w-5 h-5 text-sky-600" />;
      case "Refrigerator":
        return <Refrigerator className="w-5 h-5 text-blue-600" />;
      case "Disc":
        return <Disc className="w-5 h-5 text-indigo-600" />;
      default:
        return <Wrench className="w-5 h-5 text-[#075FA8]" />;
    }
  };

  return (
    <section id="san-pham" className="py-16 sm:py-24 bg-[#F6F8FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 border border-blue-200 text-[#075FA8] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            DANH MỤC VẬT TƯ CHÍNH
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Đầy đủ vật tư cho nhu cầu điện lạnh
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Từ sửa chữa dân dụng đến công trình và hệ thống lạnh chuyên nghiệp.
          </p>
        </div>

        {/* 6 Grid Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPANY_DATA.productCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              <CategoryImageSlider cat={cat} />

              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#075FA8] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {cat.shortDesc}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {cat.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProduct(cat)}
                    className="flex-1 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#075FA8] font-bold text-sm py-2.5 px-3 rounded-lg transition-colors text-center"
                  >
                    Xem chi tiết
                  </button>
                  <a
                    href={`tel:${COMPANY_DATA.hotlineRaw}`}
                    className="flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Hỏi hàng</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-8 sm:mt-16 bg-slate-50 rounded-xl p-5 sm:p-10 border border-slate-200 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
          <div className="text-left max-w-xl">
            <h4 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              Không tìm thấy chủng loại vật tư bạn đang cần?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Hãy liên hệ trực tiếp với Đông Kha. Chúng tôi sẽ hỗ trợ tra cứu đúng quy cách kỹ thuật và kiểm tra tình trạng hàng tồn kho tức thì.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow-xs transition-colors text-xs sm:text-base whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>{COMPANY_DATA.hotline}</span>
            </a>

            <a
              href={COMPANY_DATA.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-350 text-slate-700 font-bold px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow-xs transition-colors text-xs sm:text-base whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0068FF]" />
              <span>Nhắn Zalo</span>
            </a>
          </div>
        </div>

      </div>

      {/* Product Detail Modal - Left Slide-In Drawer */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-start animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-lg sm:max-w-xl md:max-w-2xl h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 text-left flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
                  {getCategoryIcon(selectedProduct.icon)}
                </div>
                <h3 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Đóng"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors !min-h-0 cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-5 sm:p-6 flex-1 space-y-5">
              <div className="aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full min-h-[200px] sm:min-h-[280px]">
                <CategoryImageSlider cat={selectedProduct} />
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Giới thiệu danh mục</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm mb-4">
                  {selectedProduct.fullDesc}
                </p>

                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Các chủng loại, quy cách có sẵn</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedProduct.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 z-20">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                <a
                  href={`tel:${COMPANY_DATA.hotlineRaw}`}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#075FA8] hover:bg-[#0B1F33] dark:hover:bg-blue-600 text-white font-black text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" />
                  <span>Gọi tư vấn</span>
                </a>
                <a
                  href={COMPANY_DATA.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                  <span>Nhắn Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
