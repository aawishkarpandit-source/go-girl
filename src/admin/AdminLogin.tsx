import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (password === adminPass) {
      localStorage.setItem("gg-admin-auth", "true");
      navigate("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card modal-enter">
        <div className="login-logo">
          <span className="login-logo-icon animate-pulse-glow">GG</span>
        </div>
        <h1>Admin Panel</h1>
        <p>Go Girl Fashion Store</p>
        <form onSubmit={handleSubmit}>
          <div className="login-field anim-fade-up stagger-2 visible">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter admin password"
              autoFocus
              className={error ? "shake" : ""}
            />
          </div>
          {error && <p className="login-error animate-shake">{error}</p>}
          <button type="submit" className="login-btn btn-ripple btn-shine anim-fade-up stagger-3 visible">
            Sign In
          </button>
        </form>
        <p className="login-hint anim-fade-up stagger-4 visible">Default: admin123</p>
      </div>
    </div>
  );
}
