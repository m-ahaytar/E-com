import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page text-center py-5">
        <i className="bi bi-bag" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h2 className="mt-4">Your Cart is Empty</h2>
        <p className="text-muted mb-4">Add some items to get started!</p>
        <Link to="/catalogue" className="btn btn-primary">
          <i className="bi bi-shop me-2"></i>Continue Shopping
        </Link>
      </div>
    );
  }

  const cartSubtotal = getTotal();
  const taxRate = 0.1;
  const tax = cartSubtotal * taxRate;
  const shipping = cartSubtotal > 50 ? 0 : 10;
  const total = cartSubtotal + tax + shipping;

  return (
    <div className="cart-page">
      <h1 className="mb-4">
        <i className="bi bi-bag-fill me-2"></i>Shopping Cart
      </h1>

      <div className="row g-4">
        {/* CART ITEMS */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">{items.length} item{items.length !== 1 ? 's' : ''} in cart</h5>
            </div>
            <div className="card-body p-0">
              {items.map((item, index) => (
                <div key={item.id} className={`d-flex gap-3 p-4 ${index > 0 ? 'border-top' : ''}`}>
                  {/* ITEM IMAGE */}
                  <img
                    src={`https://picsum.photos/120/120?random=${item.id}`}
                    alt={item.name}
                    className="rounded"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />

                  {/* ITEM DETAILS */}
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-2">${item.price?.toFixed(2)} each</p>
                    <p className="mb-0">
                      <span className="badge bg-light text-dark">Qty: {item.quantity}</span>
                    </p>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-end" style={{ minWidth: '100px' }}>
                    <p className="fw-bold mb-3">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Remove from cart"
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTINUE SHOPPING */}
          <div className="mt-3">
            <Link to="/catalogue" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-receipt me-2"></i>Order Summary
            </div>
            <div className="card-body">
              {/* SUMMARY ROWS */}
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
                      <><i className="bi bi-check-circle text-success me-1"></i>FREE</>
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

              {/* SHIPPING INFO */}
              {shipping === 0 && (
                <div className="alert alert-success alert-sm mb-3" role="alert">
                  <i className="bi bi-truck me-2"></i>
                  <small>Free shipping applied!</small>
                </div>
              )}

              {/* CHECKOUT BUTTONS */}
              <button
                onClick={() => navigate('/payment')}
                className="btn btn-primary w-100 mb-2"
              >
                <i className="bi bi-lock-fill me-2"></i>Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/catalogue')}
                className="btn btn-outline-secondary w-100"
              >
                <i className="bi bi-shop me-2"></i>Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
