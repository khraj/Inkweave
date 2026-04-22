import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { id: 'round-neck', label: 'Round Neck', icon: '👕' },
  { id: 'polo', label: 'Polo', icon: '🏌️' },
  { id: 'v-neck', label: 'V-Neck', icon: '✌️' },
  { id: 'hoodie', label: 'Hoodies', icon: '🧥' },
  { id: 'tank-top', label: 'Tank Tops', icon: '🩱' },
];

const STEPS = [
  { n: '01', title: 'Choose Your Base', desc: 'Pick from our range of premium quality shirts, hoodies, and more.' },
  { n: '02', title: 'Add Your Design', desc: 'Upload your artwork or use our design tool to craft something unique.' },
  { n: '03', title: 'We Print & Ship', desc: 'High-quality printing with fast delivery straight to your door.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=4').then(({ data }) => setProducts(data.products || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-tag">🎨 Custom Printing Studio</div>
          <h1 className="hero-title">
            Wear Your<br />
            <span className="hero-accent">Story.</span>
          </h1>
          <p className="hero-desc">
            Premium quality custom t-shirt printing. Upload your design, pick your style,
            and get it delivered to your doorstep. Minimum 1 piece.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
            <Link to="/customize" className="btn btn-outline btn-lg">Design Custom →</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10,000+</strong><span>Happy Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>50+</strong><span>Print Styles</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>48hr</strong><span>Quick Delivery</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Style</h2>
            <Link to="/products" className="section-link">View All →</Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="section-link">See All →</Link>
          </div>
          {loading ? (
            <div className="products-skeleton">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <h2>How It Works</h2>
            <p className="section-sub">Simple 3-step process to your custom shirt</p>
          </div>
          <div className="steps-grid">
            {STEPS.map(step => (
              <div key={step.n} className="step-card">
                <div className="step-number">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to create something amazing?</h2>
            <p>Start with as little as 1 piece. Bulk discounts available for 10+ orders.</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">Order Now</Link>
        </div>
      </section>
    </div>
  );
}
