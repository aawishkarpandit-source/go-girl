import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

const CATEGORY_MAP: Record<string, string> = {
  dresses: "Dresses",
  tops: "Tops",
  bottoms: "Bottoms",
  accessories: "Accessories",
};

export default function Shop() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select("*").eq("in_stock", true);

      if (category && CATEGORY_MAP[category]) {
        query = query.eq("category", CATEGORY_MAP[category]);
      }

      if (sortBy === "price-low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [category, sortBy]);

  return (
    <div className="shop-page">
      <div className="shop-container">
        <div className="shop-header">
          <h1>{category ? CATEGORY_MAP[category] || "Shop" : "All Products"}</h1>
          <div className="shop-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="shop-loading">Loading...</div>
        ) : products.length > 0 ? (
          <div className="shop-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <p>No products found. Add some products to your Supabase database!</p>
          </div>
        )}
      </div>
    </div>
  );
}
