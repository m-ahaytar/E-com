import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setError('Please fill in all address fields');
      return;
    }
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
        setError('Please fill in all card details');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      const paymentResult = await processPayment({
        method: paymentMethod,
        amount: getTotal(),
        items: items,
        userId: user?.id,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        }
      });

      const orderNumber = paymentResult?.orderId ?? paymentResult?.id ?? null;
      clearCart();
      navigate('/thank-you', { state: { orderNumber } });
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cartSubtotal = getTotal();
  const tax = cartSubtotal * 0.1;
  const shipping = cartSubtotal > 50 ? 0 : 10;
  const total = cartSubtotal + tax + shipping;

  return (
    <div className="payment-page">
      <h1 className="mb-4">
        <i className="bi bi-credit-card-2-front me-2"></i>Checkout
      </h1>

      <div className="row g-4">
        {/* FORM */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {/* DELIVERY INFORMATION */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">
                <i className="bi bi-box-seam me-2"></i>Delivery Information
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-600">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-600">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-600">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-600">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-600">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="New York"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-600">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="10001"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-600">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">
                <i className="bi bi-wallet2 me-2"></i>Payment Method
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="methodCard"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="methodCard">
                      <i className="bi bi-credit-card me-2"></i>Credit/Debit Card
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="row g-3 ps-4 mb-3">
                      <div className="col-12">
                        <label className="form-label fw-600">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-600">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-600">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="methodCash"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="methodCash">
                    <i className="bi bi-cash-coin me-2"></i>Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </div>
            )}

            {/* PLACE ORDER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100"
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...</>
              ) : (
                <><i className="bi bi-lock-fill me-2"></i>Place Order</>
              )}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-receipt me-2"></i>Order Summary
            </div>
            <div className="card-body">
              {/* ORDER ITEMS */}
              <div className="mb-3 pb-3 border-bottom" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span className="small">{item.name} x {item.quantity}</span>
                    <span className="small fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* PRICING */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success fw-bold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* TOTAL */}
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-0">Total</h5>
                  <h5 className="text-primary fw-bold mb-0">${total.toFixed(2)}</h5>
                </div>
              </div>

              {/* SECURE BADGE */}
              <div className="alert alert-info alert-sm mb-0" role="alert">
                <i className="bi bi-shield-check me-2"></i>
                <small>Your payment is 100% secure</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
