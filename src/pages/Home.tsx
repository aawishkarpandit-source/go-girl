import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dbGetFeatured } from "../lib/api";
import { useInView } from "../hooks/useInView";
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
  const catAnim = useInView(0.1);
  const featAnim = useInView(0.1);
  const ctaAnim = useInView(0.1);

  useEffect(() => {
    async function load() {
      const data = await dbGetFeatured();
      setFeatured(data || []);
    }
    load();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag" style={{ animation: "slideInDown 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
            ✨ New Collection 2026
          </span>
          <h1 className="hero-title">
            <span style={{ animation: "slideText 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>Be Bold.</span>
            <br />
            <span style={{ animation: "slideText 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>Be Beautiful.</span>
            <br />
            <span style={{ animation: "slideText 0.6s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>Be </span>
            <span className="highlight text-gradient" style={{ animation: "slideText 0.6s cubic-bezier(0.16,1,0.3,1) 1s both" }}>You</span>
            <span className="hero-cursor" style={{ animation: "blink 0.8s step-end infinite 1.2s" }}>|</span>
          </h1>
          <p className="hero-description" style={{ animation: "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 1.2s both" }}>
            Discover the latest trends in girls fashion. From everyday basics to
            stunning statement pieces — find your perfect look.
          </p>
          <div className="hero-actions" style={{ animation: "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 1.4s both" }}>
            <Link to="/shop" className="btn btn-primary btn-ripple btn-shine">
              Shop Now
            </Link>
            <Link to="/about" className="btn btn-outline hover-glow">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shape animate-float" style={{ animation: "heroShapeFloat1 8s ease-in-out infinite" }}></div>
          <div className="hero-shape shape-2 animate-float-slow" style={{ animation: "heroShapeFloat2 10s ease-in-out infinite 0.5s" }}></div>
          <div className="hero-particle p1">✦</div>
          <div className="hero-particle p2">◆</div>
          <div className="hero-particle p3">✦</div>
          <div className="hero-particle p4">★</div>
          <div className="hero-particle p5">◆</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" ref={catAnim.ref}>
        <div className="section-container">
          <h2 className={`section-title anim-fade-up ${catAnim.inView ? "visible" : ""}`}>
            Shop by Category
          </h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={`category-card anim-scale hover-lift hover-glow stagger-${i + 1} ${catAnim.inView ? "visible" : ""}`}
              >
                <span className="category-emoji hover-wobble">{cat.emoji}</span>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section" ref={featAnim.ref}>
        <div className="section-container">
          <div className="section-header">
            <h2 className={`section-title anim-fade-left ${featAnim.inView ? "visible" : ""}`}>
              Featured Picks
            </h2>
            <Link to="/shop" className={`view-all anim-fade-right hover-scale ${featAnim.inView ? "visible" : ""}`}>
              View All →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map((product, i) => (
                <div
                  key={product.id}
                  className={`anim-fade-up stagger-${i + 1} ${featAnim.inView ? "visible" : ""}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder-products anim-blur visible">
              <p>Featured products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaAnim.ref}>
        <div className="section-container">
          <div className={`cta-content anim-scale ${ctaAnim.inView ? "visible" : ""}`}>
            <h2 className="text-gradient">Join the Go Girl Gang</h2>
            <p>Sign up for exclusive access to new arrivals, sales, and style tips delivered straight to your inbox.</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="hover-border" />
              <button type="submit" className="btn-ripple btn-shine">Join Now</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
