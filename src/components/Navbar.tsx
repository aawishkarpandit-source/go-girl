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
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">GG</span>
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
          <li>
            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className={isActive("/shop") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive("/about") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={isActive("/contact") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={`cart-link ${isActive("/cart") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Cart
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
