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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(200).json({ order: null, source: "local" });
  }

  try {
    if (req.method === "POST") {
      const { items, email, name, phone, address, total } = req.body;

      if (!items || !email || !total) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_email: email,
          user_name: name,
          user_phone: phone,
          user_address: address,
          items: items,
          total: total,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ order: data });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Order API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
