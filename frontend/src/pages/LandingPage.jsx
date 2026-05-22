import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getDeals } from '../services/productService';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { buildCategoryOptions, getRawCategoryName } from '../utils/productTech';
import useParallax from '../hooks/useParallax';
import useScrollProgress from '../hooks/useScrollProgress';
import useInView from '../hooks/useInView';
import useStaggerReveal from '../hooks/useStaggerReveal';
import useCountUp from '../hooks/useCountUp';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const scrollY = useParallax();
  const { scrollY: scrollProgressY } = useScrollProgress();
  const [metricsRef, metricsVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  const deliveryCount = useCountUp({ end: 48, startOn: metricsVisible });
  const productCount = useCountUp({ end: products.length || 50000, duration: 1800, startOn: metricsVisible });
  const categoryCount = useCountUp({ end: categories.length || 4, duration: 1200, startOn: metricsVisible });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, dealsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getDeals(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setFeaturedDeals(dealsData.slice(0, 3));
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

  const [dealsContainerRef, , dealsVisibility] = useStaggerReveal({
    itemCount: featuredDeals.length,
    baseDelay: 80,
  });

  const [catContainerRef, , catVisibility] = useStaggerReveal({
    itemCount: categoryCards.length,
    baseDelay: 80,
  });

  const [prodContainerRef, , prodVisibility] = useStaggerReveal({
    itemCount: filteredProducts.length,
    baseDelay: 80,
  });

  return (
    <div className="wm-page wm-home">
      <section className="wm-hero" id="platform">
        <div className="wm-hero__copy">
          <Badge icon="bi-stars" variant="info">Next-gen commerce platform</Badge>
          <h1 className="wm-parallax" style={{ transform: `translateY(${Math.min(scrollY * 0.3, 120)}px)` }}>
            Tech from the <span>future</span>, delivered today.
          </h1>
          <p className="wm-hero__tagline wm-parallax" style={{ transform: `translateY(${Math.min(scrollY * 0.5, 200)}px)` }}>We Move To The Future</p>
          <p className="wm-hero__text wm-parallax" style={{ transform: `translateY(${Math.min(scrollY * 0.5, 200)}px)` }}>
            Phones, laptops, accessories and smart gadgets collected in one cold, fast,
            high-precision storefront.
          </p>
          <div className="wm-hero__actions wm-parallax" style={{ transform: `translateY(${Math.min(scrollY * 0.6, 240)}px)` }}>
            <Button icon="bi-bag" to="/catalogue" variant="primary">Shop Now</Button>
            <Button icon="bi-lightning-charge" to="/deals" variant="outline">
              View Deals
            </Button>
          </div>
        </div>

        <div className="wm-hero__showcase">
          <div className="wm-hero__orbit" aria-hidden="true"></div>
          <div className="wm-hero__orb" aria-hidden="true"></div>
          <div className="wm-hero__abstract" aria-hidden="true">
            <div className="wm-hero__abstract-ring wm-hero__abstract-ring--1"></div>
            <div className="wm-hero__abstract-ring wm-hero__abstract-ring--2"></div>
            <div className="wm-hero__abstract-ring wm-hero__abstract-ring--3"></div>
            <div className="wm-hero__abstract-core"></div>
          </div>
          <div className="wm-hero__product">
            <span>Featured Signal</span>
            <strong>{spotlightProduct?.name || 'Quantum Tech Drop'}</strong>
            <small>{spotlightProduct ? `$${spotlightProduct.price?.toFixed(2)}` : 'Live inventory sync'}</small>
          </div>
        </div>
        <div className={`wm-hero__scroll${scrollProgressY > 200 ? ' wm-hero__scroll--hidden' : ''}`} aria-hidden="true">
          <i className="bi bi-chevron-down"></i>
        </div>
      </section>

      {featuredDeals.length > 0 && (
        <section className="wm-featured-deals">
          <div className="wm-section__header">
            <div>
              <Badge icon="bi-lightning-charge-fill" variant="danger">Deals</Badge>
              <h2>Featured Deals</h2>
            </div>
            <Link className="wm-text-link" to="/deals">View all deals</Link>
          </div>
          <div className="wm-product-grid" ref={dealsContainerRef}>
            {featuredDeals.map((deal, i) => (
              <article
                className={`wm-deal-card wm-deal-card--compact wm-reveal${dealsVisibility[i] ? ' wm-reveal-in' : ''}`}
                key={deal.id}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="wm-deal-card__img-wrap">
                  {deal.imageUrl ? (
                    <img loading="lazy" src={deal.imageUrl} alt={deal.productName} className="wm-deal-card__img" />
                  ) : (
                    <div className="wm-deal-card__img-placeholder">
                      <i className="bi bi-image" aria-hidden="true"></i>
                    </div>
                  )}
                  <span className="wm-deal-badge">-{deal.discountPercentage}%</span>
                </div>
                <div className="wm-deal-card__body">
                  <Link to={`/product/${deal.productId}`} className="wm-deal-card__name">
                    {deal.productName}
                  </Link>
                  <div className="wm-deal-card__prices">
                    <s className="wm-price-original">${deal.originalPrice.toFixed(2)}</s>
                    <span className="wm-price-deal">${deal.discountedPrice.toFixed(2)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-3">
            <Button icon="bi-lightning-charge" to="/deals" variant="outline">View All Deals</Button>
          </div>
        </section>
      )}

      <section className={`wm-metrics wm-reveal${metricsVisible ? ' wm-reveal-in' : ''}`} ref={metricsRef} aria-label="Store metrics">
        <div>
          <strong>{deliveryCount}H</strong>
          <span>Rapid delivery</span>
        </div>
        <div>
          <strong>{products.length ? productCount.toLocaleString() : '50K+'}</strong>
          <span>Synced products</span>
        </div>
        <div>
          <strong>{categories.length ? categoryCount : 4}</strong>
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

        <div className="wm-category-grid" ref={catContainerRef}>
          {categoryCards.map((category, i) => (
            <button
              className={`wm-category-tile wm-reveal${catVisibility[i] ? ' wm-reveal-in' : ''}${selectedCategory === category.name ? ' active' : ''}`}
              key={category.name}
              style={{ transitionDelay: `${i * 80}ms` }}
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
          <div className="wm-loading wm-loading--skeleton">
            {[1, 2, 3].map((n) => (
              <div className="wm-skeleton" key={n}>
                <div className="wm-skeleton__img"></div>
                <div className="wm-skeleton__body">
                  <div className="wm-skeleton__line wm-skeleton__line--short"></div>
                  <div className="wm-skeleton__line wm-skeleton__line--long"></div>
                  <div className="wm-skeleton__line wm-skeleton__line--long" style={{ width: '70%' }}></div>
                  <div className="wm-skeleton__action"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="wm-alert wm-alert--danger" role="alert">
            <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="wm-product-grid" ref={prodContainerRef}>
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className={`wm-reveal${prodVisibility[i] ? ' wm-reveal-in' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={`wm-cta-band wm-reveal${ctaVisible ? ' wm-reveal-in' : ''}`} ref={ctaRef}>
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
