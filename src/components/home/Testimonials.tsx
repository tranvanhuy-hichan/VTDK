import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarBg: string;
  initials: string;
}

export const Testimonials: React.FC = () => {
  const list: Testimonial[] = [
    {
      name: "Anh Nguyễn Hải",
      role: "Kỹ sư trưởng - Nhà thầu Cơ điện M&E",
      content: "Công ty Đông Kha là đối tác cung cấp vật tư chính cho các dự án lắp đặt điều hòa trung tâm của chúng tôi tại Sơn Trà. Ống đồng Luvata luôn sẵn số lượng lớn, đầy đủ CO/CQ và hóa đơn tài chính rất nhanh chóng.",
      rating: 5,
      avatarBg: "bg-blue-600",
      initials: "NH"
    },
    {
      name: "Anh Trần Văn Minh",
      role: "Kỹ thuật viên sửa chữa độc lập",
      content: "Là thợ sửa chữa tự do tại khu vực Cẩm Lệ, mình thường xuyên ghé cửa hàng Đông Kha lấy linh kiện. Thích nhất là cửa hàng có sẵn tủ thử bo mạch Inverter giúp thợ kiểm tra linh kiện chạy ổn định trước khi đi lắp cho khách.",
      rating: 5,
      avatarBg: "bg-emerald-600",
      initials: "VM"
    },
    {
      name: "Chị Lê Thị Vy",
      role: "Chủ đại lý bán lẻ vật tư điện lạnh",
      content: "Tôi hợp tác nhập sỉ gas lạnh R32, R410A và linh kiện máy giặt từ Đông Kha để bán lại. Nguồn hàng rất ổn định, giá sỉ tốt, hỗ trợ đóng gói và gửi xe khách đi Quảng Nam cực kỳ thuận tiện trong ngày.",
      rating: 5,
      avatarBg: "bg-amber-600",
      initials: "LV"
    }
  ];

  return (
    <section className="py-8 sm:py-20 bg-[#F6F8FA] dark:bg-[#0F172A] relative border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-[#075FA8] dark:text-blue-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
            ĐỒNG HÀNH &amp; HỢP TÁC
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Đánh giá thực tế từ đối tác &amp; khách hàng
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-300 font-normal">
            Sự tin cậy của anh em thợ cơ điện lạnh và nhà thầu xây dựng tại Đà Nẵng là động lực của Đông Kha.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-8">
          {list.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col justify-between relative group hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 text-left"
            >
              <div>
                {/* Quote Icon Overlay */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-100 dark:text-slate-800 pointer-events-none group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 rotate-180 fill-current" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2.5 sm:mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed italic mb-3.5 sm:mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* Reviewer Meta info */}
              <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider shrink-0 shadow-sm`}>
                  {item.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block leading-tight">
                      {item.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 block mt-0.5 font-medium leading-none">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
