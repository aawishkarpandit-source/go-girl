import type { Product } from "../types";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";

const STORAGE_KEY = "gg-admin-products";

export function getStoredProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data, fall through
  }
  return SAMPLE_PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return getStoredProducts().filter((p) => p.featured && p.in_stock);
}

export function getProductById(id: string): Product | undefined {
  return getStoredProducts().find((p) => p.id === id);
}
