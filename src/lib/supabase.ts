/* eslint-disable @typescript-eslint/no-explicit-any */
let clientInstance: any = null;

async function getClient(): Promise<any | null> {
  if (clientInstance) return clientInstance;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    clientInstance = createClient(url, key);
    return clientInstance;
  } catch {
    return null;
  }
}

export async function fetchProducts(category?: string, sort?: string) {
  const client = await getClient();
  if (!client) return null;
  try {
    let query = client.from("products").select("*").eq("in_stock", true);
    if (category) query = query.eq("category", category);
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    else if (sort === "price-desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function fetchFeaturedProducts() {
  const client = await getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("featured", true)
      .limit(4);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function fetchProductById(id: string) {
  const client = await getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from("products").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
