import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const msg = {
      id: `msg-${Date.now()}`,
      name: data.get("name") as string,
      email: data.get("email") as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
      date: new Date().toISOString(),
      read: false,
    };
    const existing = JSON.parse(localStorage.getItem("gg-admin-messages") || "[]");
    localStorage.setItem("gg-admin-messages", JSON.stringify([msg, ...existing]));
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>Have a question, suggestion, or just want to say hi? We'd love to hear from you!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <h3>Visit Us</h3>
              <p>123 Fashion Avenue<br />Style City, SC 10001</p>
            </div>
            <div className="info-card">
              <span className="info-icon">📧</span>
              <h3>Email Us</h3>
              <p>hello@gogirlfashion.com</p>
            </div>
            <div className="info-card">
              <span className="info-icon">📞</span>
              <h3>Call Us</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="form-success">
                <span className="success-icon">🎉</span>
                <h3>Message Sent!</h3>
                <p>We'll get back to you soon. Thanks for reaching out!</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
