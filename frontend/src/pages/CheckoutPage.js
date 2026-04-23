import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

function CheckoutForm({ order, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [payMethod, setPayMethod] = useState('stripe');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;
    setProcessing(true);
    try {
      if (payMethod === 'cod') {
        await api.put('/orders/' + order._id + '/status', {
          status: 'confirmed',
          note: 'Cash on Delivery order confirmed'
        });
        onSuccess(order);
        return;
      }
      const { data: intentData } = await api.post('/payment/create-intent', { orderId: order._id });
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      const { data } = await api.post('/payment/confirm', {
        orderId: order._id,
        paymentIntentId: result.paymentIntent.id
      });
      onSuccess(data.order);
    } catch (err) {
      toast.error((err.response && err.response.data && err.response.data.message) || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3 className="payment-title">Payment Method</h3>
      <div className="pay-method-options">
        <label className={'pay-option' + (payMethod === 'stripe' ? ' active' : '')}>
          <input
            type="radio"
            value="stripe"
            checked={payMethod === 'stripe'}
            onChange={function() { setPayMethod('stripe'); }}
          />
          <span>💳 Card / UPI</span>
        </label>
        <label className={'pay-option' + (payMethod === 'cod' ? ' active' : '')}>
          <input
            type="radio"
            value="cod"
            checked={payMethod === 'cod'}
            onChange={function() { setPayMethod('cod'); }}
          />
          <span>💵 Cash on Delivery</span>
        </label>
      </div>

      {payMethod === 'stripe' && (
        <div className="card-element-wrap">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#0d0d0d',
                fontFamily: "'DM Sans', sans-serif",
                '::placeholder': { color: '#aaa' }
              }
            }
          }} />
          <div className="card-test-hint">
            Test card: 4242 4242 4242 4242 · Any future date · Any CVC
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-lg pay-btn"
        disabled={processing || (!stripe && payMethod === 'stripe')}
      >
        {processing
          ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="spinner" /> Processing...</span>
          : 'Pay ₹' + (order && order.pricing && order.pricing.total ? order.pricing.total.toFixed(0) : '0')
        }
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!address.name.trim()) return toast.error('Please enter your name');
    if (!address.phone.trim()) return toast.error('Please enter your phone number');
    if (!address.street.trim()) return toast.error('Please enter your street address');
    if (!address.city.trim()) return toast.error('Please enter your city');
    if (!address.state.trim()) return toast.error('Please enter your state');
    if (!address.zip.trim()) return toast.error('Please enter your PIN code');

    setPlacing(true);
    try {
      const formData = new FormData();

      const items = cart.map(function(item) {
        return {
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          customization: {
            designText: (item.customization && item.customization.designText) || '',
            printArea: (item.customization && item.customization.printArea) || 'front',
            notes: (item.customization && item.customization.notes) || '',
            designImage: '',
          }
        };
      });

      const shippingAddress = {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country || 'India'
      };

      formData.append('items', JSON.stringify(items));
      formData.append('shippingAddress', JSON.stringify(shippingAddress));
      formData.append('payment', JSON.stringify({ method: 'stripe' }));

      // Attach design files
      cart.forEach(function(item) {
        if (item.customization && item.customization.designFile) {
          formData.append('designImages', item.customization.designFile);
        } else {
          formData.append('designImages', new Blob([]), 'empty');
        }
      });

      const { data } = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setOrder(data.order);
      setStep(2);
    } catch (err) {
      toast.error((err.response && err.response.data && err.response.data.message) || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = function(paidOrder) {
    clearCart();
    setOrder(paidOrder);
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="page flex-center" style={{ minHeight: '70vh' }}>
        <div className="success-state fade-in">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Order <strong>{order && order.orderNumber}</strong> confirmed.</p>
          <p style={{ color: 'var(--ink-muted)', marginTop: 8 }}>
            We will start working on your custom print right away!
          </p>
          <div className="success-btns">
            <button className="btn btn-primary" onClick={function() { navigate('/orders'); }}>
              View My Orders
            </button>
            <button className="btn btn-outline" onClick={function() { navigate('/products'); }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">

            {/* Step indicator */}
            <div className="steps-indicator">
              <div className={'step-dot' + (step >= 1 ? ' active' : '')}>
                1 <span>Address</span>
              </div>
              <div className="step-line" />
              <div className={'step-dot' + (step >= 2 ? ' active' : '')}>
                2 <span>Payment</span>
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="address-form fade-in">
                <h3 className="form-section-title">Shipping Address</h3>

                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input
                      className="input"
                      required
                      placeholder="Your full name"
                      value={address.name}
                      onChange={function(e) { setAddress({ ...address, name: e.target.value }); }}
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone *</label>
                    <input
                      className="input"
                      required
                      placeholder="+91 98765 43210"
                      value={address.phone}
                      onChange={function(e) { setAddress({ ...address, phone: e.target.value }); }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Street Address *</label>
                  <input
                    className="input"
                    required
                    placeholder="House/flat no, street, area"
                    value={address.street}
                    onChange={function(e) { setAddress({ ...address, street: e.target.value }); }}
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>City *</label>
                    <input
                      className="input"
                      required
                      placeholder="City"
                      value={address.city}
                      onChange={function(e) { setAddress({ ...address, city: e.target.value }); }}
                    />
                  </div>
                  <div className="input-group">
                    <label>State *</label>
                    <input
                      className="input"
                      required
                      placeholder="State"
                      value={address.state}
                      onChange={function(e) { setAddress({ ...address, state: e.target.value }); }}
                    />
                  </div>
                  <div className="input-group">
                    <label>PIN Code *</label>
                    <input
                      className="input"
                      required
                      placeholder="500001"
                      value={address.zip}
                      onChange={function(e) { setAddress({ ...address, zip: e.target.value }); }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={placing}
                >
                  {placing
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="spinner" /> Saving...</span>
                    : 'Continue to Payment →'
                  }
                </button>
              </form>
            )}

            {step === 2 && (
              <Elements stripe={stripePromise}>
                <CheckoutForm order={order} onSuccess={handlePaymentSuccess} />
              </Elements>
            )}
          </div>

          {/* Order summary */}
          <div className="checkout-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="checkout-items">
              {cart.map(function(item) {
                return (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-info">
                      <div className="checkout-item-name">{item.productName}</div>
                      <div className="checkout-item-meta">
                        {item.size} · {item.color} · x{item.quantity}
                      </div>
                      {item.customization && item.customization.designPreview && (
                        <div style={{ marginTop: 4 }}>
                          <img
                            src={item.customization.designPreview}
                            alt="design"
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="checkout-item-price">
                      ₹{(item.unitPrice * item.quantity).toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? <span style={{ color: 'var(--success)' }}>FREE</span>
                  : '₹' + shipping
                }
              </span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}