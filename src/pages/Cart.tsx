import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { dbCreateOrder } from "../lib/api";
import "./Cart.css";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderPlaced {
  id: string;
  total: number;
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({ name: "", email: "", phone: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<OrderPlaced | null>(null);

  const handlePlaceOrder = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      alert("Please fill all fields");
      return;
    }

    setPlacing(true);

    const orderItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor,
    }));

    const orderPayload = {
      items: orderItems,
      email: form.email,
      name: form.name,
      phone: form.phone,
      address: form.address,
      total: totalPrice,
    };

    const apiResult = await dbCreateOrder(orderPayload);

    const localOrder = {
      id: `ord-${Date.now()}`,
      email: form.email,
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: orderItems,
      total: totalPrice,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };

    const stored = localStorage.getItem("gg-admin-orders");
    const orders = stored ? JSON.parse(stored) : [];
    orders.unshift(localOrder);
    localStorage.setItem("gg-admin-orders", JSON.stringify(orders));

    setOrderPlaced({
      id: apiResult?.id || localOrder.id,
      total: totalPrice,
    });

    clearCart();
    setPlacing(false);
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="order-confirmation anim-scale visible">
            <span className="confirm-icon animate-float">✅</span>
            <h1>Order Placed!</h1>
            <p className="confirm-id">Order #{orderPlaced.id}</p>
            <p className="confirm-total">Total: {formatPrice(orderPlaced.total)}</p>
            <p className="confirm-msg">We will contact you soon to confirm your order.</p>
            <Link to="/shop" className="btn btn-primary btn-ripple btn-shine">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  <p className="cart-item-price">{formatPrice(item.product.price)}</p>
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
            <h2>{checkout ? "Checkout" : "Order Summary"}</h2>

            {!checkout && (
              <>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-gradient" style={{ WebkitTextFillColor: "transparent", fontWeight: 600 }}>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </>
            )}

            {checkout && (
              <div className="checkout-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street, City, District"
                  />
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            )}

            {!checkout ? (
              <button
                className="btn btn-primary btn-ripple btn-shine checkout-btn"
                onClick={() => setCheckout(true)}
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                className="btn btn-primary btn-ripple btn-shine checkout-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            )}

            {checkout && (
              <button className="clear-cart-btn hover-shake" onClick={() => setCheckout(false)}>
                Back to Cart
              </button>
            )}

            {!checkout && (
              <button className="clear-cart-btn hover-shake" onClick={clearCart}>Clear Cart</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
