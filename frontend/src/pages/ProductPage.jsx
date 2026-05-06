import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProductVisual from '../components/ProductVisual';
import { getTechCategory } from '../utils/productTech';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="wm-loading wm-page">
        <span className="spinner-border text-info" role="status" aria-hidden="true"></span>
        <span>Loading product core...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wm-page">
        <div className="wm-alert wm-alert--danger" role="alert">
          <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wm-page">
        <div className="wm-alert" role="alert">
          <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
          Product not found
        </div>
      </div>
    );
  }

  const stock = Number(product.stock ?? 0);
  const category = getTechCategory(product);
  const stockBadge = stock === 0
    ? <Badge variant="danger">Out of Stock</Badge>
    : stock <= 5
      ? <Badge variant="limited">Limited</Badge>
      : <Badge variant="success">In Stock</Badge>;

  return (
    <div className="wm-page wm-product-detail">
      <nav aria-label="Breadcrumb" className="wm-breadcrumb">
        <Link to="/">Home</Link>
        <i className="bi bi-chevron-right" aria-hidden="true"></i>
        <Link to="/catalogue">Products</Link>
        <i className="bi bi-chevron-right" aria-hidden="true"></i>
        <span>{product.name}</span>
      </nav>

      <section className="wm-product-detail__grid">
        <div className="wm-product-detail__media">
          <ProductVisual product={product} size="detail" />
        </div>

        <div className="wm-product-detail__info">
          <div className="wm-product-detail__header">
            <Badge icon="bi-cpu" variant="info">{category}</Badge>
            {stockBadge}
          </div>

          <h1>{product.name}</h1>
          <p className="wm-product-detail__description">
            {product.description || 'A precision-selected With Me Shop technology product.'}
          </p>

          <div className="wm-price-panel">
            <span>Current Price</span>
            <strong>${product.price?.toFixed(2)}</strong>
            <small>Inclusive of all taxes</small>
          </div>

          <div className="wm-spec-list">
            <h2>Specs</h2>
            <dl>
              <div>
                <dt>SKU</dt>
                <dd>WM-{product.id || 'N/A'}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{category}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{stock} units</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>Future-ready tech</dd>
              </div>
            </dl>
          </div>

          <div className="wm-buy-panel">
            <label className="wm-field">
              <span>Quantity</span>
              <div className="wm-quantity">
                <button
                  disabled={stock === 0}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  type="button"
                >
                  <i className="bi bi-dash" aria-hidden="true"></i>
                </button>
                <input
                  disabled={stock === 0}
                  max={Math.max(stock, 1)}
                  min="1"
                  onChange={(event) => setQuantity(Math.max(1, Math.min(stock, Number(event.target.value) || 1)))}
                  type="number"
                  value={quantity}
                />
                <button
                  disabled={stock === 0}
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  type="button"
                >
                  <i className="bi bi-plus" aria-hidden="true"></i>
                </button>
              </div>
            </label>

            {addedToCart && (
              <div className="wm-alert wm-alert--success" role="alert">
                <i className="bi bi-check-circle" aria-hidden="true"></i>
                Added to cart.
              </div>
            )}

            <div className="wm-buy-panel__actions">
              <Button
                disabled={stock === 0}
                icon="bi-cart-plus"
                onClick={handleAddToCart}
                size="lg"
                variant="primary"
              >
                Add to Cart
              </Button>
              <Button icon="bi-bag" onClick={() => navigate('/cart')} size="lg" variant="outline">
                View Cart
              </Button>
            </div>
          </div>

          <div className="wm-service-grid">
            <span><i className="bi bi-truck" aria-hidden="true"></i> Rapid shipping</span>
            <span><i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Easy returns</span>
            <span><i className="bi bi-shield-check" aria-hidden="true"></i> Secure checkout</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
