import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Raj Kumar',
    role: 'Founder & CEO',
    bio: 'Passionate about custom printing with 10+ years of experience in the apparel industry.',
    icon: '👨‍💼'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Creative Director',
    bio: 'Bringing designs to life with innovative printing techniques and premium quality.',
    icon: '👩‍🎨'
  },
  {
    id: 3,
    name: 'Mike Chen',
    role: 'Operations Lead',
    bio: 'Ensuring fast turnaround times and reliable delivery for every customer.',
    icon: '👨‍💻'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Customer Success',
    bio: 'Making sure every customer has an amazing experience with Inkweave.',
    icon: '👩‍💼'
  },
];

const VALUES = [
  {
    icon: '🎯',
    title: 'Quality First',
    description: 'We never compromise on quality. Premium materials and expert craftsmanship in every piece.'
  },
  {
    icon: '⚡',
    title: 'Fast & Reliable',
    description: '3-5 day turnaround without sacrificing quality. Your designs, delivered on time.'
  },
  {
    icon: '🤝',
    title: 'Customer Centric',
    description: 'Your satisfaction is our priority. Dedicated support for every order, no matter the size.'
  },
  {
    icon: '🌱',
    title: 'Sustainable',
    description: 'Eco-friendly printing methods and ethical sourcing of materials for a better future.'
  },
  {
    icon: '💡',
    title: 'Innovation',
    description: 'Constantly improving our technology and processes to serve you better.'
  },
  {
    icon: '🌍',
    title: 'Community',
    description: 'Supporting local artists and creators with fair pricing and opportunities.'
  },
];

const STATS = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '50K+', label: 'Orders Printed' },
  { number: '24/7', label: 'Customer Support' },
  { number: '48hrs', label: 'Quick Delivery' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-blob about-blob-1" />
          <div className="about-blob about-blob-2" />
        </div>
        <div className="container about-hero-content">
          <h1>About Inkweave</h1>
          <p>Custom apparel printing with passion, quality, and creativity at the heart of everything we do.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                Inkweave was born from a simple idea: make premium custom apparel accessible to everyone. Founded in 2018, we started as a small print shop in Hyderabad with a vision to revolutionize the custom printing industry.
              </p>
              <p>
                What began as a passion project has grown into a trusted platform serving thousands of customers worldwide. Whether you're an individual looking to express yourself or a business promoting your brand, we're here to bring your vision to life.
              </p>
              <p>
                Our commitment to quality, innovation, and customer satisfaction has made us the go-to choice for custom apparel. We invest continuously in technology and talent to ensure every piece meets our high standards.
              </p>
              <div className="story-cta">
                <Link to="/customize" className="btn btn-primary btn-lg">Start Designing</Link>
              </div>
            </div>
            <div className="story-visual">
              <div className="visual-placeholder">📦 Crafting Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-alt">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <h2>Our Values</h2>
            <p className="section-sub">What drives us every day</p>
          </div>
          <div className="values-grid">
            {VALUES.map((value, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header center">
            <h2>Meet Our Team</h2>
            <p className="section-sub">Passionate people creating amazing experiences</p>
          </div>
          <div className="team-grid">
            {TEAM_MEMBERS.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.icon}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <h2>Why Choose Inkweave?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h4>Premium Quality</h4>
              <p>High-quality printing on premium apparel. Every piece is inspected for perfection.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h4>Easy Design Tool</h4>
              <p>Upload your design or use our intuitive design studio. No experience needed.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💨</div>
              <h4>Fast Delivery</h4>
              <p>3-5 business days from order to doorstep. Rush options available.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <h4>Affordable Pricing</h4>
              <p>Competitive prices with bulk discounts. No hidden charges or setup fees.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <h4>24/7 Support</h4>
              <p>Dedicated customer support team ready to help with any questions.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h4>100% Satisfaction</h4>
              <p>Not happy? We'll reprint or refund. Your satisfaction is guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header center">
            <h2>Our Process</h2>
            <p className="section-sub">Quality control at every step</p>
          </div>
          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">1</div>
              <div className="timeline-content">
                <h4>Design Upload</h4>
                <p>You upload your design and select product options</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2</div>
              <div className="timeline-content">
                <h4>Design Review</h4>
                <p>Our team reviews your design for print quality</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">3</div>
              <div className="timeline-content">
                <h4>Production</h4>
                <p>Your items are carefully printed using latest technology</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">4</div>
              <div className="timeline-content">
                <h4>Quality Check</h4>
                <p>Each piece is inspected to ensure perfect quality</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">5</div>
              <div className="timeline-content">
                <h4>Packaging</h4>
                <p>Carefully packaged to ensure safe delivery</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">6</div>
              <div className="timeline-content">
                <h4>Delivery</h4>
                <p>Shipped to your doorstep within 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <h2>Our Technology</h2>
            <p className="section-sub">State-of-the-art equipment for the best results</p>
          </div>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">🖨️</div>
              <h4>Digital Printing</h4>
              <p>Advanced digital printing technology for vibrant, long-lasting colors</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🌈</div>
              <h4>Full Color Support</h4>
              <p>Unlimited colors without additional setup costs</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">📐</div>
              <h4>Precision Alignment</h4>
              <p>Laser-guided positioning for perfect design placement every time</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🔬</div>
              <h4>Quality Testing</h4>
              <p>Rigorous testing to ensure durability and color fastness</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header center">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How long has Inkweave been in business?</h4>
              <p>Inkweave was founded in 2018 and has since grown to serve over 10,000 happy customers worldwide.</p>
            </div>
            <div className="faq-item">
              <h4>Do you ship internationally?</h4>
              <p>Currently, we ship within India. We're expanding our international shipping soon. Contact us for more details.</p>
            </div>
            <div className="faq-item">
              <h4>What makes Inkweave different?</h4>
              <p>Our commitment to quality, fast delivery, competitive pricing, and exceptional customer service sets us apart.</p>
            </div>
            <div className="faq-item">
              <h4>Can I collaborate with other designers?</h4>
              <p>Absolutely! You can share design links with teammates or hire designers through our platform.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, debit cards, digital wallets, and bank transfers.</p>
            </div>
            <div className="faq-item">
              <h4>How do I track my order?</h4>
              <p>You'll receive real-time tracking updates via email and SMS from order confirmation to delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Get in Touch</h2>
            <p>Have questions? Our friendly team is here to help. Reach out anytime!</p>
          </div>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href="mailto:hello@inkweave.com">hello@inkweave.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Location:</span>
              <p>Hyderabad, Telangana, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section section-accent">
        <div className="container">
          <div className="final-cta">
            <h2>Ready to Create Something Amazing?</h2>
            <p>Join thousands of happy customers. Start designing your custom apparel today!</p>
            <Link to="/customize" className="btn btn-primary btn-lg">Design Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
