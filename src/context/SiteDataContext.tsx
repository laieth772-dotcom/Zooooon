import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Review, FAQItem, Category } from "../types";
import { PRODUCTS, CATEGORIES, REVIEWS, FAQS, TIKTOK_PROFILE_URL } from "../data";

// Extends types for custom editable configurations
export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  videoUrl?: string;
}

export interface SiteBranding {
  logoText: string;
  logoArabic: string;
  siteTitle: string;
  siteDescription: string;
  heroSubtitle: string;
  whatsappNumber: string; // e.g. "96650000000"
  tiktokUrl: string;
  instagramUrl?: string;
  reserveButtonText: string;
  themeColor: "amber" | "emerald" | "blue" | "violet" | "rose";
  banners: BannerSlide[];
  seoKeywords: string;
  aboutText: string;
  footerCopy: string;
}

export interface ThemeClasses {
  text: string;
  bg: string;
  border: string;
  hoverBg: string;
  accentBg: string;
  badgeBg: string;
  badgeText: string;
  lightBg: string;
  ring: string;
}

export const THEME_COLOR_MAP: Record<string, ThemeClasses> = {
  amber: {
    text: "text-amber-600 dark:text-amber-500",
    bg: "bg-amber-600 dark:bg-amber-500",
    border: "border-amber-600 dark:border-amber-500",
    hoverBg: "hover:bg-amber-700 dark:hover:bg-amber-600",
    accentBg: "bg-amber-500/10",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-600 dark:text-amber-400",
    lightBg: "bg-amber-500/5",
    ring: "focus:ring-amber-500",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-500",
    bg: "bg-emerald-600 dark:bg-emerald-500",
    border: "border-emerald-600 dark:border-emerald-500",
    hoverBg: "hover:bg-emerald-700 dark:hover:bg-emerald-600",
    accentBg: "bg-emerald-500/10",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    lightBg: "bg-emerald-500/5",
    ring: "focus:ring-emerald-500",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-500",
    bg: "bg-blue-600 dark:bg-blue-500",
    border: "border-blue-600 dark:border-blue-500",
    hoverBg: "hover:bg-blue-700 dark:hover:bg-blue-600",
    accentBg: "bg-blue-500/10",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-600 dark:text-blue-400",
    lightBg: "bg-blue-500/5",
    ring: "focus:ring-blue-500",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-500",
    bg: "bg-violet-600 dark:bg-violet-500",
    border: "border-violet-600 dark:border-violet-500",
    hoverBg: "hover:bg-violet-700 dark:hover:bg-violet-600",
    accentBg: "bg-violet-500/10",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-600 dark:text-violet-400",
    lightBg: "bg-violet-500/5",
    ring: "focus:ring-violet-500",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-500",
    bg: "bg-rose-600 dark:bg-rose-500",
    border: "border-rose-600 dark:border-rose-500",
    hoverBg: "hover:bg-rose-700 dark:hover:bg-rose-600",
    accentBg: "bg-rose-500/10",
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-600 dark:text-rose-400",
    lightBg: "bg-rose-500/5",
    ring: "focus:ring-rose-500",
  }
};

