import React from 'react';
import TopBar from '../components/TopBar';

const benefits = [
  { icon: '🌬️', title: 'Purifies Air', desc: 'Plants absorb CO₂ and release oxygen, improving air quality and reducing pollutants in both indoor and outdoor environments.' },
  { icon: '🧘', title: 'Mental Wellbeing', desc: 'Spending time with plants reduces stress, anxiety, and depression. Gardening is proven to boost mood and emotional wellbeing.' },
  { icon: '🌡️', title: 'Climate Control', desc: 'Trees and plants cool the environment through shade and transpiration, reducing urban heat islands by up to 5°C.' },
  { icon: '🦋', title: 'Biodiversity', desc: 'Plants provide habitat and food for insects, birds, and animals, supporting entire ecosystems and preserving biodiversity.' },
  { icon: '💧', title: 'Water Conservation', desc: 'Vegetation helps retain soil moisture, reduce runoff, and recharge groundwater, preventing floods and drought.' },
  { icon: '🌾', title: 'Food Security', desc: 'Growing your own plants — herbs, vegetables, fruits — contributes to food security, nutrition, and sustainable living.' },
  { icon: '🏥', title: 'Medicinal Value', desc: 'Neem, Tulsi, Aloe Vera and hundreds of plants have powerful medicinal properties used in traditional and modern medicine.' },
  { icon: '♻️', title: 'Soil Health', desc: 'Plant roots prevent soil erosion, decomposing matter enriches nutrients, and root systems improve soil structure.' },
];

const AboutPage = () => {
  return (
    <>
      <TopBar showTitle={false} />
      <div className="page-container">
        <div className="about-hero">
          <h1>🌿 About Ecoistic Friendly</h1>
          <p>
            Ecoistic Friendly is a community plant tracking initiative dedicated to documenting
            the growth of plants, saplings and trees. Every plant recorded here is a step toward
            a greener, healthier tomorrow.
          </p>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-title"><span>📞</span> Initiator Contact</div>
          <div className="contact-card">
            <div className="contact-item"><span>👤</span><span><strong>Eco Initiative Lead</strong></span></div>
            <div className="contact-item"><span>📱</span><span>+91 98765 43210</span></div>
            <div className="contact-item"><span>📧</span><span>ecoistic.friendly@gmail.com</span></div>
            <div className="contact-item"><span>📍</span><span>Karnataka, India</span></div>
          </div>
        </div>

        {/* Mission */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-title"><span>🎯</span> Our Mission</div>
          <div className="settings-section">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
              Our mission is simple: <strong>plant more, grow together, inspire all.</strong> We believe that even
              a single sapling can make a difference. By documenting each plant's journey from seed to full growth,
              we inspire others to take action for the environment. Small steps, big impact — together we can make
              the world greener.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <div className="section-title"><span>🌱</span> Why Plants Matter</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {benefits.map((b, i) => (
              <div className="benefit-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-content">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={{ margin: '24px 0', padding: '20px', background: 'linear-gradient(135deg, var(--green-dark), var(--green-mid))', borderRadius: 'var(--radius)', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>🌳</div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
            "The best time to plant a tree was 20 years ago.<br />The second best time is now."
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 8 }}>— Chinese Proverb</p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
