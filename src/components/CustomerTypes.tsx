import React from "react";
import { Wrench, Users, ShoppingBag, Briefcase, Home, ArrowRight } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const CustomerTypes: React.FC = () => {
  const getCustomerIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="w-6 h-6 text-[#075FA8]" />;
      case "Users":
        return <Users className="w-6 h-6 text-sky-600" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-6 h-6 text-[#F47A20]" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-[#075FA8]" />;
      default:
        return <Home className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F6F8FA] dark:bg-[#0F172A] border-t border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-[#075FA8] dark:text-blue-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            ĐỐI TƯỢNG PHỤC VỤ
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Đông Kha đồng hành cùng
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Dù bạn là thợ cá nhân, chủ nhà thầu hay khách hàng gia đình, Đông Kha luôn có giải pháp vật tư phù hợp nhất.
          </p>
        </div>

        {/* Customer Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {COMPANY_DATA.customerTypes.map((cust) => (
            <div
              key={cust.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-slate-750 transition-colors">
                  {getCustomerIcon(cust.icon)}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors">
                  {cust.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {cust.description}
                </p>
              </div>

              <a
                href="#lien-he"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-bold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-[#F47A20] transition-colors"
              >
                <span>Liên hệ ngay</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
