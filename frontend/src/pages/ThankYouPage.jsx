import { useLocation, useNavigate, Link } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;

  return (
    <div className="thank-you-page d-flex align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="container text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle" style={{ fontSize: '5rem', color: '#10b981' }}></i>
        </div>

        <h1 className="mb-2 fw-bold">Thank You for Your Order!</h1>
        <p className="lead text-muted mb-4">Your order has been successfully placed and is being processed.</p>

        {/* ORDER NUMBER */}
        {orderNumber && (
          <div className="alert alert-info alert-lg mb-4" role="alert">
            <strong>Order Number:</strong>
            <p style={{ fontSize: '1.5rem', color: '#6366f1', fontFamily: 'monospace' }}>
              #{orderNumber}
            </p>
          </div>
        )}

        {/* CONFIRMATION MESSAGE */}
        <div className="card border-0 bg-light mb-5 p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-body">
            <p className="mb-2">
              <i className="bi bi-envelope text-primary me-2"></i>A confirmation email has been sent to your registered email address.
            </p>
            <p className="mb-0">
              <i className="bi bi-truck text-info me-2"></i>You will receive a shipping notification once your order is dispatched.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="gap-2 d-flex justify-content-center flex-wrap">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            <i className="bi bi-person-circle me-2"></i>View My Orders
          </Link>
          <Link to="/catalogue" className="btn btn-outline-primary btn-lg">
            <i className="bi bi-shop me-2"></i>Continue Shopping
          </Link>
        </div>

        {/* FOOTER TEXT */}
        <p className="text-muted small mt-5">
          <i className="bi bi-question-circle me-1"></i>Need help? <a href="/" className="text-decoration-none">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
