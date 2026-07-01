import React from "react";
import { Grid, Smartphone, Watch, Headphones, Tv, Zap } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";
import { Category } from "../types";

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Grid":
      return <Grid className={className} />;
    case "Smartphone":
      return <Smartphone className={className} />;
    case "Watch":
      return <Watch className={className} />;
    case "Headphones":
      return <Headphones className={className} />;
    case "Tv":
      return <Tv className={className} />;
    case "Zap":
      return <Zap className={className} />;
    default:
      return <Grid className={className} />;
  }
};

export default function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  const { categories, theme } = useSiteData();

  return (
    <section id="categories" className="py-8 bg-neutral-50/50 dark:bg-[#080808]/50 border-y border-black/[0.03] dark:border-white/[0.03] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white font-display tracking-tight">
            تصفح بالفئات والمجموعات
          </h2>
          <p className="text-xs sm:text-sm text-black/55 dark:text-white/55 mt-2">
            انقر على الفئة لعرض أرقى المنتجات والمواصفات التي تلائم احتياجاتك
          </p>
        </div>

        {/* Categories List (Horizontal Scrollable on mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory" dir="rtl">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex-shrink-0 cursor-pointer snap-start ${
                  isActive
                    ? `${theme.bg} text-white shadow-md scale-102`
                    : "bg-white text-black/70 dark:bg-neutral-900 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.03] dark:border-white/[0.03]"
                }`}
                aria-label={category.name}
                id={`cat-btn-${category.id}`}
              >
                <CategoryIcon
                  name={category.iconName}
                  className={`w-4 h-4 ${isActive ? "text-white animate-pulse" : "text-black/50 dark:text-white/50"}`}
                />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
