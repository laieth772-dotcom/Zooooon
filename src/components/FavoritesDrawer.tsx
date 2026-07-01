import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Trash2, ShoppingBag, ExternalLink } from "lucide-react";
import { Product } from "../types";
import { TIKTOK_PROFILE_URL } from "../data";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteItems: Product[];
  onRemoveFavorite: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favoriteItems,
  onRemoveFavorite,
  onViewProduct,
}: FavoritesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Panel */}
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-[#09090b] shadow-2xl flex flex-col border-r border-black/[0.04] dark:border-white/[0.04]"
            >
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between glass">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h2 className="text-base sm:text-lg font-black text-black dark:text-white font-display">
                    قائمة مفضلاتي ({favoriteItems.length})
                  </h2>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1.5 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.07] dark:hover:bg-white/[0.07] rounded-full transition-colors cursor-pointer"
                  id="close-fav-drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-4">
                {favoriteItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-full text-black/20 dark:text-white/20">
                      <Heart className="w-12 h-12 stroke-1" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-black dark:text-white">قائمة المفضلة فارغة حالياً</h3>
                      <p className="text-xs text-black/45 dark:text-white/45 max-w-xs leading-relaxed">
                        تصفح المنتجات وأضف ما يعجبك إلى قائمة المفضلة للرجوع إليها وحجزها في أي وقت بسهولة!
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs sm:text-sm rounded-full shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                      id="fav-browse-cta"
                    >
                      ابدأ التصفح الآن
                    </button>
                  </div>
                ) : (
                  favoriteItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-neutral-50 dark:bg-[#0c0c0e] border border-black/[0.03] dark:border-white/[0.03] rounded-2xl flex gap-3 hover:border-black/10 dark:hover:border-white/10 transition-all group"
                    >
                      {/* Product thumbnail */}
                      <div
                        onClick={() => onViewProduct(item)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-black border border-black/[0.02] dark:border-white/[0.02] flex-shrink-0 cursor-pointer relative"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Info & action block */}
                      <div className="flex flex-col justify-between text-right flex-1 min-w-0">
                        <div className="space-y-1">
                          <h4
                            onClick={() => onViewProduct(item)}
                            className="font-bold text-xs sm:text-sm text-black dark:text-white line-clamp-1 hover:text-amber-500 transition-colors cursor-pointer"
                          >
                            {item.title}
                          </h4>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-500">
                            {item.price.toLocaleString("ar-SA")} ر.س
                          </span>
                        </div>

                        {/* Quick Action buttons */}
                        <div className="flex items-center justify-between pt-2">
                          
                          {/* Direct book on TikTok */}
                          <a
                            href={TIKTOK_PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] rounded-lg shadow-sm hover:opacity-95 transition-opacity"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>احجز المنتج</span>
                          </a>

                          {/* Delete item button */}
                          <button
                            onClick={() => onRemoveFavorite(item.id)}
                            className="p-1.5 text-black/40 hover:text-red-500 dark:text-white/40 dark:hover:text-red-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] rounded-lg transition-all"
                            aria-label="حذف من المفضلة"
                            id={`trash-btn-${item.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {favoriteItems.length > 0 && (
                <div className="p-6 border-t border-black/[0.04] dark:border-white/[0.04] bg-neutral-50/50 dark:bg-neutral-900/10 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-black/50 dark:text-white/50">إجمالي قيمة المحجوزات:</span>
                    <span className="font-black text-base sm:text-lg text-black dark:text-white">
                      {favoriteItems.reduce((acc, item) => acc + item.price, 0).toLocaleString("ar-SA")} ر.س
                    </span>
                  </div>
                  
                  <a
                    href={TIKTOK_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs sm:text-sm text-center shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>تأكيد حجز كافة المفضلات عبر تيك توك</span>
                  </a>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
