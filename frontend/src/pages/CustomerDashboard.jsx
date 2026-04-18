import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as orderService from '../services/orderService';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      PENDING: 'bg-warning',
      PROCESSING: 'bg-info',
      SHIPPED: 'bg-primary',
      DELIVERED: 'bg-success',
      CANCELLED: 'bg-danger',
    };
    return badgeClasses[status?.toUpperCase()] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <h1 className="mb-4">
        <i className="bi bi-person-circle me-2"></i>My Account
      </h1>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            role="tab"
          >
            <i className="bi bi-person me-2"></i>Profile
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            role="tab"
          >
            <i className="bi bi-receipt me-2"></i>My Orders
          </button>
        </li>
      </ul>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">
            <i className="bi bi-person-card me-2"></i>Profile Information
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="text-muted small">First Name</label>
                <p className="fw-600">{user.firstName}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="text-muted small">Last Name</label>
                <p className="fw-600">{user.lastName}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="text-muted small">Email Address</label>
                <p className="fw-600">{user.email}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="text-muted small">Account Type</label>
                <p className="fw-600">
                  <span className="badge bg-primary">{user.role || 'Customer'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
              <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="alert alert-info" role="alert">
              <i className="bi bi-info-circle me-2"></i>You haven't placed any orders yet.
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="card border-0 shadow-sm mb-3">
                  <div className="card-header bg-light">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <h6 className="mb-0">
                          <i className="bi bi-box-seam me-2"></i>Order #{order.id}
                        </h6>
                      </div>
                      <div className="col-md-4">
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                      <div className="col-md-4 text-end">
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    {/* ITEMS */}
                    <div className="mb-3 pb-3 border-bottom">
                      <h6 className="fw-600 mb-2">Items:</h6>
                      {order.items?.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between small mb-2">
                          <span>{item.name || `Product #${item.productId}`}</span>
                          <span>{item.quantity} × ${item.price?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <p className="text-muted small mb-0">Items: {order.items?.length || 0}</p>
                      </div>
                      <div className="col-md-6 text-end">
                        <h5 className="mb-0 text-primary">${order.total?.toFixed(2) || '0.00'}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
