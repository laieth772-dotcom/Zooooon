import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import FavoritesDrawer from "./components/FavoritesDrawer";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import { SiteDataProvider, useSiteData } from "./context/SiteDataContext";
import { Product } from "./types";
import { Sparkles, Flame, Percent, RefreshCw, ShoppingBag, ArrowUp } from "lucide-react";

export default function App() {
  return (
    <SiteDataProvider>
      <MainAppContent />
    </SiteDataProvider>
  );
}

function MainAppContent() {
  const { products, branding, theme } = useSiteData();

  // Dark mode loaded from user preference or local storage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // State managers
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Synchronize theme configuration with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Synchronize favorites with local storage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Handle product deep linking (?product=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    if (productId && products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [products]);

  // Monitor scroll height to toggle the "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update document headers dynamically for advanced SEO
  useEffect(() => {
    if (branding.siteTitle) {
      document.title = branding.siteTitle;
    }
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', branding.siteDescription || "فد زون - متجر الإلكترونيات الفاخرة");

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', branding.seoKeywords || "fad zone, فد زون, متجر الكترونيات, تيك توك");
  }, [branding.siteTitle, branding.siteDescription, branding.seoKeywords]);

  // Retrieve full Product items for favorites
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  // Handle additions/removals from favorites
  const handleToggleFavorite = (id: string, e?: any) => {
    if (e) {
      e.stopPropagation(); // prevent opening details
    }
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Direct reserve / buy opens TikTok Profile
  const handleReserve = (product: Product, e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    window.open(branding.tiktokUrl, "_blank");
  };

  // Switch product detail inside modal
  const handleSelectProductFromModal = (product: Product) => {
    setSelectedProduct(product);
  };

  // Clear search and category filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Filter products based on active criteria
  const isBrowsingAll = selectedCategory === "all" && searchQuery.trim() === "";

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract products dynamically for default dashboard partitions
  const offersProducts = products.filter((p) => p.isOffer);
  const bestSellersProducts = products.filter((p) => p.isBestSeller);
  const latestProducts = products.filter((p) => p.isLatest);
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#050505] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-300">
      
      {/* Header bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Core Viewport */}
      <main className="flex-grow">
        
        {/* Hero Slider banner */}
        <Hero />

        {/* Dynamic Categories selector */}
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            // Smooth scroll down to listings section
            const el = document.getElementById("catalog-anchor");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Scroll Anchor marker */}
        <div id="catalog-anchor" className="scroll-mt-24" />

        {/* Product Catalog Area */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {isBrowsingAll ? (
            /* =========================================================
               DEFAULT HOME PAGE LAYOUT (Structured sections as requested)
               ========================================================= */
            <div className="space-y-16 sm:space-y-24">
              
              {/* 1. Offers Section */}
              {offersProducts.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.03] dark:border-white/[0.03] pb-4" dir="rtl">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-start text-red-500 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        <Percent className="w-4 h-4" />
                        <span>عروض حصرية لفترة محدودة</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black text-black dark:text-white mt-1 font-display">
                        أقوى العروض والخصومات
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {offersProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isFavorite={favoriteIds.includes(p.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onReserve={handleReserve}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Best Sellers Section */}
              {bestSellersProducts.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.03] dark:border-white/[0.03] pb-4" dir="rtl">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-start text-amber-500 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-amber-500/15" />
                        <span>الأعلى مبيعاً على تيك توك</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black text-black dark:text-white mt-1 font-display">
                        الأكثر مبيعاً ورواجاً
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {bestSellersProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isFavorite={favoriteIds.includes(p.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onReserve={handleReserve}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Featured / Highlight Section */}
              {featuredProducts.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.03] dark:border-white/[0.03] pb-4" dir="rtl">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-start text-purple-500 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 fill-purple-500/15" />
                        <span>مجموعة النخبة الفاخرة</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black text-black dark:text-white mt-1 font-display">
                        المنتجات المميز والفاخرة
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {featuredProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isFavorite={favoriteIds.includes(p.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onReserve={handleReserve}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Latest Arrivals Section */}
              {latestProducts.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.03] dark:border-white/[0.03] pb-4" dir="rtl">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-500 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 fill-blue-500/15" />
                        <span>وصلنا حديثاً</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black text-black dark:text-white mt-1 font-display">
                        أحدث الإضافات الفاخرة
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {latestProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isFavorite={favoriteIds.includes(p.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onReserve={handleReserve}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* =========================================================
               FILTERED SEARCH OR CATEGORY VIEW
               ========================================================= */
            <div className="space-y-8">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/[0.03] dark:border-white/[0.03] pb-4 text-center sm:text-right" dir="rtl">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white font-display">
                    {searchQuery.trim() !== "" ? "نتائج البحث" : "تصفح المنتجات"}
                  </h2>
                  <p className="text-xs sm:text-sm text-black/50 dark:text-white/50 mt-1">
                    تم العثور على {filteredProducts.length} منتجاً ممتازاً
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black dark:text-white bg-black/[0.03] dark:bg-white/[0.03] rounded-lg border border-black/[0.04] dark:border-white/[0.04] hover:bg-black/[0.07] dark:hover:bg-white/[0.07] transition-all cursor-pointer"
                    id="reset-filters-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة تعيين الفلاتر</span>
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 sm:py-24 bg-white dark:bg-[#0c0c0e] rounded-3xl border border-black/[0.03] dark:border-white/[0.03] max-w-lg mx-auto p-8 space-y-4" dir="rtl">
                  <div className="text-black/20 dark:text-white/20 flex justify-center">
                    <Sparkles className="w-16 h-16 stroke-1" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-base sm:text-lg text-black dark:text-white">لم نجد أي نتائج تطابق بحثك</h3>
                    <p className="text-xs sm:text-sm text-black/45 dark:text-white/45 max-w-xs mx-auto leading-relaxed">
                      جرب البحث بكلمات أخرى أو أعد تعيين الفلاتر لعرض كافة المنتجات الرائجة المتاحة في المتجر.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-black text-xs sm:text-sm rounded-full shadow-sm cursor-pointer"
                    id="no-results-reset"
                  >
                    عرض كافة المنتجات
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isFavorite={favoriteIds.includes(p.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                      onReserve={handleReserve}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

        </section>

        {/* 5. Customer reviews section */}
        <Reviews />

        {/* 6. FAQ section */}
        <FAQ />

      </main>

      {/* Footer block */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Action Button (Back to top) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/[0.05] dark:border-white/[0.1]"
          aria-label="الرجوع للأعلى"
          id="back-to-top-btn"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Favorites Drawer sliding panel */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteItems={favoriteProducts}
        onRemoveFavorite={(id) => handleToggleFavorite(id)}
        onViewProduct={(product) => {
          setSelectedProduct(product);
          setIsFavoritesOpen(false); // Close favorites drawer when product opened
        }}
      />

      {/* Product Detail Modal overlay */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isFavorite={favoriteIds.includes(selectedProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectProduct={handleSelectProductFromModal}
        />
      )}

      {/* Admin Dashboard overlay modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-0 md:p-6">
          <div className="w-full h-full md:h-[95vh] md:max-w-7xl bg-white dark:bg-[#070709] md:rounded-3xl shadow-2xl relative overflow-hidden">
            <AdminDashboard onClose={() => setIsAdminOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
