import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>Welcome to Our Store</h1>
        <p>Discover amazing products at great prices</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
