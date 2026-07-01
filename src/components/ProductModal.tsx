import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Heart, Star, ShoppingBag, Share2, Copy, Check, Shield, Award, Sparkles, Truck } from "lucide-react";
import { Product } from "../types";
import { useSiteData } from "../context/SiteDataContext";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductModal({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
}: ProductModalProps) {
  const { products, branding, theme } = useSiteData();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "specs">("features");
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset active image index whenever the product changes
  useEffect(() => {
    setActiveImageIdx(0);
    // Scroll modal content to top
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [product]);

  // Lock body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Filter related products from context products
  const relatedProducts = products.filter(
    (item) => item.category === product.category && item.id !== product.id
  ).slice(0, 3);

  const handleShareCopy = () => {
    const shareUrl = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    const text = `أهلاً! انظر إلى هذا المنتج المميز في متجر ${branding.logoArabic}: "${product.title}" بسعر ${product.price} ر.س. تصفحه هنا: ${window.location.origin}?product=${product.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleReserveNow = () => {
    window.open(branding.tiktokUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-all duration-300" dir="rtl">
      
      {/* Modal Card Shell */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-full sm:h-[90vh] sm:max-w-5xl bg-white dark:bg-[#0a0a0c] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-black/[0.04] dark:border-white/[0.04]"
      >
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.03] dark:border-white/[0.03] glass sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className={`p-1 bg-amber-500/10 ${theme.text} rounded-md text-xs font-bold uppercase`}>
              تفاصيل المنتج
            </span>
            <span className="text-xs text-black/40 dark:text-white/40 font-mono hidden md:inline">
              ID: FZ-{product.id}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.07] dark:hover:bg-white/[0.07] rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Core Content */}
        <div
          ref={modalRef}
          className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-8"
        >
          
          {/* Main Product Presentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Side: Images Viewer & Gallery (md:col-span-5) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              {/* Active Image Viewer Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/30 border border-black/[0.02] dark:border-white/[0.02] flex items-center justify-center group">
                <img
                  src={product.images[activeImageIdx]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Micro Ambient Glow behind item */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                
                {/* Slide index label */}
                <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] font-black text-white rounded-full">
                  {activeImageIdx + 1} / {product.images.length}
                </span>
              </div>

              {/* Thumbnail Selector list */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar justify-start">
                  {product.images.map((img, idx) => (
                    <button
                       key={idx}
                       onClick={() => setActiveImageIdx(idx)}
                       className={`relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border transition-all cursor-pointer ${
                        idx === activeImageIdx
                          ? `border-black dark:border-white ring-2 ring-amber-500/30 scale-95`
                          : "border-transparent opacity-60 hover:opacity-100"
                       }`}
                       id={`thumb-${idx}`}
                     >
                      <img src={img} alt={`مصغر ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right Side: Primary Info, Specifications and Booking Action (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col text-right">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className={`text-xs sm:text-sm font-bold ${theme.text} tracking-wider`}>
                  {product.category === "smart-phones" ? "الهواتف الفاخرة" :
                   product.category === "wearables" ? "ساعات وخواتم ذكية" :
                   product.category === "audio" ? "صوتيات النخبة" :
                   product.category === "smart-home" ? "المنزل الذكي" : "إكسسوارات فاخرة"}
                </span>

                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-black dark:text-white">
                    {product.rating}
                  </span>
                  <span className="text-[11px] text-black/40 dark:text-white/40">
                    ({product.reviewCount} تقييم حقيقي)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-black dark:text-white leading-snug mb-2 font-display">
                {product.title}
              </h1>
              
              <p className="text-[11px] sm:text-xs text-black/35 dark:text-white/35 font-mono mb-4">
                {product.englishTitle}
              </p>

              {/* Price & Discount breakdown block */}
              <div className="p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-900/30 border border-black/[0.02] dark:border-white/[0.02] rounded-2xl flex items-center justify-between mb-6">
                <div className="flex flex-col text-right">
                  <div className="flex items-baseline gap-2 justify-start">
                    <span className="text-2xl sm:text-3xl font-black text-black dark:text-white">
                      {product.price.toLocaleString("ar-SA")} ر.س
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-black/35 dark:text-white/35 line-through">
                        {product.originalPrice.toLocaleString("ar-SA")} ر.س
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    ✓ السعر شامل ضريبة القيمة المضافة والشحن السريع
                  </span>
                </div>

                {product.discountBadge && (
                  <span className="px-3 py-1.5 text-xs font-black text-white bg-red-500 rounded-lg animate-bounce">
                    وفر أكثر مع {product.discountBadge}
                  </span>
                )}
              </div>

              {/* Short description */}
              <div className="mb-6">
                <h3 className="font-bold text-sm text-black dark:text-white mb-2">نبذة عن المنتج:</h3>
                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              {/* CTA Action Buttons Frame */}
              <div className="space-y-3.5 mb-6">
                
                {/* TikTok Booking Button */}
                <button
                  onClick={handleReserveNow}
                  className={`w-full py-4 ${theme.bg} text-white rounded-2xl font-black text-base shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2`}
                  id="modal-reserve-btn"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>احجز الآن عبر تيك توك</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Share button */}
                  <div className="relative group">
                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full py-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/15 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5"
                      id="modal-whatsapp-share"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>مشاركة واتساب</span>
                    </button>
                  </div>

                  {/* Copy Link button */}
                  <button
                    onClick={handleShareCopy}
                    className="py-3 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-black/70 dark:text-white/70 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border border-black/[0.04] dark:border-white/[0.04]"
                    id="modal-copy-link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "تم نسخ الرابط!" : "نسخ رابط المنتج"}</span>
                  </button>

                </div>

                {/* Favorite & stock level details */}
                <div className="flex items-center justify-between pt-2">
                  
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="flex items-center gap-2 text-xs font-bold text-black/65 dark:text-white/65 hover:text-rose-500 dark:hover:text-rose-500 transition-colors"
                    id="modal-fav-toggle"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "text-rose-500 fill-rose-500" : ""}`} />
                    <span>{isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>{product.trendingCount || 12} يتصفحون هذا المنتج حالياً</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Deep Tabs: Specifications & Key Features block */}
          <div className="border-t border-black/[0.04] dark:border-white/[0.04] pt-8">
            
            <div className="flex border-b border-black/[0.03] dark:border-white/[0.03] mb-6">
              <button
                onClick={() => setActiveTab("features")}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "features"
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-black/40 dark:text-white/40 hover:text-black/60"
                }`}
                id="tab-features"
              >
                المميزات الرئيسية
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "specs"
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-black/40 dark:text-white/40 hover:text-black/60"
                }`}
                id="tab-specs"
              >
                المواصفات التقنية
              </button>
            </div>

            {activeTab === "features" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/10 border border-black/[0.02] dark:border-white/[0.02] rounded-xl"
                  >
                    <div className={`p-1.5 bg-amber-500/15 ${theme.text} rounded-lg flex-shrink-0 mt-0.5`}>
                      <Sparkles className="w-3.5 h-3.5 fill-amber-500/10" />
                    </div>
                    <p className="text-xs sm:text-sm text-black/75 dark:text-white/75 font-medium leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specifications?.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3.5 bg-neutral-50/50 dark:bg-[#0c0c0e] border border-black/[0.01] dark:border-white/[0.01] rounded-xl text-xs sm:text-sm"
                  >
                    <span className="font-bold text-black/40 dark:text-white/40">{spec.label}</span>
                    <span className="font-bold text-black dark:text-white text-left">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Secure Purchase Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-black/[0.04] dark:border-white/[0.04] py-6 my-4 bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl px-4">
            <div className="flex items-center gap-3 justify-center">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-black/75 dark:text-white/75">ضمان استبدال حقيقي لمدة عام</span>
            </div>
            <div className="flex items-center gap-3 justify-center border-y sm:border-y-0 sm:border-x border-black/[0.04] dark:border-white/[0.04] py-3 sm:py-0">
              <Truck className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-black/75 dark:text-white/75">شحن آمن للباب (2-5 أيام)</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-black/75 dark:text-white/75">فحص جودة المنتج قبل الاستلام</span>
            </div>
          </div>

          {/* Related products Row */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-black/[0.04] dark:border-white/[0.04] pt-8">
              <h3 className="font-black text-lg text-black dark:text-white mb-5 font-display text-right">
                قد يعجبك أيضاً منتجات مشابهة:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="p-4 bg-neutral-50 dark:bg-[#0c0c0e] border border-black/[0.03] dark:border-white/[0.03] rounded-2xl flex gap-3 hover:border-black/10 dark:hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-black flex-shrink-0 border border-black/[0.02] dark:border-white/[0.02]">
                      <img src={item.images[0]} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-between text-right flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-black dark:text-white truncate group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h4>
                      <span className={`text-xs font-black ${theme.text}`}>
                        {item.price.toLocaleString("ar-SA")} ر.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
