import { useState, useEffect } from 'react';
import { get } from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await get('/orders');
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--wm-violet)',
      processing: 'var(--wm-neon)',
      shipped: 'var(--wm-violet)',
      delivered: 'var(--wm-neon-2)',
      cancelled: 'var(--wm-danger)',
    };
    return colors[status?.toLowerCase()] || 'var(--wm-muted)';
  };

  if (loading) {
    return <div className="admin-page">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Orders</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedOrder ? (
        <div className="order-details-view">
          <button 
            className="btn-back"
            onClick={() => setSelectedOrder(null)}
          >
            Back to Orders
          </button>
          <h2>Order #{selectedOrder.id}</h2>
          <div className="order-info">
            <p><strong>Customer ID:</strong> {selectedOrder.userId}</p>
            <p><strong>Status:</strong> 
              <span style={{ color: getStatusColor(selectedOrder.status), fontWeight: 'bold' }}>
                {' '}{selectedOrder.status}
              </span>
            </p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
          </div>
          <h3>Order Items</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || `Product #${item.productId}`}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price?.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>
                    <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
