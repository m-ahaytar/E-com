import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as productService from '../services/productService';
import * as orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalDeals: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsData, categoriesData, ordersData, dealsData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
          orderService.getAllOrders(),
          productService.getAllDeals(),
        ]);
        
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        
        setStats({
          totalProducts: productsData.length,
          totalCategories: categoriesData.length,
          totalDeals: dealsData.length,
          totalOrders: ordersData.length,
          totalRevenue: totalRevenue
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="admin-dashboard wm-loading">
        <div className="spinner-border text-info" role="status" aria-hidden="true"></div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="mb-4">
        <i className="bi bi-graph-up me-2"></i>Admin Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="row g-4 mb-5">
        {/* TOTAL PRODUCTS */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 bg-primary text-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Total Products</h6>
                <h2 className="mb-0 fw-bold">{stats.totalProducts}</h2>
              </div>
              <i className="bi bi-box" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>

        {/* TOTAL CATEGORIES */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 bg-info text-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Categories</h6>
                <h2 className="mb-0 fw-bold">{stats.totalCategories}</h2>
              </div>
              <i className="bi bi-tag" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 bg-warning text-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Total Orders</h6>
                <h2 className="mb-0 fw-bold">{stats.totalOrders}</h2>
              </div>
              <i className="bi bi-receipt" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 bg-success text-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Total Revenue</h6>
                <h2 className="mb-0 fw-bold">${stats.totalRevenue.toFixed(2)}</h2>
              </div>
              <i className="bi bi-cash-coin" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* MANAGEMENT SECTIONS */}
      <h3 className="mb-4">Manage</h3>
      <div className="row g-4">
        {/* PRODUCTS */}
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/products" className="card border-0 shadow-sm text-decoration-none text-dark h-100" style={{ transition: 'transform 0.3s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--wm-neon)' }}>
                <i className="bi bi-box-seam"></i>
              </div>
              <h5 className="card-title fw-bold">Products</h5>
              <p className="card-text text-muted small">Add, edit, or delete products</p>
              <small className="text-primary fw-600">Manage {stats.totalProducts} items →</small>
            </div>
          </Link>
        </div>

        {/* CATEGORIES */}
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/categories" className="card border-0 shadow-sm text-decoration-none text-dark h-100" style={{ transition: 'transform 0.3s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--wm-neon)' }}>
                <i className="bi bi-tags"></i>
              </div>
              <h5 className="card-title fw-bold">Categories</h5>
              <p className="card-text text-muted small">Manage product categories</p>
              <small className="text-primary fw-600">Manage {stats.totalCategories} items →</small>
            </div>
          </Link>
        </div>

        {/* ORDERS */}
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/orders" className="card border-0 shadow-sm text-decoration-none text-dark h-100" style={{ transition: 'transform 0.3s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--wm-violet)' }}>
                <i className="bi bi-receipt"></i>
              </div>
              <h5 className="card-title fw-bold">Orders</h5>
              <p className="card-text text-muted small">View and manage orders</p>
              <small className="text-primary fw-600">View {stats.totalOrders} orders →</small>
            </div>
          </Link>
        </div>

        {/* USERS */}
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/users" className="card border-0 shadow-sm text-decoration-none text-dark h-100" style={{ transition: 'transform 0.3s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--wm-danger)' }}>
                <i className="bi bi-people"></i>
              </div>
              <h5 className="card-title fw-bold">Users</h5>
              <p className="card-text text-muted small">View registered users</p>
              <small className="text-primary fw-600">View all users →</small>
            </div>
          </Link>
        </div>

        {/* DEALS */}
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/deals" className="card border-0 shadow-sm text-decoration-none text-dark h-100" style={{ transition: 'transform 0.3s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--wm-neon-2)' }}>
                <i className="bi bi-tag-fill"></i>
              </div>
              <h5 className="card-title fw-bold">Deals</h5>
              <p className="card-text text-muted small">Manage time-limited offers</p>
              <small className="text-primary fw-600">Manage {stats.totalDeals} deals →</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
