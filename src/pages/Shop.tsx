import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../lib/supabase";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
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
    async function load() {
      setLoading(true);
      const sortParam = sortBy === "price-low" ? "price-asc" : sortBy === "price-high" ? "price-desc" : undefined;
      const categoryParam = category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : undefined;
      const data = await fetchProducts(categoryParam, sortParam);
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        let filtered = SAMPLE_PRODUCTS.filter((p) => p.in_stock);
        if (categoryParam) {
          filtered = filtered.filter((p) => p.category === categoryParam);
        }
        if (sortBy === "price-low") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
          filtered.sort((a, b) => b.price - a.price);
        } else {
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        setProducts(filtered);
      }
      setLoading(false);
    }
    load();
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
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
