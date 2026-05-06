import { useLocation, Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';

const ThankYouPage = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;

  return (
    <div className="wm-page wm-thank-you">
      <section className="wm-success-panel">
        <i className="bi bi-check-circle" aria-hidden="true"></i>
        <Badge variant="success">Order Confirmed</Badge>
        <h1>Thank You for Your Order</h1>
        <p>Your order has been placed and is moving through the With Me Shop network.</p>

        {orderNumber && (
          <div className="wm-order-code" role="status">
            <span>Order Number</span>
            <strong>#{orderNumber}</strong>
          </div>
        )}

        <div className="wm-success-panel__notes">
          <span><i className="bi bi-envelope" aria-hidden="true"></i> Confirmation email queued</span>
          <span><i className="bi bi-truck" aria-hidden="true"></i> Shipping signal pending</span>
        </div>

        <div className="wm-success-panel__actions">
          <Button icon="bi-person-circle" to="/dashboard" variant="primary">View My Orders</Button>
          <Button icon="bi-shop" to="/catalogue" variant="outline">Continue Shopping</Button>
        </div>

        <Link className="wm-text-link" to="/">Return to command deck</Link>
      </section>
    </div>
  );
};

export default ThankYouPage;
