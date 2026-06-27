import { useEffect, useState } from "react";
import "./AdminMessages.css";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gg-admin-messages");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  const markRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem("gg-admin-messages", JSON.stringify(updated));
  };

  const deleteMessage = (id: string) => {
    if (!confirm("Delete this message?")) return;
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem("gg-admin-messages", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="admin-messages">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Messages</h1>
          <p className="admin-page-sub">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="messages-empty">
          <span className="empty-icon">💬</span>
          <p>No messages yet.</p>
          <p className="empty-sub">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="messages-layout">
          <div className="messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-item ${!msg.read ? "unread" : ""} ${selected?.id === msg.id ? "selected" : ""}`}
                onClick={() => openMessage(msg)}
              >
                <div className="message-item-header">
                  <span className="message-sender">{msg.name}</span>
                  <span className="message-date">{formatDate(msg.date)}</span>
                </div>
                <p className="message-subject">{msg.subject}</p>
                <p className="message-preview">{msg.message.slice(0, 80)}...</p>
              </div>
            ))}
          </div>

          <div className="message-detail">
            {selected ? (
              <>
                <div className="detail-header">
                  <div>
                    <h2 className="detail-subject">{selected.subject}</h2>
                    <p className="detail-meta">
                      From <strong>{selected.name}</strong> · {selected.email}
                    </p>
                    <p className="detail-date">{formatDate(selected.date)}</p>
                  </div>
                  <button
                    className="btn-delete-msg"
                    onClick={() => deleteMessage(selected.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="detail-body">
                  <p>{selected.message}</p>
                </div>
                <div className="detail-actions">
                  <a href={`mailto:${selected.email}`} className="btn-reply">
                    Reply via Email
                  </a>
                </div>
              </>
            ) : (
              <div className="detail-empty">
                <span>👈</span>
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
