import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const { category, sort, limit } = req.query;

      let query = supabase
        .from("products")
        .select("*")
        .eq("in_stock", true);

      if (category) {
        query = query.eq("category", category as string);
      }

      if (sort === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (sort === "price-desc") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (limit) {
        query = query.limit(parseInt(limit as string));
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ products: data });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
