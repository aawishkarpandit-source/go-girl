import { useEffect, useState } from "react";
import { formatPrice } from "../lib/format";
import "./AdminOrders.css";

interface Order {
  id: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("gg-admin-orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const updateStatus = (id: string, status: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("gg-admin-orders", JSON.stringify(updated));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

  return (
    <div className="admin-orders page-enter">
      <h1 className="admin-page-title anim-fade-up visible">Orders</h1>
      <p className="admin-page-sub anim-fade-up stagger-1 visible">{orders.length} orders total</p>

      <div className="order-filters anim-fade-up stagger-2 visible">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && <span className="filter-count">{statusCounts[s] || 0}</span>}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filtered.length === 0 ? (
          <div className="orders-empty anim-scale visible">No orders found.</div>
        ) : (
          filtered.map((order, i) => (
            <div key={order.id} className="order-card anim-fade-up visible hover-lift" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="order-header">
                <div>
                  <span className="order-id">#{order.id}</span>
                  <span className="order-date">{order.date}</span>
                </div>
                <div className="order-header-right">
                  <span className="order-total">{formatPrice(order.total)}</span>
                  <select
                    className={`status-select status-${order.status}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="order-email">📧 {order.email}</p>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
