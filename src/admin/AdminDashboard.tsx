import { useEffect, useState } from "react";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import type { Product } from "../types";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<{ total: number; status: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("gg-admin-products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(SAMPLE_PRODUCTS);
    }
    const storedOrders = localStorage.getItem("gg-admin-orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="admin-dash">
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Welcome back! Here's your store overview.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(233,30,140,0.1)", color: "#e91e8c" }}>👗</div>
          <div>
            <p className="stat-value">{products.length}</p>
            <p className="stat-label">Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>📦</div>
          <div>
            <p className="stat-value">{orders.length}</p>
            <p className="stat-label">Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>💰</div>
          <div>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            <p className="stat-label">Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>⏳</div>
          <div>
            <p className="stat-value">{pendingOrders}</p>
            <p className="stat-label">Pending</p>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Recent Products</h3>
          <div className="dash-list">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="dash-list-item">
                <img src={p.image_url} alt={p.name} className="dash-list-img" />
                <div>
                  <p className="dash-list-name">{p.name}</p>
                  <p className="dash-list-meta">${p.price.toFixed(2)} · {p.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a href="/admin/products" className="quick-action">➕ Add Product</a>
            <a href="/admin/orders" className="quick-action">📋 View Orders</a>
            <a href="/shop" className="quick-action" target="_blank">🌐 View Store</a>
          </div>
        </div>
      </div>
    </div>
  );
}
