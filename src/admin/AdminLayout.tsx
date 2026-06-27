import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

interface Props {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/products", label: "Products", icon: "👗" },
  { path: "/admin/orders", label: "Orders", icon: "📦" },
  { path: "/admin/messages", label: "Messages", icon: "💬" },
];

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("gg-admin-auth");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">
            <span className="sidebar-logo-icon">GG</span>
            <span className="sidebar-logo-text">Admin</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <span className="sidebar-icon">🌐</span>
            View Store
          </Link>
          <button className="sidebar-link logout" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="header-right">
            <span className="header-admin">Admin</span>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
