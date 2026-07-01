export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  features: string[];
  specifications: Specification[];
  isFeatured: boolean;
  isLatest: boolean;
  isBestSeller: boolean;
  isOffer: boolean;
  stockStatus: "متوفر" | "محدود جداً" | "نفذت الكمية";
  trendingCount?: number; // e.g. 14 people are viewing this
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Corresponding to Lucide icon name
  description: string;
}
