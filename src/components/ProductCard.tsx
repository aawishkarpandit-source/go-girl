import { Link } from "react-router-dom";
import type { Product } from "../types";
import "./ProductCard.css";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image_url} alt={product.name} className="product-image" />
        {product.featured && <span className="product-badge">Featured</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
