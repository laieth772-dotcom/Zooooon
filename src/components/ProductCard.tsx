import React from "react";
import { Heart, Star, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { Product } from "../types";
import { useSiteData } from "../context/SiteDataContext";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e?: any) => void;
  onViewDetails: (product: Product) => void;
  onReserve: (product: Product, e?: any) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onReserve,
}: ProductCardProps) {
  const { theme } = useSiteData();

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col h-full bg-white dark:bg-[#0c0c0e] rounded-3xl overflow-hidden border border-black/[0.04] dark:border-white/[0.04] luxury-shadow hover:scale-[1.01] hover:border-black/[0.08] dark:hover:border-white/[0.08] transition-all duration-300 cursor-pointer text-right"
      dir="rtl"
    >
      
      {/* Floating Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
        {product.discountBadge && (
          <span className="px-3 py-1 text-[11px] font-bold text-white bg-red-500 rounded-full shadow-sm tracking-wide">
            {product.discountBadge}
          </span>
        )}
        {product.isBestSeller && (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-white bg-amber-500 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 fill-white/20" />
            <span>الأكثر مبيعاً</span>
          </span>
        )}
        {product.isLatest && (
          <span className="px-3 py-1 text-[11px] font-bold text-white bg-blue-600 rounded-full shadow-sm">
            جديد
          </span>
        )}
      </div>

      {/* Floating Favorite Button */}
      <button
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-4 left-4 z-10 p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all group-hover:opacity-100"
        aria-label="أضف للمفضلة"
        id={`fav-btn-${product.id}`}
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            isFavorite ? "text-rose-500 fill-rose-500 scale-110" : "text-black/60 dark:text-white/60"
          }`}
        />
      </button>

      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900/20">
        <img
          src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600"}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        
        {/* Quick View Interactive Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 px-4 py-2 bg-white/90 dark:bg-black/90 text-black dark:text-white font-bold text-xs rounded-full shadow-md">
            <Eye className="w-3.5 h-3.5" />
            <span>عرض التفاصيل</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        
        {/* Category tag */}
        <span className={`text-[10px] sm:text-xs font-bold ${theme.text} tracking-wider uppercase mb-1`}>
          {product.category === "smart-phones" ? "الهواتف الفاخرة" :
           product.category === "wearables" ? "ساعات وخواتم ذكية" :
           product.category === "audio" ? "صوتيات النخبة" :
           product.category === "smart-home" ? "المنزل الذكي" : "إكسسوارات فاخرة"}
        </span>

        {/* Product Title */}
        <h3 className={`font-bold text-sm sm:text-base text-black dark:text-white leading-snug line-clamp-2 mb-2 hover:${theme.text} transition-colors`}>
          {product.title}
        </h3>

        {/* Rating and Stock Level Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-black text-black dark:text-white">
              {product.rating}
            </span>
            <span className="text-[10px] text-black/40 dark:text-white/40">
              ({product.reviewCount})
            </span>
          </div>

          {/* Stock Badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            product.stockStatus === "متوفر" 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse"
          }`}>
            {product.stockStatus}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/[0.03] dark:border-white/[0.03]">
          
          <div className="flex flex-col text-right">
            <span className="text-lg sm:text-xl font-black text-black dark:text-white">
              {product.price.toLocaleString("ar-SA")} ر.س
            </span>
            {product.originalPrice && (
              <span className="text-xs text-black/35 dark:text-white/35 line-through">
                {product.originalPrice.toLocaleString("ar-SA")} ر.س
              </span>
            )}
          </div>

          {/* Reserve Button */}
          <button
            onClick={(e) => onReserve(product, e)}
            className={`flex items-center gap-1.5 px-4 py-2.5 ${theme.bg} text-white rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all`}
            id={`reserve-btn-${product.id}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>احجز الآن</span>
          </button>

        </div>

      </div>

    </div>
  );
}
