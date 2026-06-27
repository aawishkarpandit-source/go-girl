import { useState } from "react";
import { useInView } from "../hooks/useInView";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const infoAnim = useInView(0.1);
  const formAnim = useInView(0.1);

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
        <div className="contact-header page-enter">
          <h1>Get in Touch</h1>
          <p>Have a question, suggestion, or just want to say hi? We'd love to hear from you!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info" ref={infoAnim.ref}>
            <div className={`info-card anim-fade-left stagger-1 hover-lift ${infoAnim.inView ? "visible" : ""}`}>
              <span className="info-icon animate-float">📍</span>
              <h3>Visit Us</h3>
              <p>123 Fashion Avenue<br />Style City, SC 10001</p>
            </div>
            <div className={`info-card anim-fade-left stagger-2 hover-lift ${infoAnim.inView ? "visible" : ""}`}>
              <span className="info-icon animate-float-slow">📧</span>
              <h3>Email Us</h3>
              <p>hello@gogirlfashion.com</p>
            </div>
            <div className={`info-card anim-fade-left stagger-3 hover-lift ${infoAnim.inView ? "visible" : ""}`}>
              <span className="info-icon animate-float-rotate">📞</span>
              <h3>Call Us</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>

          <div className="contact-form-wrapper" ref={formAnim.ref}>
            {submitted ? (
              <div className="form-success anim-scale visible">
                <span className="success-icon animate-bounce-in">🎉</span>
                <h3>Message Sent!</h3>
                <p>We'll get back to you soon. Thanks for reaching out!</p>
              </div>
            ) : (
              <form className={`contact-form anim-fade-right ${formAnim.inView ? "visible" : ""}`} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required className="hover-border" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required className="hover-border" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required className="hover-border" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required className="hover-border"></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-ripple btn-shine">
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
