import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#e84545', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
            <Route path="/products/:id" element={<AppLayout><ProductDetailPage /></AppLayout>} />
            <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
            <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
            <Route path="/register" element={<AppLayout><RegisterPage /></AppLayout>} />
            <Route path="/forgot-password" element={<AppLayout><ForgotPasswordPage /></AppLayout>} />

            <Route path="/checkout" element={<AppLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></AppLayout>} />
            <Route path="/orders" element={<AppLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></AppLayout>} />
            <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={
              <AppLayout>
                <div className="page flex-center" style={{ minHeight: '70vh' }}>
                  <div className="empty-state">
                    <div className="icon">🔍</div>
                    <h3>Page not found</h3>
                    <p>The page you are looking for does not exist.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: 20 }}>Go Home</a>
                  </div>
                </div>
              </AppLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}