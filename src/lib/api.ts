import type { Product } from "../types";

const BASE = "/api/products";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

export async function dbGetProducts(category?: string, sort?: string): Promise<Product[] | null> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  const res = await apiFetch<{ products: Product[] | null }>(`${BASE}?${qs}`);
  return res?.products ?? null;
}

export async function dbGetFeatured(): Promise<Product[] | null> {
  const res = await apiFetch<{ products: Product[] | null }>(`${BASE}?featured=true&limit=4`);
  return res?.products ?? null;
}

export async function dbGetProductById(id: string): Promise<Product | null> {
  const res = await apiFetch<{ products: Product[] }>(`${BASE}?id=${id}`);
  if (res?.products?.length) return res.products[0];
  // Single product endpoint fallback
  const all = await apiFetch<{ products: Product[] }>(BASE);
  return all?.products?.find((p) => p.id === id) ?? null;
}

export async function dbCreateProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  const res = await apiFetch<{ product: Product }>(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res?.product ?? null;
}

export async function dbUpdateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const res = await apiFetch<{ product: Product }>(`${BASE}?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res?.product ?? null;
}

export async function dbDeleteProduct(id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`${BASE}?id=${id}`, {
    method: "DELETE",
  });
  return res?.ok === true;
}