interface SiteDataContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  faqs: FAQItem[];
  branding: SiteBranding;
  theme: ThemeClasses;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  // Product handlers
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Category handlers
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Review handlers
  addReview: (review: Omit<Review, "id">) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  // FAQ handlers
  addFAQ: (faq: Omit<FAQItem, "id">) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  // Branding handler
  updateBranding: (branding: Partial<SiteBranding>) => Promise<void>;
  // Restore defaults
  restoreAllDefaults: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const DEFAULT_BRANDING: SiteBranding = {
  logoText: "FAD ZONE",
  logoArabic: "فد زون",
  siteTitle: "فد زون | متجر النخبة الفاخرة والأجهزة التكنولوجية الحديثة",
  siteDescription: "اختبر الفخامة والسرعة المطلقة مع أحدث الهواتف الذكية، الساعات الرقمية، والسماعات العازلة للضجيج بأعلى جودة مع نظام الدفع عند الاستلام المريح.",
  heroSubtitle: "بوابتك الحصرية لاقتناء أرقى الأجهزة الذكية والملحقات الفاخرة المستوردة مباشرة للنخبة.",
  whatsappNumber: "966530635447", // standard default
  tiktokUrl: TIKTOK_PROFILE_URL,
  instagramUrl: "https://instagram.com",
  reserveButtonText: "احجز عبر تيك توك الآن",
  themeColor: "amber",
  banners: [
    {
      id: "b1",
      image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1600",
      title: "عصر الفخامة التكنولوجية بين يديك",
      subtitle: "منتجات حصرية وبإصدارات خاصة ومحدودة مستوردة مباشرة لأصحاب الذوق الرفيع"
    },
    {
      id: "b2",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600",
      title: "أناقة تليق بهيبتك وحضورك المتميز",
      subtitle: "ساعات تيتانيوم ذكية وسماعات رأسية عازلة تمنحك حضوراً واثقاً وأداءً استثنائياً"
    },
    {
      id: "b3",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1600",
      title: "السرعة المطلقة بأرقى المواد العالمية",
      subtitle: "اكتشف سلسلة آيفون 16 برو ماكس بالتيتانيوم الطبيعي الفاخر والتصميم الرائد"
    }
  ],
  seoKeywords: "فد زون, متجر فد زون, ايفون 16 برو ماكس, ساعة ابل الترا 2, سماعات عازلة, كيبورد رخامي, خاتم ذكي تيتانيوم, الدفع عند الاستلام",
  aboutText: "تأسست فد زون (FAD ZONE) لتقديم تجربة تسوق استثنائية ترتكز على الفخامة والجودة والموثوقية المطلقة. نحن نستورد منتجاتنا مباشرة من كبرى الماركات والمصانع العالمية لنوفر لعملائنا في دول الخليج العربي أحدث التقنيات وأقوى الملحقات بأسعار منافسة وبنظام حجز سلس وآمن.",
  footerCopy: "جميع الحقوق محفوظة © 2026 لمتجر فد زون الفاخر. تصميم وتطوير احترافي فائق."
};

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFAQItem] = useState<FAQItem[]>([]);
  const [branding, setBranding] = useState<SiteBranding>(DEFAULT_BRANDING);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Initialize and load from localStorage with self-seeding capability
  useEffect(() => {
    // 1. Products
    const storedProducts = localStorage.getItem("fadzone_products");
    if (!storedProducts) {
      localStorage.setItem("fadzone_products", JSON.stringify(PRODUCTS));
      setProducts(PRODUCTS);
    } else {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        localStorage.setItem("fadzone_products", JSON.stringify(PRODUCTS));
        setProducts(PRODUCTS);
      }
    }

    // 2. Categories
    const storedCategories = localStorage.getItem("fadzone_categories");
    if (!storedCategories) {
      localStorage.setItem("fadzone_categories", JSON.stringify(CATEGORIES));
      setCategories(CATEGORIES);
    } else {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (e) {
        localStorage.setItem("fadzone_categories", JSON.stringify(CATEGORIES));
        setCategories(CATEGORIES);
      }
    }

    // 3. Reviews
    const storedReviews = localStorage.getItem("fadzone_reviews");
    if (!storedReviews) {
      localStorage.setItem("fadzone_reviews", JSON.stringify(REVIEWS));
      setReviews(REVIEWS);
    } else {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        localStorage.setItem("fadzone_reviews", JSON.stringify(REVIEWS));
        setReviews(REVIEWS);
      }
    }

    // 4. FAQs
    const storedFAQs = localStorage.getItem("fadzone_faqs");
    if (!storedFAQs) {
      localStorage.setItem("fadzone_faqs", JSON.stringify(FAQS));
      setFAQItem(FAQS);
    } else {
      try {
        setFAQItem(JSON.parse(storedFAQs));
      } catch (e) {
        localStorage.setItem("fadzone_faqs", JSON.stringify(FAQS));
        setFAQItem(FAQS);
      }
    }

    // 5. Branding
    const storedBranding = localStorage.getItem("fadzone_branding");
    if (!storedBranding) {
      localStorage.setItem("fadzone_branding", JSON.stringify(DEFAULT_BRANDING));
      setBranding(DEFAULT_BRANDING);
    } else {
      try {
        setBranding(JSON.parse(storedBranding));
      } catch (e) {
        localStorage.setItem("fadzone_branding", JSON.stringify(DEFAULT_BRANDING));
        setBranding(DEFAULT_BRANDING);
      }
    }
  }, []);

  // Update document title and description based on configuration
  useEffect(() => {
    if (branding.siteTitle) {
      document.title = branding.siteTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", branding.siteDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = branding.siteDescription;
      document.head.appendChild(meta);
    }
    const metaKey = document.querySelector('meta[name="keywords"]');
    if (metaKey) {
      metaKey.setAttribute("content", branding.seoKeywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = branding.seoKeywords;
      document.head.appendChild(meta);
    }
  }, [branding]);

  // Product Mutators
  const addProduct = async (p: Omit<Product, "id">) => {
    const id = "prod_" + Date.now().toString();
    const newProduct: Product = { ...p, id };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("fadzone_products", JSON.stringify(updated));
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    const updated = products.map((prod) => (prod.id === id ? { ...prod, ...p } : prod));
    setProducts(updated);
    localStorage.setItem("fadzone_products", JSON.stringify(updated));
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((prod) => prod.id !== id);
    setProducts(updated);
    localStorage.setItem("fadzone_products", JSON.stringify(updated));
  };

  // Category Mutators
  const addCategory = async (c: Omit<Category, "id">) => {
    const id = "cat_" + Date.now().toString();
    const newCat: Category = { ...c, id };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("fadzone_categories", JSON.stringify(updated));
  };

  const updateCategory = async (id: string, c: Partial<Category>) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...c } : cat));
    setCategories(updated);
    localStorage.setItem("fadzone_categories", JSON.stringify(updated));
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    localStorage.setItem("fadzone_categories", JSON.stringify(updated));
  };

  // Review Mutators
  const addReview = async (r: Omit<Review, "id">) => {
    const id = "rev_" + Date.now().toString();
    const newRev: Review = { ...r, id };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem("fadzone_reviews", JSON.stringify(updated));
  };

  const updateReview = async (id: string, r: Partial<Review>) => {
    const updated = reviews.map((rev) => (rev.id === id ? { ...rev, ...r } : rev));
    setReviews(updated);
    localStorage.setItem("fadzone_reviews", JSON.stringify(updated));
  };

  const deleteReview = async (id: string) => {
    const updated = reviews.filter((rev) => rev.id !== id);
    setReviews(updated);
    localStorage.setItem("fadzone_reviews", JSON.stringify(updated));
  };

  // FAQ Mutators
  const addFAQ = async (f: Omit<FAQItem, "id">) => {
    const id = "faq_" + Date.now().toString();
    const newFAQ: FAQItem = { ...f, id };
    const updated = [...faqs, newFAQ];
    setFAQItem(updated);
    localStorage.setItem("fadzone_faqs", JSON.stringify(updated));
  };

  const updateFAQ = async (id: string, f: Partial<FAQItem>) => {
    const updated = faqs.map((faq) => (faq.id === id ? { ...faq, ...f } : faq));
    setFAQItem(updated);
    localStorage.setItem("fadzone_faqs", JSON.stringify(updated));
  };

  const deleteFAQ = async (id: string) => {
    const updated = faqs.filter((faq) => faq.id !== id);
    setFAQItem(updated);
    localStorage.setItem("fadzone_faqs", JSON.stringify(updated));
  };

  // Branding Mutator
  const updateBranding = async (newBrand: Partial<SiteBranding>) => {
    const updated = { ...branding, ...newBrand };
    setBranding(updated);
    localStorage.setItem("fadzone_branding", JSON.stringify(updated));
  };

  // Restore Defaults
  const restoreAllDefaults = async () => {
    if (window.confirm("هل أنت متأكد من استعادة إعدادات وبيانات المتجر الافتراضية؟ سيتم مسح التغييرات المخصصة المخزنة محلياً.")) {
      localStorage.setItem("fadzone_products", JSON.stringify(PRODUCTS));
      localStorage.setItem("fadzone_categories", JSON.stringify(CATEGORIES));
      localStorage.setItem("fadzone_reviews", JSON.stringify(REVIEWS));
      localStorage.setItem("fadzone_faqs", JSON.stringify(FAQS));
      localStorage.setItem("fadzone_branding", JSON.stringify(DEFAULT_BRANDING));

      setProducts(PRODUCTS);
      setCategories(CATEGORIES);
      setReviews(REVIEWS);
      setFAQItem(FAQS);
      setBranding(DEFAULT_BRANDING);
      alert("تمت استعادة كافة البيانات الافتراضية بنجاح!");
    }
  };

  const activeTheme = THEME_COLOR_MAP[branding.themeColor] || THEME_COLOR_MAP.amber;

  return (
    <SiteDataContext.Provider
      value={{
        products,
        categories,
        reviews,
        faqs,
        branding,
        theme: activeTheme,
        isAdminMode,
        setIsAdminMode,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addReview,
        updateReview,
        deleteReview,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateBranding,
        restoreAllDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
};
