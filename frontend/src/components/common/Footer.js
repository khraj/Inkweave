import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">INK<strong>WEAVE</strong></div>
          <p>Premium custom t-shirt printing. Design your story, wear your identity.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=round-neck">Round Neck</Link>
            <Link to="/products?category=polo">Polo Shirts</Link>
            <Link to="/products?category=hoodie">Hoodies</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <Link to="/about">About Us</Link>
            <Link to="/orders">Track Order</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">My Profile</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} PrintCraft. All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  );
}
