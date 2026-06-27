import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import "./ProductCard.css";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/product/${product.id}`} className="product-card hover-lift">
      <div className="product-image-wrapper">
        <img src={product.image_url} alt={product.name} className="product-image" />
        {product.featured && <span className="product-badge animate-pulse-glow">Featured</span>}
        <div className="product-overlay">
          <span className="overlay-text">Quick View</span>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category animate-color-cycle">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
