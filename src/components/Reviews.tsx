import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export default function Reviews() {
  const { reviews, theme, branding } = useSiteData();

  return (
    <section id="reviews" className="py-16 bg-white dark:bg-[#040405] transition-colors duration-300 overflow-hidden relative text-right" dir="rtl">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className={`text-xs font-bold ${theme.text} tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full`}>
            آراء النخبة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white font-display mt-3 tracking-tight">
            ماذا يقول عملاؤنا عنا؟
          </h2>
          <p className="text-xs sm:text-sm text-black/55 dark:text-white/55 mt-2.5">
            ثقة عملائنا هي سر نجاحنا. تصفح آراء المشترين الذين اختاروا {branding.logoArabic} للفخامة والأمان
          </p>
        </div>

        {/* Reviews Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between p-6 bg-neutral-50 dark:bg-[#0a0a0c] border border-black/[0.02] dark:border-white/[0.02] rounded-3xl luxury-shadow hover:scale-[1.01] transition-transform duration-300"
            >
              <div>
                
                {/* Rating Stars row */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < Math.floor(review.rating) ? "fill-current" : "opacity-30"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-black text-black dark:text-white mr-1.5 mt-0.5">
                    {review.rating}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 leading-relaxed mb-6 font-medium relative">
                  <Quote className="w-10 h-10 absolute -top-5 -right-3 text-black/[0.02] dark:text-white/[0.02] -z-10" />
                  "{review.comment}"
                </p>

              </div>

              {/* User Bio Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-black/[0.03] dark:border-white/[0.03]">
                <img
                  src={review.avatar}
                  alt={review.userName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-black/5"
                />
                <div className="text-right">
                  <h4 className="font-bold text-xs sm:text-sm text-black dark:text-white flex items-center gap-1">
                    {review.userName}
                    {review.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                    )}
                  </h4>
                  <span className="text-[10px] text-black/40 dark:text-white/40">
                    {review.date}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
