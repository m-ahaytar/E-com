import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData.slice(0, 6));
        setCategories(categoriesData.slice(0, 6));
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 3000);
  };

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="mb-5 rounded-3" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        padding: '5rem 2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 className="display-3 fw-bold mb-3">Welcome to E-Shop</h1>
        <p className="lead mb-4">Discover amazing products at unbeatable prices</p>
        <Link to="/catalogue" className="btn btn-light btn-lg">
          <i className="bi bi-bag-check me-2"></i>Shop Now
        </Link>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0"><i className="bi bi-star-fill text-warning me-2"></i>Featured Products</h2>
          <Link to="/catalogue" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-4">
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mb-5">
        <h2 className="mb-4"><i className="bi bi-tag-fill text-info me-2"></i>Shop by Category</h2>
        {categories.length > 0 && (
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-4">
                <Link to={`/catalogue?category=${category.name}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 text-center p-4" style={{ cursor: 'pointer', transition: 'transform 0.3s' }}>
                    <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                      <i className="bi bi-bag-fill text-primary"></i>
                    </div>
                    <h5 className="card-title text-dark mb-0">{category.name}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="my-5 py-5 rounded-3" style={{ background: '#f9fafb' }}>
        <div className="row text-center g-4">
          <div className="col-md-3">
            <div className="mb-2" style={{ fontSize: '2rem', color: '#6366f1' }}>
              <i className="bi bi-box"></i>
            </div>
            <h4>10,000+</h4>
            <p className="text-muted">Products</p>
          </div>
          <div className="col-md-3">
            <div className="mb-2" style={{ fontSize: '2rem', color: '#6366f1' }}>
              <i className="bi bi-people"></i>
            </div>
            <h4>50,000+</h4>
            <p className="text-muted">Happy Customers</p>
          </div>
          <div className="col-md-3">
            <div className="mb-2" style={{ fontSize: '2rem', color: '#6366f1' }}>
              <i className="bi bi-truck"></i>
            </div>
            <h4>Fast</h4>
            <p className="text-muted">Free Shipping</p>
          </div>
          <div className="col-md-3">
            <div className="mb-2" style={{ fontSize: '2rem', color: '#6366f1' }}>
              <i className="bi bi-shield-check"></i>
            </div>
            <h4>100%</h4>
            <p className="text-muted">Secure</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <h2 className="mb-4">Get in Touch</h2>
            <p className="text-muted mb-4">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="mb-4">
              <div className="d-flex align-items-start mb-3">
                <i className="bi bi-geo-alt-fill text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="text-muted">123 Shopping Street, Commerce City, CC 12345</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <i className="bi bi-telephone-fill text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="text-muted">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <i className="bi bi-envelope-fill text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="text-muted">support@eshop.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <form onSubmit={handleContactSubmit} className="card border-0 shadow-sm p-4">
              {contactSubmitted && (
                <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                  <i className="bi bi-check-circle me-2"></i>Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-600">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-600">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-600">Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-send me-2"></i>Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
