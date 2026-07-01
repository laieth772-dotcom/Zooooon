import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export default function FAQ() {
  const { faqs, theme, branding } = useSiteData();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 bg-neutral-50/40 dark:bg-[#070709]/40 border-t border-black/[0.03] dark:border-white/[0.03] transition-colors duration-300 text-right" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title block */}
        <div className="text-center mb-12">
          <span className={`text-xs font-bold ${theme.text} tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full`}>
            الأسئلة الشائعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white font-display mt-3 tracking-tight">
            لديك استفسار؟ نحن هنا للإجابة!
          </h2>
          <p className="text-xs sm:text-sm text-black/50 dark:text-white/50 mt-2">
            كل ما تحتاج لمعرفته حول طريقة الحجز، الدفع عند الاستلام، والضمان الذهبي في {branding.logoArabic}
          </p>
        </div>

        {/* Accordion Questions Frame */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#0c0c0e] rounded-2xl border border-black/[0.03] dark:border-white/[0.03] luxury-shadow overflow-hidden transition-all duration-300"
              >
                
                {/* Accordion Header Trigger */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-right font-bold text-sm sm:text-base text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/10 cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                  id={`faq-trigger-${faq.id}`}
                >
                  <span className="flex items-center gap-3 pr-1">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? theme.text : "text-black/30 dark:text-white/30"}`} />
                    <span className="leading-snug">{faq.question}</span>
                  </span>
                  
                  <span className={`p-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg flex-shrink-0 mr-4 transition-transform duration-300 ${isOpen ? `rotate-180 ${theme.text}` : "text-black/40 dark:text-white/40"}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[300px] opacity-100 border-t border-black/[0.02] dark:border-white/[0.02]" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 sm:p-6 text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed bg-neutral-50/50 dark:bg-[#08080a]/50">
                    {faq.answer}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
