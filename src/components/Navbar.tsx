import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo hover-scale">
          <span className="logo-icon animate-pulse-glow">GG</span>
          <span className="logo-text">
            Go Girl <span className="logo-sub">Fashion</span>
          </span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li style={{ animation: "fadeInDown 0.3s ease 0.1s both" }}>
            <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li style={{ animation: "fadeInDown 0.3s ease 0.15s both" }}>
            <Link to="/shop" className={isActive("/shop") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
          </li>
          <li style={{ animation: "fadeInDown 0.3s ease 0.2s both" }}>
            <Link to="/about" className={isActive("/about") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li style={{ animation: "fadeInDown 0.3s ease 0.25s both" }}>
            <Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
          <li style={{ animation: "fadeInDown 0.3s ease 0.3s both" }}>
            <Link to="/cart" className={`cart-link ${isActive("/cart") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              Cart
              {totalItems > 0 && <span className="cart-badge animate-bounce-in">{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
