import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) return navigate('/login?redirect=/checkout');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="page flex-center" style={{ minHeight: '70vh' }}>
      <div className="empty-state">
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item fade-in">
                <div className="cart-item-img-wrap">
                  <img src={item.productImage || `https://via.placeholder.com/100x100/f0efe9/888?text=Tshirt`} alt={item.productName} />
                  <span className="cart-item-color" style={{ background: item.colorHex }} />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.productName}</h3>
                  <div className="cart-item-meta">
                    <span className="meta-tag">Size: {item.size}</span>
                    <span className="meta-tag">Color: {item.color}</span>
                    {item.customization?.printArea && <span className="meta-tag">Print: {item.customization.printArea}</span>}
                  </div>
                  {item.customization?.designText && (
                    <div className="cart-design-text">✏️ "{item.customization.designText}"</div>
                  )}
                  <div className="cart-item-price">₹{item.unitPrice.toFixed(0)} each</div>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-total">₹{(item.unitPrice * item.quantity).toFixed(0)}</div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{color:'var(--success)'}}>FREE</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <div className="free-shipping-hint">Add ₹{(999 - cartTotal).toFixed(0)} more for free shipping</div>}
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <button className="btn btn-primary btn-lg checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
