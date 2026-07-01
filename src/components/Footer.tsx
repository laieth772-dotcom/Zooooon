import React from "react";
import { Sparkles, MessageSquare, ShieldCheck, Award, CheckSquare, ShieldAlert } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const { branding, theme } = useSiteData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#050507] border-t border-black/[0.04] dark:border-white/[0.04] py-12 md:py-16 transition-colors duration-300 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Informational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-black/[0.04] dark:border-white/[0.04]">
          
          {/* Shop Briefing Column (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4 text-right">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-black dark:text-white font-display flex items-center gap-1">
                {branding.logoText}
                <Sparkles className={`w-4 h-4 ${theme.text} animate-pulse`} />
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-black/40 dark:text-white/40 bg-black/[0.03] dark:bg-white/[0.03] px-2 py-0.5 rounded-md">
                {branding.logoArabic}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-sm">
              {branding.aboutText}
            </p>

            {/* Social Connection Badges */}
            <div className="pt-2 flex flex-wrap gap-2 justify-start">
              <a
                href={branding.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.bg} text-white rounded-lg text-xs font-bold hover:scale-[1.02] transition-transform shadow-sm`}
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>تابعنا واحجز على تيك توك</span>
              </a>
            </div>
          </div>

          {/* Quick links Category (md:col-span-3) */}
          <div className="md:col-span-3 text-right">
            <h4 className="font-bold text-xs sm:text-sm text-black dark:text-white mb-4 uppercase tracking-wider">
              فئات المتجر الرائجة
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black/50 dark:text-white/50">
              <li><a href="#categories" className={`hover:${theme.text} transition-colors`}>الهواتف الفاخرة</a></li>
              <li><a href="#categories" className={`hover:${theme.text} transition-colors`}>ساعات وخواتم ذكية</a></li>
              <li><a href="#categories" className={`hover:${theme.text} transition-colors`}>صوتيات النخبة الفاخرة</a></li>
              <li><a href="#categories" className={`hover:${theme.text} transition-colors`}>أجهزة المنزل الذكي</a></li>
              <li><a href="#categories" className={`hover:${theme.text} transition-colors`}>ملحقات الشحن اللاسلكي</a></li>
            </ul>
          </div>

          {/* Core Support Column (md:col-span-4) */}
          <div className="md:col-span-4 text-right space-y-4">
            <h4 className="font-bold text-xs sm:text-sm text-black dark:text-white uppercase tracking-wider">
              خدمة العملاء والضمان المفتوح
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 bg-amber-500/10 ${theme.text} rounded-lg flex-shrink-0 mt-0.5`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h5 className="font-bold text-xs sm:text-sm text-black dark:text-white">ضمان الوكيل الذهبي</h5>
                  <p className="text-[11px] text-black/40 dark:text-white/40">ضمان استبدال فوري مجاناً ضد عيوب التصنيع لمدة 365 يوماً</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex-shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h5 className="font-bold text-xs sm:text-sm text-black dark:text-white">فحص ومعاينة المنتج قبل الدفع</h5>
                  <p className="text-[11px] text-black/40 dark:text-white/40">افتح شحنتك، افحصها بالكامل وتأكد من جودتها قبل دفع أي ريال للمندوب</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Legal notice & bottom block */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-black/40 dark:text-white/40">
            <span>{branding.footerCopy}</span>
            <span className="hidden sm:inline">•</span>
            {/* Hidden admin access button as requested */}
            <button
              onClick={onOpenAdmin}
              className="opacity-25 hover:opacity-100 text-[10px] text-zinc-500 dark:text-zinc-400 font-bold transition-all hover:underline cursor-pointer flex items-center gap-1"
              id="admin-access-btn"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>دخول المسؤول</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center text-xs text-black/35 dark:text-white/35">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>مستورد ومرخص أصلياً</span>
            </span>
            <span>•</span>
            <span>آمن 100% بدون بطاقات ائتمانية</span>
            <span>•</span>
            <span>توصيل سريع للباب</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
