import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, getTotal } = useCart();

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="btn-remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Total: ${getTotal().toFixed(2)}</h3>
        <button onClick={handleCheckout} className="btn-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
