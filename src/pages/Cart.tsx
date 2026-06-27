import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="page-enter">Your Cart</h1>
          <div className="cart-empty anim-scale visible">
            <span className="empty-cart-icon animate-float">🛒</span>
            <p>Your cart is empty!</p>
            <Link to="/shop" className="btn btn-primary btn-ripple">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="page-enter">Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, i) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="cart-item anim-fade-left visible"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-meta">
                    Size: {item.selectedSize} | Color: {item.selectedColor}
                  </p>
                  <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                      }
                      className="hover-scale"
                    >
                      −
                    </button>
                    <span className="animate-pulse">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                      }
                      className="hover-scale"
                    >
                      +
                    </button>
                  </div>
                  <button className="remove-btn hover-shake" onClick={() =>
                    removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                  }>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary anim-fade-right visible">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-gradient" style={{ WebkitTextFillColor: "transparent", fontWeight: 600 }}>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-ripple btn-shine checkout-btn">Proceed to Checkout</button>
            <button className="clear-cart-btn hover-shake" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
