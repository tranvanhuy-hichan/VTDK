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
  // Dynamically load all images in public/images/categories/{cat.id}/
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
      {/* Active Image */}
      <img
        src={images[currentIndex]}
        alt={`${cat.name} - Ảnh ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />

      {/* Top Left Badge: Custom Badge or Multi-Image Counter */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-start z-10 pointer-events-none">
        {cat.badge && (
          <span className="bg-[#F47A20] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
            {cat.badge}
          </span>
        )}

        {/* Multi-image count badge */}
        {images.length > 1 && (
          <span className="bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
            <Images className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentIndex + 1}/{images.length}</span>
          </span>
        )}
      </div>

      {/* Left / Right Slider Controls (only if images > 1) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity shadow min-h-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity shadow min-h-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Dot Indicators */}
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all min-h-0 ${
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
              {/* Dynamic Image Carousel Slider (Clean Unobstructed Photo) */}
              <CategoryImageSlider cat={cat} />

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  {/* Category Title & Icon Header */}
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

                  {/* Representative Items List */}
                  <ul className="space-y-2 mb-6">
                    {cat.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Buttons (Consultation Focus - No E-commerce buy) */}
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
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-blue-200/80 shadow-md text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              Không tìm thấy chủng loại vật tư bạn đang cần?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Liên hệ ngay Đông Kha – chúng tôi hỗ trợ tra cứu đúng thông số &amp; kiểm tra hàng tồn kho trong 2 phút.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${COMPANY_DATA.hotlineRaw}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold px-5 py-3 rounded-xl shadow transition-colors text-sm"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{COMPANY_DATA.hotline}</span>
            </a>
            <a
              href={COMPANY_DATA.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow transition-colors text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Nhắn Zalo</span>
            </a>
          </div>
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 text-left relative p-6 sm:p-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors min-h-0"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-[#075FA8]">
                {getCategoryIcon(selectedProduct.icon)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h3>
                <span className="text-xs text-[#075FA8] font-bold uppercase tracking-wider">Vật tư điện lạnh Đông Kha</span>
              </div>
            </div>

            <p className="text-slate-700 text-base leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedProduct.fullDesc}
            </p>

            <h4 className="font-bold text-slate-900 text-base mb-3">Các chủng loại &amp; thông số sẵn có:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {selectedProduct.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-slate-800 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-6">
              <p className="text-xs sm:text-sm text-orange-950 font-medium">
                💡 <strong>Lưu ý thợ &amp; khách hàng:</strong> Đông Kha không niêm yết giá cố định trên web để luôn đảm bảo giá sỉ tốt nhất theo biến động thị trường &amp; số lượng đơn hàng. Hãy gọi hotline hoặc nhắn Zalo để nhận báo giá ưu đãi tức thì!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`tel:${COMPANY_DATA.hotlineRaw}`}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#075FA8] hover:bg-[#0B1F33] text-white font-bold py-3.5 px-4 rounded-xl shadow text-base"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Gọi báo giá ngay: {COMPANY_DATA.hotline}</span>
              </a>
              <a
                href={COMPANY_DATA.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-base"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Gửi mẫu qua Zalo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
