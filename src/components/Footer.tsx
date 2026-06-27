import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">GG</span>
              <span className="logo-text">
                Go Girl <span className="logo-sub">Fashion</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Empowering girls to express their unique style through fashion.
              Be bold, be beautiful, be you.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/shop/dresses">Dresses</Link></li>
              <li><Link to="/shop/tops">Tops</Link></li>
              <li><Link to="/shop/accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Help</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Stay in the Loop</h4>
            <p>Subscribe for exclusive deals and new arrivals.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Go Girl Fashion Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
