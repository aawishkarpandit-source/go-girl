import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dbGetProducts } from "../lib/api";
import { getStoredProducts, setStoredProducts } from "../lib/products";
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
      const categoryParam = category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : undefined;
      const sortParam = sortBy === "price-low" ? "price-asc" : sortBy === "price-high" ? "price-desc" : undefined;

      const data = await dbGetProducts(categoryParam, sortParam);
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        let stored = getStoredProducts();
        if (stored.length === 0) {
          stored = SAMPLE_PRODUCTS;
          setStoredProducts(stored);
        }
        let filtered = stored.filter((p) => p.in_stock);
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
    <div className="shop-page page-enter">
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="anim-fade-left visible">{category ? CATEGORY_MAP[category] || "Shop" : "All Products"}</h1>
          <div className="shop-controls anim-fade-right visible">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="hover-border">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="shop-loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="shop-grid">
            {products.map((product, i) => (
              <div
                key={product.id}
                className={`anim-fade-up visible`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-empty anim-scale visible">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
