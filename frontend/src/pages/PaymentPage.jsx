import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../services/paymentService';
import { createOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import Button from '../components/Button';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [formData, setFormData] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    address: '',
    cardNumber: '',
    paypalEmail: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const cartSubtotal = getTotal();
  const tax = cartSubtotal * 0.1;
  const shipping = cartSubtotal > 50 ? 0 : 10;
  const total = cartSubtotal + tax + shipping;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName || !formData.address) {
      setError('Please fill in your name and delivery address.');
      return;
    }

    if (paymentMethod === 'CREDIT_CARD') {
      const digitsOnly = formData.cardNumber.replace(/\D/g, '');
      if (!digitsOnly) {
        setError('Please enter your card number.');
        return;
      }
      if (digitsOnly.length < 13 || digitsOnly.length > 19) {
        setError('Card number must be between 13 and 19 digits.');
        return;
      }
    }

    if (paymentMethod === 'PAYPAL') {
      if (!formData.paypalEmail) {
        setError('Please enter your PayPal email.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
        setError('Please enter a valid email address for PayPal.');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const orderPayload = {
        userId: user?.id,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const createdOrder = await createOrder(orderPayload);
      const realOrderId = createdOrder.id;
      const orderNumber = createdOrder.orderNumber;

      await processPayment({
        orderId: realOrderId,
        method: paymentMethod,
        amount: total,
      });

      await clearCart();
      navigate('/thank-you', {
        state: { orderNumber: orderNumber ?? realOrderId },
      });
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="wm-page wm-empty-state wm-empty-state--page">
        <i className="bi bi-credit-card" aria-hidden="true"></i>
        <h1>No checkout items</h1>
        <p>Your cart is empty, so the checkout console is idle.</p>
        <Button icon="bi-shop" to="/catalogue" variant="primary">Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="wm-page wm-checkout">
      <header className="wm-page-heading">
        <div>
          <Badge icon="bi-shield-lock" variant="info">Secure Checkout</Badge>
          <h1>Place Order</h1>
          <p>Minimal details, encrypted signal, fast confirmation.</p>
        </div>
      </header>

      <div className="wm-checkout__layout">
        <form className="wm-panel wm-checkout-form" onSubmit={handleSubmit}>
          <div className="wm-panel__header">
            <h2>Delivery Details</h2>
            <i className="bi bi-box-seam" aria-hidden="true"></i>
          </div>

          <label className="wm-field">
            <span>Name</span>
            <input
              className="form-control"
              name="fullName"
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              type="text"
              value={formData.fullName}
            />
          </label>

          <label className="wm-field">
            <span>Address</span>
            <textarea
              className="form-control"
              name="address"
              onChange={handleInputChange}
              placeholder="Street, city, postal code, country"
              required
              rows="4"
              value={formData.address}
            />
          </label>

          <div className="wm-filter-block">
            <span className="wm-filter-block__label">Payment Method</span>
            <label className={`wm-payment-option${paymentMethod === 'CREDIT_CARD' ? ' active' : ''}`}>
              <input
                checked={paymentMethod === 'CREDIT_CARD'}
                name="paymentMethod"
                onChange={handlePaymentMethodChange}
                type="radio"
                value="CREDIT_CARD"
              />
              <i className="bi bi-credit-card" aria-hidden="true"></i>
              Credit Card
            </label>
            <label className={`wm-payment-option${paymentMethod === 'CASH' ? ' active' : ''}`}>
              <input
                checked={paymentMethod === 'CASH'}
                name="paymentMethod"
                onChange={handlePaymentMethodChange}
                type="radio"
                value="CASH"
              />
              <i className="bi bi-cash-coin" aria-hidden="true"></i>
              Cash on Delivery
            </label>
            <label className={`wm-payment-option${paymentMethod === 'PAYPAL' ? ' active' : ''}`}>
              <input
                checked={paymentMethod === 'PAYPAL'}
                name="paymentMethod"
                onChange={handlePaymentMethodChange}
                type="radio"
                value="PAYPAL"
              />
              <i className="bi bi-paypal" aria-hidden="true"></i>
              PayPal
            </label>
          </div>

          {paymentMethod === 'CREDIT_CARD' && (
            <label className="wm-field">
              <span>Card Number</span>
              <input
                className="form-control"
                name="cardNumber"
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                required
                type="text"
                value={formData.cardNumber}
              />
            </label>
          )}

          {paymentMethod === 'PAYPAL' && (
            <label className="wm-field">
              <span>PayPal Email</span>
              <input
                className="form-control"
                name="paypalEmail"
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                type="email"
                value={formData.paypalEmail}
              />
            </label>
          )}

          {error && (
            <div className="wm-alert wm-alert--danger" role="alert">
              <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
              {error}
            </div>
          )}

          <Button disabled={loading} icon="bi-lock" size="lg" type="submit" variant="primary">
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </form>

        <aside className="wm-panel wm-summary">
          <div className="wm-panel__header">
            <h2>Order Summary</h2>
            <i className="bi bi-receipt" aria-hidden="true"></i>
          </div>

          <div className="wm-summary__items">
            {items.map((item) => (
              <div key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="wm-summary__rows">
            <div>
              <span>Subtotal</span>
              <strong>${cartSubtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Tax (10%)</span>
              <strong>${tax.toFixed(2)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong>
            </div>
          </div>

          <div className="wm-summary__total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="wm-alert" role="status">
            <i className="bi bi-shield-check" aria-hidden="true"></i>
            Payment signal secured.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
