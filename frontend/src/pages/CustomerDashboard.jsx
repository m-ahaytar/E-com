import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as orderService from '../services/orderService';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      processing: '#4169e1',
      shipped: '#9370db',
      delivered: '#228b22',
      cancelled: '#dc143c',
    };
    return colors[status?.toLowerCase()] || '#666';
  };

  if (loading) {
    return <div className="dashboard-page">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>My Account</h1>
      
      <div className="profile-section">
        <h2>Profile Information</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      <div className="orders-section">
        <h2>My Orders</h2>
        {error && <div className="error-message">{error}</div>}
        
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span 
                    className="order-status"
                    style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
                  <p><strong>Items:</strong> {order.items?.length || 0}</p>
                </div>
                <div className="order-items">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name || `Product #${item.productId}`}</span>
                      <span>x{item.quantity}</span>
                      <span>${item.price?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
