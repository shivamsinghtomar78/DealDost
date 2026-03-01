import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString("en-IN")}`;
}

export function calculateDiscount(original: number, deal: number): number {
  return Math.round(((original - deal) / original) * 100);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function getCountdown(expiresAt: Date | string): { hours: number; minutes: number; seconds: number; expired: boolean } {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = Math.max(0, expiry.getTime() - now.getTime());

  if (diff === 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export const PLATFORM_COLORS: Record<string, string> = {
  Amazon: "#FF9900",
  Flipkart: "#2874F0",
  Myntra: "#FF3F6C",
  Zepto: "#8B2CF5",
  Blinkit: "#F8D000",
  Instamart: "#FC8019",
  Meesho: "#9B2D8E",
  BigBasket: "#84C225",
  Nykaa: "#FC2779",
  Ajio: "#3D3D3D",
  "Tata Cliq": "#CC0066",
};

export const DISH_EMOJIS: Record<string, string> = {
  "Street Snacks": "SN",
  "Heavy Meals": "HM",
  "Non-Veg": "NV",
  "South Indian": "SI",
  "Cafe & Drinks": "CF",
  "Fast Food": "FF",
  "Sweets & Desserts": "SD",
};

export const DEAL_CATEGORIES = [
  "All", "Grocery", "Fashion", "Electronics", "Beauty", "Home", "Food", "Sports", "Books"
] as const;

export const QUICK_COMMERCE = ["Zepto", "Blinkit", "Instamart", "BigBasket", "Dunzo"];
export const ECOMMERCE = ["Amazon", "Flipkart", "Myntra", "Meesho", "Nykaa", "Ajio", "Tata Cliq"];
