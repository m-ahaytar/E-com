import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="thank-you-page">
      <div className="success-message">
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been successfully placed.</p>
        <p>You will receive a confirmation email shortly.</p>
        <button onClick={handleContinueShopping} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
