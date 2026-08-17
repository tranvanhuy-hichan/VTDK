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
    <section className="py-16 sm:py-20 bg-[#F6F8FA] relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 border border-blue-200 text-[#075FA8] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
            ĐỒNG HÀNH &amp; HỢP TÁC
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Đánh giá thực tế từ đối tác &amp; khách hàng
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-normal">
            Sự tin cậy của anh em thợ cơ điện lạnh và nhà thầu xây dựng tại Đà Nẵng là động lực của Đông Kha.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {list.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between relative group hover:border-blue-200 hover:shadow-md transition-all duration-300 text-left"
            >
              <div>
                {/* Quote Icon Overlay */}
                <div className="absolute top-6 right-6 text-slate-100 pointer-events-none group-hover:text-blue-50 transition-colors">
                  <Quote className="w-8 h-8 rotate-180 fill-current" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* Reviewer Meta info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm tracking-wider shrink-0 shadow-sm`}>
                  {item.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold text-slate-900 block leading-tight">
                      {item.name}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5 font-medium leading-none">
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
