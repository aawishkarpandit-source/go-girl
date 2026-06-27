import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import "./Footer.css";

export default function Footer() {
  const anim = useInView(0.1);

  return (
    <footer className="footer" ref={anim.ref}>
      <div className="footer-container">
        <div className={`footer-grid anim-fade-up ${anim.inView ? "visible" : ""}`}>
          <div className="footer-brand">
            <Link to="/" className="footer-logo hover-scale">
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

          <div className={`footer-links anim-fade-up stagger-1 ${anim.inView ? "visible" : ""}`}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop" className="hover-wobble">Shop All</Link></li>
              <li><Link to="/shop/dresses" className="hover-wobble">Dresses</Link></li>
              <li><Link to="/shop/tops" className="hover-wobble">Tops</Link></li>
              <li><Link to="/shop/accessories" className="hover-wobble">Accessories</Link></li>
            </ul>
          </div>

          <div className={`footer-links anim-fade-up stagger-2 ${anim.inView ? "visible" : ""}`}>
            <h4>Help</h4>
            <ul>
              <li><Link to="/about" className="hover-wobble">About Us</Link></li>
              <li><Link to="/contact" className="hover-wobble">Contact</Link></li>
              <li><a href="#" className="hover-wobble">Shipping Info</a></li>
              <li><a href="#" className="hover-wobble">Returns</a></li>
            </ul>
          </div>

          <div className={`footer-newsletter anim-fade-up stagger-3 ${anim.inView ? "visible" : ""}`}>
            <h4>Stay in the Loop</h4>
            <p>Subscribe for exclusive deals and new arrivals.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="hover-border" />
              <button type="submit" className="btn-ripple btn-shine">Subscribe</button>
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
