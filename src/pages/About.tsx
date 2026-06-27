import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <section className="about-hero">
          <h1>Our Story</h1>
          <p className="about-subtitle">
            Fashion isn't just about clothes — it's about confidence, identity,
            and the freedom to express who you are.
          </p>
        </section>

        <section className="about-content">
          <div className="about-grid">
            <div className="about-text">
              <h2>Hey, we're Go Girl!</h2>
              <p>
                Born from a passion for empowering young women, Go Girl Fashion is
                where style meets self-expression. We believe every girl deserves to
                feel amazing in what she wears — whether she's heading to school,
                hanging with friends, or stepping out for a special occasion.
              </p>
              <p>
                Our collections are curated with love, featuring the latest trends
                alongside timeless classics. From casual everyday pieces to
                show-stopping outfits, we've got something for every mood and moment.
              </p>
            </div>
            <div className="about-values">
              <div className="value-card">
                <span className="value-icon">✨</span>
                <h3>Quality First</h3>
                <p>Premium fabrics and craftsmanship in every piece.</p>
              </div>
              <div className="value-card">
                <span className="value-icon">💪</span>
                <h3>Empowerment</h3>
                <p>Fashion that makes you feel unstoppable.</p>
              </div>
              <div className="value-card">
                <span className="value-icon">🌿</span>
                <h3>Sustainability</h3>
                <p>Mindful production for a better tomorrow.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
