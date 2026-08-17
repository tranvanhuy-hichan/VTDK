import React from "react";
import { Wrench, Users, ShoppingBag, Briefcase, Home, ArrowRight } from "lucide-react";
import { COMPANY_DATA } from "../data/company";

export const CustomerTypes: React.FC = () => {
  const getCustomerIcon = (iconName: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case "Wrench":
        return <Wrench className={`${iconClass} text-[#075FA8]`} />;
      case "Users":
        return <Users className={`${iconClass} text-sky-600`} />;
      case "ShoppingBag":
        return <ShoppingBag className={`${iconClass} text-[#F47A20]`} />;
      case "Briefcase":
        return <Briefcase className={`${iconClass} text-[#075FA8]`} />;
      default:
        return <Home className={`${iconClass} text-emerald-600`} />;
    }
  };

  return (
    <section className="py-10 sm:py-12 bg-[#F6F8FA] dark:bg-[#0F172A] border-t border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-[#075FA8] dark:text-blue-400 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
            ĐỐI TƯỢNG PHỤC VỤ
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Đông Kha đồng hành cùng
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Dù bạn là thợ cá nhân, chủ nhà thầu hay khách hàng gia đình, Đông Kha luôn có giải pháp vật tư phù hợp nhất.
          </p>
        </div>

        {/* Customer Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {COMPANY_DATA.customerTypes.map((cust) => (
            <div
              key={cust.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors">
                  {getCustomerIcon(cust.icon)}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-[#075FA8] dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {cust.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-normal">
                  {cust.description}
                </p>
              </div>

              <a
                href="#lien-he"
                className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] font-bold text-[#075FA8] dark:text-blue-400 hover:text-[#0B1F33] dark:hover:text-[#F47A20] transition-colors"
              >
                <span>Liên hệ ngay</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
