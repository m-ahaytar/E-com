import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await processPayment({
        method: paymentMethod,
        amount: getTotal(),
        items: items,
        userId: user?.id
      });
      clearCart();
      navigate('/thank-you');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      
      <div className="payment-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ${getTotal().toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <h2>Payment Method</h2>
          
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
