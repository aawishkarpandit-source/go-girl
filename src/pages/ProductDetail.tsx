import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
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
    async function fetchProduct() {
      try {
        const { data } = await supabase.from("products").select("*").eq("id", id).single();
        if (data) {
          setProduct(data);
          if (data.sizes?.length) setSelectedSize(data.sizes[0]);
          if (data.colors?.length) setSelectedColor(data.colors[0]);
          return;
        }
      } catch {
        // Supabase not configured, use sample data
      }
      const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        if (found.sizes?.length) setSelectedSize(found.sizes[0]);
        if (found.colors?.length) setSelectedColor(found.colors[0]);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="pd-container">
          <p className="pd-loading">Loading...</p>
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
    <div className="product-detail-page">
      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="pd-grid">
          <div className="pd-image-section">
            <img src={product.image_url} alt={product.name} className="pd-image" />
          </div>
          <div className="pd-info">
            <span className="pd-category">{product.category}</span>
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-price">${product.price.toFixed(2)}</p>
            <p className="pd-description">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className="pd-option">
                <label>Size</label>
                <div className="pd-options-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`pd-option-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="pd-option">
                <label>Color</label>
                <div className="pd-options-row">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`pd-option-btn ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`pd-add-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
