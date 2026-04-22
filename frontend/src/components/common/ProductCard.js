import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url || `https://via.placeholder.com/400x400/f0efe9/888?text=${encodeURIComponent(product.name)}`;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={img} alt={product.name} className="product-img" />
        <div className="product-badge-wrap">
          {product.customizable && <span className="product-badge">✏️ Customizable</span>}
        </div>
        <div className="product-overlay">
          <span className="view-btn">View Details →</span>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <div className="product-colors">
            {product.colors?.slice(0, 4).map(c => (
              <span key={c.hex} className="color-dot" style={{ background: c.hex }}
                title={c.name} />
            ))}
            {(product.colors?.length || 0) > 4 && (
              <span className="color-more">+{product.colors.length - 4}</span>
            )}
          </div>
          <div className="product-price">
            <span className="price-from">from</span>
            <span className="price-val">₹{product.basePrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
