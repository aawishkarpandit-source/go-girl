import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(200).json({ products: null, source: "local" });
  }

  try {
    // GET /api/products
    if (req.method === "GET") {
      const { category, sort, limit, featured } = req.query;

      let query = supabase.from("products").select("*");

      if (featured === "true") {
        query = query.eq("featured", true);
      }
      if (category) {
        query = query.eq("category", category as string);
      }

      if (sort === "price-asc") query = query.order("price", { ascending: true });
      else if (sort === "price-desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      if (limit) query = query.limit(parseInt(limit as string));

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ products: data });
    }

    // POST /api/products — create
    if (req.method === "POST") {
      const { data, error } = await supabase
        .from("products")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ product: data });
    }

    // PUT /api/products?id=xxx — update
    if (req.method === "PUT") {
      const id = req.query.id as string;
      const { data, error } = await supabase
        .from("products")
        .update(req.body)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json({ product: data });
    }

    // DELETE /api/products?id=xxx — delete
    if (req.method === "DELETE") {
      const id = req.query.id as string;
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
