import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, MessageSquare, ShieldCheck, Truck } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export default function Hero() {
  const { branding, theme } = useSiteData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = branding.banners || [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#050505] py-8 sm:py-12 md:py-16 transition-colors duration-300">
      
      {/* Decorative Blur Ambient Background */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none opacity-30 dark:opacity-20 bg-amber-500`} />
      <div className={`absolute bottom-10 right-10 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none opacity-20 dark:opacity-10 bg-blue-500`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Slider Frame */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/40 dark:to-neutral-900/80 border border-black/[0.03] dark:border-white/[0.03] min-h-[480px] sm:min-h-[520px] md:min-h-[600px] flex items-center shadow-sm">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-16 gap-8 bg-gradient-to-l`}
            >
              
              {/* Text Area */}
              <div className="flex-1 text-right z-10 max-w-xl md:order-1 order-2">
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 ${theme.text} rounded-full text-xs font-semibold mb-4 sm:mb-6`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>المنتج الأكثر طلباً لهذا الأسبوع</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-tight font-display tracking-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.text} mt-2 sm:mt-3`}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm sm:text-base text-black/60 dark:text-white/60 mt-4 leading-relaxed max-w-md"
                >
                  {branding.heroSubtitle}
                </motion.p>

                {/* Call To Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-start"
                >
                  <a
                    href={branding.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 ${theme.bg} text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 flex items-center gap-2`}
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>{branding.reserveButtonText}</span>
                  </a>
                  <a
                    href="#categories"
                    className="px-6 py-3 bg-black/5 dark:bg-white/10 text-black dark:text-white font-bold text-sm sm:text-base rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors duration-300"
                  >
                    تصفح الكتالوج الكامل
                  </a>
                </motion.div>

              </div>

              {/* Image / Video Area */}
              <div className="flex-1 flex justify-center items-center z-10 w-full max-w-[280px] sm:max-w-[360px] md:max-w-none md:order-2 order-1 relative">
                
                {/* Floating Ring background decoration */}
                <div className="absolute w-[80%] h-[80%] border-2 border-black/[0.02] dark:border-white/[0.02] rounded-full animate-spin [animation-duration:40s]" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="relative group w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/5"
                >
                  {slides[currentSlide].videoUrl ? (
                    <video
                      src={slides[currentSlide].videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-4 p-2 bg-white/70 dark:bg-black/50 text-black dark:text-white rounded-full hover:bg-white dark:hover:bg-black border border-black/[0.05] dark:border-white/[0.1] shadow-sm transition-all z-20 cursor-pointer"
                aria-label="السابق"
                id="hero-prev-btn"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-4 p-2 bg-white/70 dark:bg-black/50 text-black dark:text-white rounded-full hover:bg-white dark:hover:bg-black border border-black/[0.05] dark:border-white/[0.1] shadow-sm transition-all z-20 cursor-pointer"
                aria-label="التالي"
                id="hero-next-btn"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? "bg-black dark:bg-white w-6" : "bg-black/20 dark:bg-white/20 hover:bg-black/40"
                  }`}
                  aria-label={`شريحة ${idx + 1}`}
                  id={`hero-dot-${idx}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Feature Highlights Sub-Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.03] p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className={`p-2.5 bg-amber-500/10 ${theme.text} rounded-full`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-sm text-black dark:text-white">ضمان {branding.logoArabic} الشامل</h3>
              <p className="text-[11px] sm:text-xs text-black/50 dark:text-white/50">عام كامل استبدال فوري مجاناً</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className={`p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full`}>
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-sm text-black dark:text-white">شحن سريع ومضمون</h3>
              <p className="text-[11px] sm:text-xs text-black/50 dark:text-white/50">توصيل للباب خلال 2-5 أيام عمل</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <div className={`p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-right sm:text-left">
              <h3 className="font-bold text-sm text-black dark:text-white">الدفع كاش عند الاستلام</h3>
              <p className="text-[11px] sm:text-xs text-black/50 dark:text-white/50">افحص واستلم بكل أمان وثقة</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
