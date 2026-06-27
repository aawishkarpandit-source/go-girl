import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Helper that returns null if Supabase isn't configured
export async function fetchProducts(category?: string, sort?: string) {
  const client = getSupabase();
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
  const client = getSupabase();
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
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from("products").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

// Keep a default export for backward compat, but it may be null
export const supabase = getSupabase();
