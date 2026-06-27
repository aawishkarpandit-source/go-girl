import { useInView } from "../hooks/useInView";
import "./About.css";

export default function About() {
  const heroAnim = useInView(0.1);
  const contentAnim = useInView(0.1);
  const valuesAnim = useInView(0.1);

  return (
    <div className="about-page">
      <div className="about-container">
        <section className="about-hero">
          <div ref={heroAnim.ref}>
            <h1 className={`anim-scale ${heroAnim.inView ? "visible" : ""}`}>Our Story</h1>
            <p className={`about-subtitle anim-fade-up stagger-1 ${heroAnim.inView ? "visible" : ""}`}>
              Fashion isn't just about clothes — it's about confidence, identity,
              and the freedom to express who you are.
            </p>
          </div>
        </section>

        <section className="about-content" ref={contentAnim.ref}>
          <div className="about-grid">
            <div className={`about-text anim-fade-left ${contentAnim.inView ? "visible" : ""}`}>
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
            <div className="about-values" ref={valuesAnim.ref}>
              <div className={`value-card anim-fade-right stagger-1 hover-lift ${valuesAnim.inView ? "visible" : ""}`}>
                <span className="value-icon animate-float">✨</span>
                <h3>Quality First</h3>
                <p>Premium fabrics and craftsmanship in every piece.</p>
              </div>
              <div className={`value-card anim-fade-right stagger-2 hover-lift ${valuesAnim.inView ? "visible" : ""}`}>
                <span className="value-icon animate-float-slow">💪</span>
                <h3>Empowerment</h3>
                <p>Fashion that makes you feel unstoppable.</p>
              </div>
              <div className={`value-card anim-fade-right stagger-3 hover-lift ${valuesAnim.inView ? "visible" : ""}`}>
                <span className="value-icon animate-float-rotate">🌿</span>
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
