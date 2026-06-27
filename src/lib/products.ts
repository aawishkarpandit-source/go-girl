import type { Product } from "../types";

const STORAGE_KEY = "gg-admin-products";

export function getStoredProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted data
  }
  return [];
}

export function setStoredProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getFeaturedProducts(): Product[] {
  return getStoredProducts().filter((p) => p.featured && p.in_stock);
}

export function getProductById(id: string): Product | undefined {
  return getStoredProducts().find((p) => p.id === id);
}
