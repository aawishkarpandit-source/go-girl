import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../lib/supabase";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const CATEGORIES = [
  { name: "Dresses", slug: "dresses", emoji: "👗" },
  { name: "Tops", slug: "tops", emoji: "👚" },
  { name: "Bottoms", slug: "bottoms", emoji: "👖" },
  { name: "Accessories", slug: "accessories", emoji: "👜" },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchFeaturedProducts();
      if (data && data.length > 0) {
        setFeatured(data);
      } else {
        setFeatured(SAMPLE_PRODUCTS.filter((p) => p.featured));
      }
    }
    load();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">New Collection 2026</span>
          <h1 className="hero-title">
            Be Bold.<br />Be Beautiful.<br />Be <span className="highlight">You</span>.
          </h1>
          <p className="hero-description">
            Discover the latest trends in girls fashion. From everyday basics to
            stunning statement pieces — find your perfect look.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shape"></div>
          <div className="hero-shape shape-2"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="category-card"
              >
                <span className="category-emoji">{cat.emoji}</span>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Picks</h2>
            <Link to="/shop" className="view-all">
              View All →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="placeholder-products">
              <p>Featured products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Join the Go Girl Gang</h2>
            <p>
              Sign up for exclusive access to new arrivals, sales, and style tips
              delivered straight to your inbox.
            </p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Join Now</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
