import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const CataloguePage = lazy(() => import('./pages/CataloguePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const DealsPage = lazy(() => import('./pages/DealsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminDeals = lazy(() => import('./pages/admin/AdminDeals'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <SpaceBackground />
            <main className="main-content">
              <Suspense fallback={<div className="wm-loading"><span className="spinner-border" role="status" aria-hidden="true"></span><span>Loading...</span></div>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/catalogue" element={<CataloguePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/payment" element={<PrivateRoute requiredRole="CUSTOMER"><PaymentPage /></PrivateRoute>} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute requiredRole="CUSTOMER">
                        <CustomerDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/seller"
                    element={
                      <PrivateRoute requiredRole="SELLER">
                        <SellerDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminProducts />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminCategories />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminUsers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/deals"
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <AdminDeals />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
