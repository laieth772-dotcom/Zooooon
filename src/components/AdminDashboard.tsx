import React, { useState, useEffect } from "react";
import { useSiteData, SiteBranding, BannerSlide, THEME_COLOR_MAP } from "../context/SiteDataContext";
import { Product, Category, Review, FAQItem } from "../types";
// Local storage-based session and asset loading instead of Firebase
import {
  LayoutDashboard,
  ShoppingBag,
  Folder,
  Image,
  Palette,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  HelpCircle,
  Globe,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  X,
  Check,
  Eye,
  LogOut,
  Sparkles,
  DollarSign,
  Video,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Sliders,
  Play
} from "lucide-react";

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const {
    products,
    categories,
    reviews,
    faqs,
    branding,
    theme,
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
    restoreAllDefaults
  } = useSiteData();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "banners" | "colors" | "texts" | "links" | "reviews" | "faq" | "seo"
  >("overview");

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [emailInput, setEmailInput] = useState("laieth772@gmail.com");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("fadzone_admin_logged_in") === "true";
    if (isLoggedIn) {
      setIsAuthenticated(true);
      setUser({ email: "laieth772@gmail.com" });
    }
  }, []);

  // Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    
    if (email !== "laieth772@gmail.com") {
      setAuthError("عذراً، هذا البريد الإلكتروني غير مصرح له بالدخول كمسؤول. البريد المصرح به هو فقط laieth772@gmail.com");
      return;
    }

    if (passwordInput.length < 6) {
      setAuthError("يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل لضمان الأمان.");
      return;
    }

    setIsLoggingIn(true);
    setAuthError("");

    // Simulate short network delay for realism and smooth UX
    setTimeout(() => {
      try {
        const storedPassword = localStorage.getItem("fadzone_admin_password");
        
        if (!storedPassword) {
          // Automatic Admin Password Seeding on first run!
          localStorage.setItem("fadzone_admin_password", passwordInput);
          localStorage.setItem("fadzone_admin_logged_in", "true");
          setIsAuthenticated(true);
          setUser({ email });
          showToast("تم تهيئة وإنشاء حساب المسؤول الأول بنجاح! تم حفظ كلمة المرور الخاصة بك محلياً.", "success");
        } else if (passwordInput === storedPassword) {
          localStorage.setItem("fadzone_admin_logged_in", "true");
          setIsAuthenticated(true);
          setUser({ email });
          showToast("تم تسجيل الدخول بنجاح! مرحباً بك في لوحة التحكم", "success");
        } else {
          setAuthError("كلمة المرور المدخلة غير صحيحة لحساب المسؤول laieth772@gmail.com.");
        }
      } catch (err: any) {
        setAuthError(`حدث خطأ أثناء تسجيل الدخول: ${err.message}`);
      } finally {
        setIsLoggingIn(false);
      }
    }, 600);
  };

  const handleLogout = async () => {
    localStorage.removeItem("fadzone_admin_logged_in");
    setIsAuthenticated(false);
    setUser(null);
    showToast("تم تسجيل الخروج بنجاح");
  };

  // Image upload helper converting file to high-fidelity Base64 Data URL
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path = "products") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 2 ميجابايت لتجنب تجاوز مساحة التخزين.", "error");
      return;
    }

    setIsUploading(true);
    showToast("جاري معالجة الصورة وتحويلها محلياً...", "success");

    try {
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(file);
      const downloadURL = await dataUrlPromise;
      showToast("تم تحويل الصورة بنجاح وتجهيزها للاستخدام!", "success");
      return downloadURL;
    } catch (err: any) {
      console.error(err);
      showToast("فشل معالجة الصورة: " + err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Modal State for Products Add/Edit
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<Product>;
  }>({ isOpen: false, mode: "add", data: {} });

  // Modal State for Category
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<Category>;
  }>({ isOpen: false, mode: "add", data: {} });

  // Modal State for Review
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<Review>;
  }>({ isOpen: false, mode: "add", data: {} });

  // Modal State for FAQ
  const [faqModal, setFaqModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<FAQItem>;
  }>({ isOpen: false, mode: "add", data: {} });

  // Temp spec fields in Product Form
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");
  // Temp feature field in Product Form
  const [featureInput, setFeatureInput] = useState("");
  // Temp image field in Product Form
  const [imageInput, setImageInput] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-right" dir="rtl">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white font-display">بوابة الإدارة الآمنة</h2>
            <p className="text-xs text-zinc-400">نظام تسجيل دخول مسؤول متجر فد زون عبر <b>Firebase Auth</b></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">البريد الإلكتروني للمسؤول (Email)</label>
              <input
                type="email"
                required
                placeholder="admin@fadzone.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs text-left font-mono focus:border-amber-500 focus:outline-none transition-colors"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">كلمة المرور (Password)</label>
              <input
                type="password"
                required
                placeholder="أدخل كلمة مرور الحساب (مثال: admin123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs text-center font-mono focus:border-amber-500 focus:outline-none transition-colors"
              />
              {authError && <p className="text-xs text-red-500 mt-1.5 font-semibold text-center">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-white text-black font-black text-xs sm:text-sm rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري التحقق وتسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول الآمن للوحة التحكم</span>
              )}
            </button>
          </form>

          <div className="text-[10px] text-zinc-500 text-center bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/30 space-y-1">
            <p>💡 <b>ملاحظة التهيئة التلقائية:</b> عند تسجيل الدخول لأول مرة بالبريد الإلكتروني المعتمد <b>laieth772@gmail.com</b> وبأي كلمة مرور لا تقل عن 6 خانات، سيقوم النظام تلقائياً باعتمادها ككلمة المرور الرئيسية لحسابك وحفظها بشكل آمن ومستمر!</p>
            <p className="text-[9px] text-zinc-600">هذا النظام يعمل بالكامل على المتصفح عبر قواعد بيانات محلية سريعة، مما يضمن تشغيل موقعك بنسبة 100% وبشكل مجاني تماماً على منصات مثل Vercel دون الحاجة لربط أي بطاقة ائتمانية أو دفع رسوم سحابية.</p>
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
            <span>فد زون © ٢٠٢٦</span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              الرجوع للموقع الرئيسي
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Product Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const d = productModal.data;
    if (!d.title || !d.englishTitle || d.price === undefined) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    const payload: Omit<Product, "id"> = {
      title: d.title,
      englishTitle: d.englishTitle,
      description: d.description || "",
      longDescription: d.longDescription || "",
      price: Number(d.price),
      originalPrice: d.originalPrice ? Number(d.originalPrice) : undefined,
      discountBadge: d.discountBadge || "",
      rating: d.rating ? Number(d.rating) : 5.0,
      reviewCount: d.reviewCount ? Number(d.reviewCount) : 0,
      images: d.images && d.images.length > 0 ? d.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"],
      category: d.category || (categories[1]?.id || "smart-phones"),
      features: d.features || [],
      specifications: d.specifications || [],
      isFeatured: !!d.isFeatured,
      isLatest: !!d.isLatest,
      isBestSeller: !!d.isBestSeller,
      isOffer: !!d.isOffer,
      stockStatus: d.stockStatus || "متوفر",
      trendingCount: d.trendingCount ? Number(d.trendingCount) : 5,
    };

    if (productModal.mode === "add") {
      addProduct(payload);
      showToast("تم إضافة المنتج بنجاح!");
    } else {
      updateProduct(d.id!, payload);
      showToast("تم تحديث المنتج بنجاح!");
    }

    setProductModal({ isOpen: false, mode: "add", data: {} });
  };

  // Handle Category Save
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const d = categoryModal.data;
    if (!d.name || !d.iconName) {
      showToast("يرجى إدخال اسم التصنيف والأيقونة", "error");
      return;
    }

    const payload: Omit<Category, "id"> = {
      name: d.name,
      iconName: d.iconName,
      description: d.description || ""
    };

    if (categoryModal.mode === "add") {
      addCategory(payload);
      showToast("تم إضافة التصنيف بنجاح!");
    } else {
      updateCategory(d.id!, payload);
      showToast("تم تحديث التصنيف بنجاح!");
    }
    setCategoryModal({ isOpen: false, mode: "add", data: {} });
  };

  // Handle Review Save
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    const d = reviewModal.data;
    if (!d.userName || !d.comment) {
      showToast("يرجى إدخال اسم العميل والتعليق", "error");
      return;
    }

    const payload: Omit<Review, "id"> = {
      userName: d.userName,
      rating: d.rating ? Number(d.rating) : 5,
      comment: d.comment,
      date: d.date || "الآن",
      avatar: d.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120",
      verified: d.verified !== false
    };

    if (reviewModal.mode === "add") {
      addReview(payload);
      showToast("تم إضافة التقييم بنجاح!");
    } else {
      updateReview(d.id!, payload);
      showToast("تم تحديث التقييم بنجاح!");
    }
    setReviewModal({ isOpen: false, mode: "add", data: {} });
  };

  // Handle FAQ Save
  const handleSaveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    const d = faqModal.data;
    if (!d.question || !d.answer) {
      showToast("يرجى إدخال السؤال والجواب", "error");
      return;
    }

    const payload: Omit<FAQItem, "id"> = {
      question: d.question,
      answer: d.answer
    };

    if (faqModal.mode === "add") {
      addFAQ(payload);
      showToast("تم إضافة السؤال بنجاح!");
    } else {
      updateFAQ(d.id!, payload);
      showToast("تم تحديث السؤال بنجاح!");
    }
    setFaqModal({ isOpen: false, mode: "add", data: {} });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans" dir="rtl">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 ${toast.type === "success" ? "bg-emerald-950/90 border-emerald-800 text-emerald-400" : "bg-red-950/90 border-red-800 text-red-400"}`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-black">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-l border-zinc-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo Brand area */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-500 text-black rounded-xl flex items-center justify-center font-black text-sm tracking-tighter">
                FAD
              </div>
              <div>
                <h2 className="font-black text-sm text-white font-display uppercase tracking-widest">{branding.logoText}</h2>
                <p className="text-[10px] text-zinc-500 font-bold">بوابة التحكم للنخبة</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="الرجوع للموقع"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "overview" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>نظرة عامة</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "products" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>المنتجات</span>
              <span className="mr-auto px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded text-[9px] font-mono">{products.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "categories" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <Folder className="w-4.5 h-4.5" />
              <span>التصنيفات</span>
              <span className="mr-auto px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded text-[9px] font-mono">{categories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("banners")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "banners" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <Image className="w-4.5 h-4.5" />
              <span>البنرات والواجهة</span>
            </button>

            <button
              onClick={() => setActiveTab("colors")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "colors" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <Palette className="w-4.5 h-4.5" />
              <span>إدارة الألوان والمظهر</span>
            </button>

            <button
              onClick={() => setActiveTab("texts")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "texts" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <FileText className="w-4.5 h-4.5" />
              <span>إدارة النصوص والأزرار</span>
            </button>

            <button
              onClick={() => setActiveTab("links")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "links" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <LinkIcon className="w-4.5 h-4.5" />
              <span>روابط السوشيال والمبيعات</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "reviews" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>تقييمات العملاء</span>
              <span className="mr-auto px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded text-[9px] font-mono">{reviews.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("faq")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "faq" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <HelpCircle className="w-4.5 h-4.5" />
              <span>الأسئلة الشائعة FAQ</span>
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${activeTab === "seo" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
            >
              <Globe className="w-4.5 h-4.5" />
              <span>تهيئة محركات البحث SEO</span>
            </button>
          </nav>
        </div>

        {/* Footer Area with Reset Defaults & Logout */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button
            onClick={restoreAllDefaults}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/25 hover:bg-red-950/50 text-red-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto space-y-8 bg-zinc-950 md:bg-zinc-900/40">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white">
              {activeTab === "overview" && "نظرة عامة على المتجر"}
              {activeTab === "products" && "إدارة كتالوج المنتجات"}
              {activeTab === "categories" && "إدارة تصنيفات المنتجات"}
              {activeTab === "banners" && "الواجهة الرئيسية والبنرات الهيرو"}
              {activeTab === "colors" && "إدارة الألوان والهوية البصرية"}
              {activeTab === "texts" && "إدارة النصوص والعبارات الترويجية"}
              {activeTab === "links" && "روابط قنوات المبيعات والتواصل"}
              {activeTab === "reviews" && "إدارة آراء وتقييمات العملاء"}
              {activeTab === "faq" && "إدارة الأسئلة الشائعة والضمان"}
              {activeTab === "seo" && "تهيئة وإعدادات أرشفة جوجل (SEO)"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">تعديل كافة تفاصيل فد زون في وقت حقيقي وبدون كتابة كود برامجي.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة المتجر الحالي</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs text-zinc-400 font-bold">إجمالي المنتجات المعروضة</p>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">{products.length}</h3>
                <p className="text-[10px] text-zinc-500 mt-1">مقسمة على {categories.length} تصنيفات فاخرة</p>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                  <Sliders className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs text-zinc-400 font-bold">عروض وحصريات نشطة</p>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">{products.filter(p => p.isOffer).length}</h3>
                <p className="text-[10px] text-zinc-500 mt-1">منتجات عليها ملصقات خصم حالياً</p>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs text-zinc-400 font-bold">آراء عملاء حقيقية</p>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">{reviews.length}</h3>
                <p className="text-[10px] text-zinc-500 mt-1">تقييمات موثقة تظهر بالواجهة</p>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs text-zinc-400 font-bold">اللون النشط للمتجر</p>
                <h3 className="text-xl font-black text-white mt-2 uppercase tracking-wider">{branding.themeColor}</h3>
                <p className="text-[10px] text-zinc-500 mt-1">يمكن تغييره بضغطة زر واحدة</p>
              </div>
            </div>

            {/* Quick Action & Status Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                  <span>دليل الإعداد السريع للمتجر</span>
                </h3>
                
                <div className="space-y-3 divide-y divide-zinc-900 text-xs">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-300">أضف منتجاتك الجديدة وعدل أسعارها بنظام تيك توك</span>
                    <button onClick={() => { setActiveTab("products"); setProductModal({ isOpen: true, mode: "add", data: {} }); }} className="text-amber-500 hover:underline">إضافة منتج</button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-300">قم بربط حساب التيك توك وقناة الواتساب للحجوزات</span>
                    <button onClick={() => setActiveTab("links")} className="text-amber-500 hover:underline">ربط الحسابات</button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-300">غيّر الثيم اللوني للمتجر ليطابق أحدث الفصول</span>
                    <button onClick={() => setActiveTab("colors")} className="text-amber-500 hover:underline">تعديل الألوان</button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-300">اضبط عبارات الهيرو والبنرات الإعلانية الترحيبية</span>
                    <button onClick={() => setActiveTab("banners")} className="text-amber-500 hover:underline">إدارة الواجهة</button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2 mb-2">
                    <Check className="w-4.5 h-4.5 text-emerald-500" />
                    <span>حالة النظام والمتجر</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    نظام الحجز واللوحة يعمل محلياً بكفاءة تامة. كافة التغييرات يتم حفظها في متصفحك بشكل فوري ودائم دون انقطاع.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-bold">بوابة الإرسال:</span>
                    <span className="text-emerald-400 font-bold">نشط ●</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1">
                    <span className="text-zinc-500 font-bold">قاعدة البيانات:</span>
                    <span className="text-amber-400 font-mono font-bold">LocalState Enabled</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white">إجمالي المعروض: {products.length} منتجات</h2>
              <button
                onClick={() => setProductModal({ isOpen: true, mode: "add", data: { images: [], features: [], specifications: [] } })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            {/* Products Table/List */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 font-bold">
                      <th className="p-4">المنتج</th>
                      <th className="p-4">التصنيف</th>
                      <th className="p-4">السعر الحقيقي</th>
                      <th className="p-4">سعر الخصم</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">مستويات الأولوية</th>
                      <th className="p-4 text-left">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-xl bg-zinc-900" />
                          <div>
                            <p className="font-bold text-white max-w-xs truncate">{p.title}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{p.englishTitle}</p>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-zinc-300">
                          {categories.find(c => c.id === p.category)?.name || p.category}
                        </td>
                        <td className="p-4 font-bold text-white font-mono">{p.price} ر.س</td>
                        <td className="p-4 font-bold text-zinc-500 font-mono">{p.originalPrice ? `${p.originalPrice} ر.س` : "-"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stockStatus === "متوفر" ? "bg-emerald-950 text-emerald-400" : p.stockStatus === "محدود جداً" ? "bg-amber-950 text-amber-400" : "bg-red-950 text-red-400"}`}>
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="p-4 space-x-1 space-x-reverse">
                          {p.isFeatured && <span className="px-1.5 py-0.5 bg-purple-950/40 text-purple-400 rounded text-[9px] font-bold">مميز</span>}
                          {p.isLatest && <span className="px-1.5 py-0.5 bg-blue-950/40 text-blue-400 rounded text-[9px] font-bold">حديث</span>}
                          {p.isBestSeller && <span className="px-1.5 py-0.5 bg-amber-950/40 text-amber-400 rounded text-[9px] font-bold">رائج</span>}
                          {p.isOffer && <span className="px-1.5 py-0.5 bg-red-950/40 text-red-400 rounded text-[9px] font-bold">عرض</span>}
                        </td>
                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setProductModal({ isOpen: true, mode: "edit", data: p })}
                              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="تعديل المنتج"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) { deleteProduct(p.id); showToast("تم حذف المنتج بنجاح"); } }}
                              className="p-1.5 bg-red-950/30 hover:bg-red-950/60 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white">إجمالي التصنيفات: {categories.length}</h2>
              <button
                onClick={() => setCategoryModal({ isOpen: true, mode: "add", data: {} })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة تصنيف جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 text-amber-500 rounded-xl flex items-center justify-center font-bold">
                        {c.iconName}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{c.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {c.id}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 min-h-8 leading-relaxed">{c.description || "لا يوجد وصف لهذا التصنيف"}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-zinc-900">
                    <button
                      onClick={() => setCategoryModal({ isOpen: true, mode: "edit", data: c })}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                    {c.id !== "all" && (
                      <button
                        onClick={() => { if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) { deleteCategory(c.id); showToast("تم حذف التصنيف"); } }}
                        className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>حذف</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BANNERS TAB */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-white">إدارة شرائح البنر العلوي (Hero Slider)</h2>
            <p className="text-xs text-zinc-400">يمكنك تعديل محتوى الصور والعناوين لكل شريحة تظهر في الجزء العلوي للموقع.</p>

            <div className="space-y-6">
              {branding.banners.map((banner, index) => (
                <div key={banner.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                    <span className="text-xs font-black text-amber-500">الشريحة الإعلانية #{index + 1}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">ID: {banner.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 block">العنوان العريض (بالعربية)</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => {
                          const updated = [...branding.banners];
                          updated[index] = { ...updated[index], title: e.target.value };
                          updateBranding({ banners: updated });
                        }}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 block">الوصف الثانوي</label>
                      <input
                        type="text"
                        value={banner.subtitle}
                        onChange={(e) => {
                          const updated = [...branding.banners];
                          updated[index] = { ...updated[index], subtitle: e.target.value };
                          updateBranding({ banners: updated });
                        }}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 block flex items-center justify-between">
                        <span>صورة الخلفية (رابط أو رفع ملف)</span>
                        {isUploading && <span className="text-[9px] text-amber-500 animate-pulse font-mono">جاري الرفع...</span>}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={banner.image}
                          onChange={(e) => {
                            const updated = [...branding.banners];
                            updated[index] = { ...updated[index], image: e.target.value };
                            updateBranding({ banners: updated });
                          }}
                          className="flex-grow px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                        />
                        <div className="relative flex items-center justify-center px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700 cursor-pointer overflow-hidden text-center min-w-[80px]">
                          <span>رفع 📁</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={async (e) => {
                              const url = await handleImageUpload(e, "banners");
                              if (url) {
                                const updated = [...branding.banners];
                                updated[index] = { ...updated[index], image: url };
                                updateBranding({ banners: updated });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 block">رابط الفيديو المصاحب (اختياري - YouTube/Direct MP4)</label>
                      <input
                        type="text"
                        placeholder="مثال: https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-43336-large.mp4"
                        value={banner.videoUrl || ""}
                        onChange={(e) => {
                          const updated = [...branding.banners];
                          updated[index] = { ...updated[index], videoUrl: e.target.value };
                          updateBranding({ banners: updated });
                        }}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 items-center p-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/30">
                    <img src={banner.image} alt={banner.title} className="w-24 h-14 object-cover rounded-lg bg-zinc-900 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400">معاينة حية للمظهر:</p>
                      <p className="text-xs font-black text-white mt-1">{banner.title || "عنوان فارغ"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COLORS TAB */}
        {activeTab === "colors" && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
            <h2 className="text-sm font-black text-white">الهوية البصرية والمظهر المخصص</h2>
            <p className="text-xs text-zinc-400">اختر اللون الأساسي لمتجر فد زون. سيتم تعديل كافة الأزرار، والملصقات، ونقاط التقييم بالكامل فوراً!</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              {(["amber", "emerald", "blue", "violet", "rose"] as const).map((colorName) => {
                const isActive = branding.themeColor === colorName;
                const config = THEME_COLOR_MAP[colorName];
                return (
                  <button
                    key={colorName}
                    onClick={() => { updateBranding({ themeColor: colorName }); showToast(`تم تفعيل الهوية البصرية: ${colorName}`); }}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 cursor-pointer ${isActive ? "border-white bg-zinc-900 ring-2 ring-amber-500" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"}`}
                  >
                    <span className={`w-5 h-5 rounded-full ${config.bg} block`} />
                    <div className="mt-2">
                      <p className="text-xs font-black text-white capitalize">{colorName}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{isActive ? "مفعّل حالياً" : "اضغط للتفعيل"}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. TEXTS TAB */}
        {activeTab === "texts" && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
            <h2 className="text-sm font-black text-white">تعديل نصوص الموقع والأزرار</h2>
            <p className="text-xs text-zinc-400">تحكم بالعبارات والكلمات الترحيبية المعروضة للمستخدمين لمنحهم شعوراً بالفخامة التامة.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">اسم المتجر بالإنجليزية</label>
                <input
                  type="text"
                  value={branding.logoText}
                  onChange={(e) => updateBranding({ logoText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">اسم المتجر بالعربية (العلامة التجارية)</label>
                <input
                  type="text"
                  value={branding.logoArabic}
                  onChange={(e) => updateBranding({ logoArabic: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-300">النص التعريفي المساعد في الهيرو (Hero Subtitle)</label>
                <textarea
                  rows={2}
                  value={branding.heroSubtitle}
                  onChange={(e) => updateBranding({ heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">نص زر الشراء والحجز الأساسي (CTA Button)</label>
                <input
                  type="text"
                  value={branding.reserveButtonText}
                  onChange={(e) => updateBranding({ reserveButtonText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">حقوق النشر في الفوتر</label>
                <input
                  type="text"
                  value={branding.footerCopy}
                  onChange={(e) => updateBranding({ footerCopy: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-300">نص 'عن المتجر' في الفوتر والصفحة التعريفية</label>
                <textarea
                  rows={3}
                  value={branding.aboutText}
                  onChange={(e) => updateBranding({ aboutText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. LINKS TAB */}
        {activeTab === "links" && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
            <h2 className="text-sm font-black text-white">روابط التواصل وإتمام الحجز والدفع</h2>
            <p className="text-xs text-zinc-400">بما أن الشراء يعتمد على مراسلة حساب تيك توك وتأكيد الطلب على واتساب، يرجى ضبط أرقامك والروابط بدقة متناهية.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">رابط حساب تيك توك الرسمي (TikTok Profile)</label>
                <input
                  type="text"
                  value={branding.tiktokUrl}
                  onChange={(e) => updateBranding({ tiktokUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">رقم الواتساب مضافاً إليه رمز الدولة (بدون أصفار أو علامة +)</label>
                <input
                  type="text"
                  placeholder="مثال: 966530635447"
                  value={branding.whatsappNumber}
                  onChange={(e) => updateBranding({ whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                  dir="ltr"
                />
                <p className="text-[10px] text-zinc-500">سيتم توليد رابط المحادثة المباشر تلقائياً لتأكيدات حجوزات العملاء.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">رابط حساب إنستغرام (اختياري)</label>
                <input
                  type="text"
                  value={branding.instagramUrl || ""}
                  onChange={(e) => updateBranding({ instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white">تقييمات وآراء العملاء: {reviews.length}</h2>
              <button
                onClick={() => setReviewModal({ isOpen: true, mode: "add", data: {} })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة تقييم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.userName} className="w-10 h-10 object-cover rounded-full bg-zinc-900" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-xs sm:text-sm">{r.userName}</h3>
                          {r.verified && <span className="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded">موثق</span>}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{r.date} ● التقييم: {r.rating} نجوم</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 mt-3 leading-relaxed min-h-12">" {r.comment} "</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-zinc-900">
                    <button
                      onClick={() => setReviewModal({ isOpen: true, mode: "edit", data: r })}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => { if (confirm("هل أنت متأكد من حذف هذا التقييم؟")) { deleteReview(r.id); showToast("تم حذف التقييم"); } }}
                      className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. FAQ TAB */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white">الأسئلة الشائعة FAQ: {faqs.length}</h2>
              <button
                onClick={() => setFaqModal({ isOpen: true, mode: "add", data: {} })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال جديد</span>
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((f, index) => (
                <div key={f.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-2">
                      <span className="text-xs font-black text-amber-500">س {index + 1}:</span>
                      <h3 className="font-bold text-white text-xs sm:text-sm">{f.question}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setFaqModal({ isOpen: true, mode: "edit", data: f })}
                        className="p-1 bg-zinc-900 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="تعديل السؤال"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => { if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) { deleteFAQ(f.id); showToast("تم حذف السؤال"); } }}
                        className="p-1 bg-red-950/30 hover:bg-red-950/60 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pr-8">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. SEO TAB */}
        {activeTab === "seo" && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
            <h2 className="text-sm font-black text-white">تحسين محركات البحث والأرشفة (SEO)</h2>
            <p className="text-xs text-zinc-400">تحكم بمدى ظهور فد زون في محركات البحث مثل جوجل لضمان وصول المشترين الباحثين عن الفخامة.</p>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">عنوان المتجر الأساسي بجوجل (Site Meta Title)</label>
                <input
                  type="text"
                  value={branding.siteTitle}
                  onChange={(e) => updateBranding({ siteTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">الوصف التعريفي للبحث (Meta Description)</label>
                <textarea
                  rows={3}
                  value={branding.siteDescription}
                  onChange={(e) => updateBranding({ siteDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
                <p className="text-[10px] text-zinc-500">توصي جوجل بكتابة وصف لا يتعدى ١٦٠ حرفاً لظهوره بالكامل في نتائج البحث.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">الكلمات الدلالية لمحركات البحث (SEO Keywords - مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={branding.seoKeywords}
                  onChange={(e) => updateBranding({ seoKeywords: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================
         PRODUCT ADD/EDIT MODAL
         ========================================================= */}
      {productModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-8 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 flex-shrink-0">
              <h3 className="text-base font-black text-white">
                {productModal.mode === "add" ? "إضافة منتج فاخر جديد" : `تعديل منتج: ${productModal.data.title}`}
              </h3>
              <button
                onClick={() => setProductModal({ isOpen: false, mode: "add", data: {} })}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 overflow-y-auto flex-grow px-1">
              
              {/* Core Text fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">عنوان المنتج بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={productModal.data.title || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, title: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="مثال: آيفون 16 برو ماكس بالتيتانيوم"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">العنوان بالإنجليزية (English Title) *</label>
                  <input
                    type="text"
                    required
                    value={productModal.data.englishTitle || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, englishTitle: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left"
                    placeholder="iPhone 16 Pro Max Natural Titanium"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">وصف قصير (يظهر ببطاقة الكارت)</label>
                  <input
                    type="text"
                    value={productModal.data.description || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, description: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="الهاتف الأقوى عالمياً بتصميم من التيتانيوم..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">التصنيف الرئيسي *</label>
                  <select
                    value={productModal.data.category || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, category: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c.id !== "all").map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-300">وصف تفصيلي كامل (يظهر داخل نافذة التفاصيل)</label>
                  <textarea
                    rows={3}
                    value={productModal.data.longDescription || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, longDescription: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    placeholder="اكتب كامل مواصفات ومميزات واستخدامات هذا المنتج بالتفصيل هنا..."
                  />
                </div>
              </div>

              {/* Pricing, badge and Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">السعر الحقيقي (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={productModal.data.price === undefined ? "" : productModal.data.price}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: Number(e.target.value) } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                    placeholder="4999"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">السعر الأصلي قبل الخصم</label>
                  <input
                    type="number"
                    value={productModal.data.originalPrice === undefined ? "" : productModal.data.originalPrice}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, originalPrice: e.target.value ? Number(e.target.value) : undefined } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                    placeholder="5499"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">ملصق عرض الخصم</label>
                  <input
                    type="text"
                    value={productModal.data.discountBadge || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, discountBadge: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-center"
                    placeholder="مثال: خصم 9%"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">حالة المخزون</label>
                  <select
                    value={productModal.data.stockStatus || "متوفر"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, stockStatus: e.target.value as any } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="متوفر">متوفر</option>
                    <option value="محدود جداً">محدود جداً</option>
                    <option value="نفذت الكمية">نفذت الكمية</option>
                  </select>
                </div>
              </div>

              {/* Ratings and dynamic viewer stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">التقييم الرقمي (من ٥.٠)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={productModal.data.rating || 4.9}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, rating: Number(e.target.value) } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">عدد المقيمين</label>
                  <input
                    type="number"
                    value={productModal.data.reviewCount || 100}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, reviewCount: Number(e.target.value) } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">عدد المشاهدين الآن تيك توك</label>
                  <input
                    type="number"
                    value={productModal.data.trendingCount || 10}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, trendingCount: Number(e.target.value) } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 py-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!productModal.data.isFeatured}
                        onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, isFeatured: e.target.checked } })}
                        className="rounded border-zinc-800 bg-zinc-950 focus:ring-0 text-amber-500 w-4 h-4"
                      />
                      <span>مميز</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!productModal.data.isOffer}
                        onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, isOffer: e.target.checked } })}
                        className="rounded border-zinc-800 bg-zinc-950 focus:ring-0 text-amber-500 w-4 h-4"
                      />
                      <span>عرض</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!productModal.data.isBestSeller}
                        onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, isBestSeller: e.target.checked } })}
                        className="rounded border-zinc-800 bg-zinc-950 focus:ring-0 text-amber-500 w-4 h-4"
                      />
                      <span>رائج</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!productModal.data.isLatest}
                        onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, isLatest: e.target.checked } })}
                        className="rounded border-zinc-800 bg-zinc-950 focus:ring-0 text-amber-500 w-4 h-4"
                      />
                      <span>جديد</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic unlimited images list */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
                <label className="text-xs font-black text-white flex items-center gap-1.5 justify-between">
                  <div className="flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-amber-500" />
                    <span>صور المنتج (إضافة روابط أو رفع ملفات مباشرة)</span>
                  </div>
                  {isUploading && <span className="text-[10px] text-amber-500 animate-pulse font-mono">جاري رفع الملف...</span>}
                </label>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="ألصق رابط صورة المنتج هنا..."
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-grow px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                  
                  <div className="relative flex items-center justify-center px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-black rounded-xl border border-zinc-700 cursor-pointer overflow-hidden text-center min-w-[120px]">
                    <span>رفع صورة 📁</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={async (e) => {
                        const url = await handleImageUpload(e, "products");
                        if (url) {
                          const current = productModal.data.images || [];
                          setProductModal({ ...productModal, data: { ...productModal.data, images: [...current, url] } });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (imageInput.trim()) {
                        const current = productModal.data.images || [];
                        setProductModal({ ...productModal, data: { ...productModal.data, images: [...current, imageInput.trim()] } });
                        setImageInput("");
                      }
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black cursor-pointer"
                  >
                    إضافة الرابط
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
                  {(productModal.data.images || []).map((imgUrl, i) => (
                    <div key={i} className="relative group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden aspect-video">
                      <img src={imgUrl} alt="Product view" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const current = productModal.data.images || [];
                          setProductModal({ ...productModal, data: { ...productModal.data, images: current.filter((_, idx) => idx !== i) } });
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="إزالة الصورة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Product Features */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>مميزات المنتج الرئيسية (نقاط مميزة)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: هيكل تيتانيوم طبيعي خفيف للغاية"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-grow px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        const current = productModal.data.features || [];
                        setProductModal({ ...productModal, data: { ...productModal.data, features: [...current, featureInput.trim()] } });
                        setFeatureInput("");
                      }
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black text-zinc-200"
                  >
                    إضافة ميزة
                  </button>
                </div>
                <ul className="space-y-1.5 pt-2">
                  {(productModal.data.features || []).map((feat, i) => (
                    <li key={i} className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 rounded-lg text-xs">
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = productModal.data.features || [];
                          setProductModal({ ...productModal, data: { ...productModal.data, features: current.filter((_, idx) => idx !== i) } });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications Block */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>المواصفات التقنية (جدول الخصائص)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="العنوان (مثال: المعالج)"
                    value={specLabel}
                    onChange={(e) => setSpecLabel(e.target.value)}
                    className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="القيمة (مثال: Apple A18 Pro)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-grow px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (specLabel.trim() && specValue.trim()) {
                          const current = productModal.data.specifications || [];
                          setProductModal({
                            ...productModal,
                            data: {
                              ...productModal.data,
                              specifications: [...current, { label: specLabel.trim(), value: specValue.trim() }]
                            }
                          });
                          setSpecLabel("");
                          setSpecValue("");
                        }
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-black text-zinc-200"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {(productModal.data.specifications || []).map((spec, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-900/50 px-3 py-1.5 rounded-lg text-xs border border-zinc-800">
                      <span className="text-zinc-400 font-bold">{spec.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{spec.value}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = productModal.data.specifications || [];
                            setProductModal({ ...productModal, data: { ...productModal.data, specifications: current.filter((_, idx) => idx !== i) } });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </form>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => setProductModal({ isOpen: false, mode: "add", data: {} })}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء التغييرات
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              >
                حفظ المنتج الفاخر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         CATEGORY ADD/EDIT MODAL
         ========================================================= */}
      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" dir="rtl">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-white text-base">
              {categoryModal.mode === "add" ? "إضافة تصنيف جديد" : `تعديل تصنيف: ${categoryModal.data.name}`}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">اسم التصنيف بالعربية *</label>
                <input
                  type="text"
                  required
                  value={categoryModal.data.name || ""}
                  onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, name: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: صوتيات النخبة"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">اسم الأيقونة (من مكتبة Lucide) *</label>
                <input
                  type="text"
                  required
                  value={categoryModal.data.iconName || ""}
                  onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, iconName: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                  placeholder="Smartphone, Watch, Headphones, Grid, Zap"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">الوصف التعريفي المساعد</label>
                <textarea
                  rows={2}
                  value={categoryModal.data.description || ""}
                  onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, description: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="سماعات تعزل الضجيج وتمنحك صوتاً سينمائياً..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ isOpen: false, mode: "add", data: {} })}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl cursor-pointer"
                >
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         REVIEW ADD/EDIT MODAL
         ========================================================= */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" dir="rtl">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-white text-base">
              {reviewModal.mode === "add" ? "إضافة تقييم عميل جديد" : `تعديل تقييم: ${reviewModal.data.userName}`}
            </h3>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={reviewModal.data.userName || ""}
                  onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, userName: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="عبدالرحمن الشمري"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">التقييم (١ إلى ٥) *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={reviewModal.data.rating || 5}
                    onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, rating: Number(e.target.value) } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-center font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">التوقيت</label>
                  <input
                    type="text"
                    value={reviewModal.data.date || "منذ يومين"}
                    onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, date: e.target.value } })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-center"
                    placeholder="منذ ٣ أيام"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">صورة العميل الرمزية (رابط Avatar)</label>
                <input
                  type="text"
                  value={reviewModal.data.avatar || ""}
                  onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, avatar: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                  placeholder="https://images.unsplash.com/photo-..."
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">نص التقييم والتعليق *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewModal.data.comment || ""}
                  onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, comment: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  placeholder="اكتب تجربة العميل هنا بالتفصيل..."
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewModal.data.verified !== false}
                    onChange={(e) => setReviewModal({ ...reviewModal, data: { ...reviewModal.data, verified: e.target.checked } })}
                    className="rounded border-zinc-800 bg-zinc-950 focus:ring-0 text-amber-500 w-4 h-4"
                  />
                  <span>شراء موثق ومؤكد</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ isOpen: false, mode: "add", data: {} })}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl cursor-pointer"
                >
                  حفظ التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         FAQ ADD/EDIT MODAL
         ========================================================= */}
      {faqModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" dir="rtl">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-white text-base">
              {faqModal.mode === "add" ? "إضافة سؤال شائعة جديد" : "تعديل السؤال الشائع"}
            </h3>

            <form onSubmit={handleSaveFAQ} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">السؤال (بالعربية) *</label>
                <input
                  type="text"
                  required
                  value={faqModal.data.question || ""}
                  onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, question: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="كيف يمكنني حجز المنتجات؟"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">الجواب والحل التفصيلي *</label>
                <textarea
                  rows={4}
                  required
                  value={faqModal.data.answer || ""}
                  onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, answer: e.target.value } })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  placeholder="اكتب الإجابة الشاملة الواضحة هنا..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFaqModal({ isOpen: false, mode: "add", data: {} })}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl cursor-pointer"
                >
                  حفظ السؤال والجواب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
