import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import ProductVisual from '../components/ProductVisual';
import { buildCategoryOptions, getRawCategoryName } from '../utils/productTech';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const spotlightProduct = products[0];
  const categoryCards = useMemo(() => (
    buildCategoryOptions(categories, products)
  ), [categories, products]);

  const filteredProducts = useMemo(() => {
    const source = selectedCategory === 'All'
      ? products
      : products.filter(
        (product) => getRawCategoryName(product).toLowerCase() === selectedCategory.toLowerCase()
      );

    return source.slice(0, 6);
  }, [products, selectedCategory]);

  return (
    <div className="wm-page wm-home">
      <section className="wm-hero" id="platform">
        <div className="wm-hero__copy">
          <Badge icon="bi-stars" variant="info">Next-gen commerce platform</Badge>
          <h1>
            Tech from the <span>future</span>, delivered today.
          </h1>
          <p className="wm-hero__tagline">We Move To The Future</p>
          <p className="wm-hero__text">
            Phones, laptops, accessories and smart gadgets collected in one cold, fast,
            high-precision storefront.
          </p>
          <div className="wm-hero__actions">
            <Button icon="bi-bag" to="/catalogue" variant="primary">Shop Now</Button>
            <Button icon="bi-lightning-charge" to="/catalogue?category=Gadgets" variant="outline">
              View Deals
            </Button>
          </div>
        </div>

        <div className="wm-hero__showcase">
          <div className="wm-hero__orbit" aria-hidden="true"></div>
          <ProductVisual product={spotlightProduct} size="hero" />
          <div className="wm-hero__product">
            <span>Featured Signal</span>
            <strong>{spotlightProduct?.name || 'Quantum Tech Drop'}</strong>
            <small>{spotlightProduct ? `$${spotlightProduct.price?.toFixed(2)}` : 'Live inventory sync'}</small>
          </div>
        </div>
      </section>

      <section className="wm-metrics" aria-label="Store metrics">
        <div>
          <strong>48H</strong>
          <span>Rapid delivery</span>
        </div>
        <div>
          <strong>{products.length || '50K+'}</strong>
          <span>Synced products</span>
        </div>
        <div>
          <strong>{categories.length || 4}</strong>
          <span>Backend categories</span>
        </div>
      </section>

      <section className="wm-section">
        <div className="wm-section__header">
          <div>
            <Badge variant="info">Categories</Badge>
            <h2>Shop by tech system</h2>
          </div>
          <Link className="wm-text-link" to="/catalogue">Open full grid</Link>
        </div>

        <div className="wm-category-grid">
          {categoryCards.map((category) => (
            <button
              className={`wm-category-tile${selectedCategory === category.name ? ' active' : ''}`}
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              type="button"
            >
              <i className={`bi ${category.icon}`} aria-hidden="true"></i>
              <strong>{category.name}</strong>
              <span>{category.count} products</span>
            </button>
          ))}
        </div>
      </section>

      <section className="wm-section" id="featured">
        <div className="wm-section__header">
          <div>
            <Badge variant="success">Featured</Badge>
            <h2>High-tech drops</h2>
          </div>
          <div className="wm-filter-pills">
            <button
              className={`wm-filter-pill${selectedCategory === 'All' ? ' active' : ''}`}
              onClick={() => setSelectedCategory('All')}
              type="button"
            >
              All
            </button>
            {categoryCards.map((category) => (
              <button
                className={`wm-filter-pill${selectedCategory === category.name ? ' active' : ''}`}
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="wm-loading">
            <span className="spinner-border text-info" role="status" aria-hidden="true"></span>
            <span>Loading product matrix...</span>
          </div>
        )}

        {error && (
          <div className="wm-alert wm-alert--danger" role="alert">
            <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="wm-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="wm-cta-band">
        <div>
          <Badge variant="limited">WM Signal</Badge>
          <h2>Build your future setup.</h2>
          <p>Cold-light hardware, secure checkout, and rapid fulfillment in one platform.</p>
        </div>
        <Button icon="bi-arrow-right" to="/register" variant="outline">Join Platform</Button>
      </section>
    </div>
  );
};

export default LandingPage;
