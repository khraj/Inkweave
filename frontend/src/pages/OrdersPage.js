import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './OrdersPage.css';

const STATUS_STEPS = ['placed','confirmed','designing','printing','quality-check','shipped','delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const getStatusIdx = (status) => STATUS_STEPS.indexOf(status);

  if (loading) return (
    <div className="page flex-center" style={{ minHeight: '60vh' }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (orders.length === 0) return (
    <div className="page flex-center" style={{ minHeight: '70vh' }}>
      <div className="empty-state">
        <div className="icon">📦</div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="page orders-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {selected ? (
          <div className="order-detail fade-in">
            <button className="btn btn-ghost btn-sm back-btn" onClick={() => setSelected(null)}>← Back to Orders</button>
            <div className="order-detail-header">
              <div>
                <h2>{selected.orderNumber}</h2>
                <p className="order-date">Placed on {formatDate(selected.createdAt)}</p>
              </div>
              <span className={`badge status-${selected.status}`}>{selected.status.replace('-', ' ')}</span>
            </div>

            {/* Progress tracker */}
            {selected.status !== 'cancelled' && (
              <div className="progress-tracker">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className={`tracker-step ${getStatusIdx(selected.status) >= i ? 'done' : ''} ${selected.status === s ? 'current' : ''}`}>
                    <div className="tracker-dot">{getStatusIdx(selected.status) > i ? '✓' : i + 1}</div>
                    <div className="tracker-label">{s.replace('-', ' ')}</div>
                    {i < STATUS_STEPS.length - 1 && <div className="tracker-line" />}
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            <div className="detail-section">
              <h3>Items Ordered</h3>
              {selected.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <div className="oi-info">
                    <div className="oi-name">{item.productName}</div>
                    <div className="oi-meta">{item.size} · {item.color} · ×{item.quantity}</div>
                    {item.customization?.designText && <div className="oi-design">✏️ "{item.customization.designText}"</div>}
                  </div>
                  <div className="oi-price">₹{item.totalPrice?.toFixed(0)}</div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="detail-section">
              <h3>Pricing</h3>
              <div className="pricing-rows">
                <div className="pr"><span>Subtotal</span><span>₹{selected.pricing?.subtotal?.toFixed(0)}</span></div>
                <div className="pr"><span>Shipping</span><span>{selected.pricing?.shipping === 0 ? 'FREE' : `₹${selected.pricing?.shipping}`}</span></div>
                <div className="pr"><span>GST</span><span>₹{selected.pricing?.tax?.toFixed(0)}</span></div>
                <div className="pr total-pr"><span>Total</span><span>₹{selected.pricing?.total?.toFixed(0)}</span></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="detail-section">
              <h3>Shipping Address</h3>
              <p className="address-text">
                {selected.shippingAddress?.name}<br />
                {selected.shippingAddress?.street}<br />
                {selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.zip}<br />
                {selected.shippingAddress?.phone}
              </p>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card fade-in" onClick={() => setSelected(order)}>
                <div className="order-card-top">
                  <div>
                    <div className="order-num">{order.orderNumber}</div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`badge status-${order.status}`}>{order.status.replace('-', ' ')}</span>
                </div>
                <div className="order-card-items">
                  {order.items?.slice(0, 2).map((item, i) => (
                    <span key={i} className="order-item-chip">{item.productName} ×{item.quantity}</span>
                  ))}
                  {(order.items?.length || 0) > 2 && <span className="order-item-chip">+{order.items.length - 2} more</span>}
                </div>
                <div className="order-card-footer">
                  <span className="order-total">₹{order.pricing?.total?.toFixed(0)}</span>
                  <span className="view-order-link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
