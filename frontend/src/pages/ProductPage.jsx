import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';

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

  const imageUrl = `https://picsum.photos/500/400?random=${product?.id}`;

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-circle me-2"></i>{error}
      <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
    </div>
  );

  if (!product) return (
    <div className="alert alert-warning" role="alert">
      <i className="bi bi-exclamation-triangle me-2"></i>Product not found
    </div>
  );

  const stockBadge = product.stock === 0 
    ? <span className="badge stock-out">Out of Stock</span>
    : product.stock <= 5
    ? <span className="badge stock-low">Only {product.stock} left</span>
    : <span className="badge stock-in">In Stock</span>;

  return (
    <div className="product-page">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
          <li className="breadcrumb-item"><a href="/catalogue" className="text-decoration-none">Catalogue</a></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5 mb-5">
        {/* PRODUCT IMAGE */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <img src={imageUrl} alt={product.name} className="card-img-top" style={{ height: '500px', objectFit: 'cover' }} />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="col-lg-7">
          {/* HEADER */}
          <div className="mb-4">
            {product.category && (
              <span className="badge bg-info mb-3">{product.category.name || product.category}</span>
            )}
            <h1 className="mb-2">{product.name}</h1>
            <div className="d-flex align-items-center gap-2">
              {stockBadge}
            </div>
          </div>

          {/* PRICE */}
          <div className="border-top border-bottom py-3 mb-4">
            <h2 className="text-primary fw-bold">${product.price?.toFixed(2)}</h2>
            <small className="text-muted">Inclusive of all taxes</small>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          {/* SPECIFICATIONS */}
          <div className="mb-4">
            <h5>Product Details</h5>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td className="fw-600">SKU</td>
                  <td className="text-muted">{product.id || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-600">Category</td>
                  <td className="text-muted">{product.category?.name || product.category || 'Uncategorized'}</td>
                </tr>
                <tr>
                  <td className="fw-600">Stock</td>
                  <td className="text-muted">{product.stock} units available</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ADD TO CART SECTION */}
          <div className="card border-0 bg-light p-4 mb-4">
            <div className="mb-3">
              <label className="form-label fw-600">Quantity</label>
              <div className="input-group" style={{ maxWidth: '150px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  disabled={product.stock === 0}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {addedToCart && (
              <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                <i className="bi bi-check-circle me-2"></i>Added to cart!
              </div>
            )}

            <div className="gap-2 d-grid d-md-flex">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary btn-lg"
              >
                <i className="bi bi-cart-plus me-2"></i>Add to Cart
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="btn btn-outline-primary btn-lg"
              >
                <i className="bi bi-bag me-2"></i>View Cart
              </button>
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div className="row g-2 text-center">
            <div className="col-sm-4">
              <i className="bi bi-truck" style={{ fontSize: '1.5rem', color: '#6366f1' }}></i>
              <p className="small mt-2"><strong>Free Shipping</strong> on orders over $50</p>
            </div>
            <div className="col-sm-4">
              <i className="bi bi-arrow-counterclockwise" style={{ fontSize: '1.5rem', color: '#6366f1' }}></i>
              <p className="small mt-2"><strong>Easy Returns</strong> 30 days money back</p>
            </div>
            <div className="col-sm-4">
              <i className="bi bi-shield-check" style={{ fontSize: '1.5rem', color: '#6366f1' }}></i>
              <p className="small mt-2"><strong>Secure</strong> encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
