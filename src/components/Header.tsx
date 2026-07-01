import React, { useState } from "react";
import { Sun, Moon, Heart, Search, MessageSquare, Sparkles } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  favoritesCount,
  onOpenFavorites,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { branding, theme } = useSiteData();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-black/[0.04] dark:border-white/[0.04] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <a href="#" className="flex flex-col items-start leading-tight">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-black dark:text-white font-display flex items-center gap-1">
                {branding.logoText}
                <Sparkles className={`w-4 h-4 ${theme.text} animate-pulse`} />
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-black/50 dark:text-white/50 tracking-widest self-stretch text-center -mt-0.5">
                {branding.logoArabic}
              </span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black/40 dark:text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن هاتف، ساعة، سماعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm bg-black/[0.03] dark:bg-white/[0.03] focus:bg-white dark:focus:bg-black border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-full outline-none transition-all duration-300 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40"
            />
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 md:hidden text-black/70 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] rounded-full transition-colors"
              aria-label="بحث"
              id="mobile-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* TikTok Direct Call */}
            <a
              href={branding.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              تواصل لحجز منتجك على تيك توك
            </a>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-black/70 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] rounded-full transition-colors"
              aria-label="تغيير المظهر"
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-950" />}
            </button>

            {/* Favorites Count */}
            <button
              onClick={onOpenFavorites}
              className="p-2.5 text-black/70 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] rounded-full transition-colors relative"
              aria-label="المفضلة"
              id="favorites-btn"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-[#fafafa] dark:border-[#000000] scale-95 animate-bounce">
                  {favoritesCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Input Collapse */}
        {showMobileSearch && (
          <div className="py-3 px-1 md:hidden border-t border-black/[0.03] dark:border-white/[0.03] transition-all">
            <div className="relative">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black/40 dark:text-white/40">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن هاتف، ساعة، سماعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-sm bg-black/[0.03] dark:bg-white/[0.03] rounded-full border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-black dark:text-white"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
