import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProductVisual from '../components/ProductVisual';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="wm-page wm-empty-state wm-empty-state--page">
        <i className="bi bi-bag" aria-hidden="true"></i>
        <h1>Your cart is empty</h1>
        <p>Add a few future-facing devices to start the mission.</p>
        <Button icon="bi-shop" to="/catalogue" variant="primary">Continue Shopping</Button>
      </div>
    );
  }

  const cartSubtotal = getTotal();
  const taxRate = 0.1;
  const tax = cartSubtotal * taxRate;
  const shipping = cartSubtotal > 50 ? 0 : 10;
  const total = cartSubtotal + tax + shipping;

  return (
    <div className="wm-page wm-cart">
      <header className="wm-page-heading">
        <div>
          <Badge icon="bi-bag" variant="info">Cart</Badge>
          <h1>Checkout Array</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} locked in.</p>
        </div>
        <Link className="wm-text-link" to="/catalogue">Continue shopping</Link>
      </header>

      <div className="wm-cart__layout">
        <section className="wm-panel wm-cart__items" aria-label="Cart items">
          {items.map((item) => {
            const maxQuantity = Number(item.stock || 99);
            return (
              <article className="wm-cart-item" key={item.id}>
                <ProductVisual product={item} size="cart" />

                <div className="wm-cart-item__details">
                  <h2>{item.name}</h2>
                  {item.originalPrice && item.originalPrice !== item.price ? (
                    <div className="wm-cart-item__price-row">
                      <span className="wm-price-original">${item.originalPrice.toFixed(2)}</span>
                      <span className="wm-price-deal">${item.price.toFixed(2)} each</span>
                      <span className="text-success small">Deal applied</span>
                    </div>
                  ) : (
                    <p>${item.price?.toFixed(2)} each</p>
                  )}
                  <div className="wm-quantity" aria-label={`Quantity for ${item.name}`}>
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      type="button"
                    >
                      <i className="bi bi-dash" aria-hidden="true"></i>
                    </button>
                    <input
                      min="1"
                      onChange={(event) => updateQuantity(item.id, Math.min(maxQuantity, Number(event.target.value) || 1))}
                      type="number"
                      value={item.quantity}
                    />
                    <button
                      onClick={() => updateQuantity(item.id, Math.min(maxQuantity, item.quantity + 1))}
                      type="button"
                    >
                      <i className="bi bi-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div className="wm-cart-item__total">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  <button onClick={() => removeFromCart(item.id)} type="button">
                    <i className="bi bi-trash" aria-hidden="true"></i>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="wm-panel wm-summary" aria-label="Order summary">
          <div className="wm-panel__header">
            <h2>Order Summary</h2>
            <i className="bi bi-receipt" aria-hidden="true"></i>
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

          {shipping === 0 && (
            <div className="wm-alert wm-alert--success" role="alert">
              <i className="bi bi-truck" aria-hidden="true"></i>
              Free shipping applied.
            </div>
          )}

          <div className="wm-summary__total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Button icon="bi-lock" onClick={() => navigate('/payment')} size="lg" variant="primary">
            Proceed to Checkout
          </Button>
          <Button icon="bi-shop" onClick={() => navigate('/catalogue')} variant="outline">
            Continue Shopping
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
