import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbGetProductById } from "../lib/api";
import { getProductById } from "../lib/products";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await dbGetProductById(id);
      if (data) {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      } else {
        const found = getProductById(id);
        if (found) {
          setProduct(found);
          if (found.sizes?.length) setSelectedSize(found.sizes[0]);
          if (found.colors?.length) setSelectedColor(found.colors[0]);
        }
      }
    }
    load();
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="pd-container">
          <div className="shop-loading">
            <div className="spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page page-enter">
      <div className="pd-container">
        <button className="pd-back hover-wobble" onClick={() => navigate(-1)}>← Back</button>
        <div className="pd-grid">
          <div className="pd-image-section anim-fade-left visible">
            <img src={product.image_url} alt={product.name} className="pd-image" />
          </div>
          <div className="pd-info">
            <span className="pd-category anim-fade-right visible" style={{ animationDelay: "0.1s" }}>{product.category}</span>
            <h1 className="pd-name anim-fade-right visible" style={{ animationDelay: "0.2s" }}>{product.name}</h1>
            <p className="pd-price anim-fade-right visible" style={{ animationDelay: "0.3s" }}>${product.price.toFixed(2)}</p>
            <p className="pd-description anim-fade-right visible" style={{ animationDelay: "0.4s" }}>{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className="pd-option anim-fade-up visible" style={{ animationDelay: "0.5s" }}>
                <label>Size</label>
                <div className="pd-options-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`pd-option-btn hover-jelly ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="pd-option anim-fade-up visible" style={{ animationDelay: "0.6s" }}>
                <label>Color</label>
                <div className="pd-options-row">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`pd-option-btn hover-jelly ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`pd-add-btn btn-ripple btn-shine anim-fade-up visible ${added ? "added" : ""}`}
              style={{ animationDelay: "0.7s" }}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
