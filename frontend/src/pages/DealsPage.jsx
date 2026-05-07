import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeals } from '../services/productService';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getDeals();
        setDeals(data);
      } catch (err) {
        setError(err.message || 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (deals.length === 0) return;

    const soonest = deals.reduce((min, deal) => {
      const end = new Date(deal.endDate).getTime();
      return end < min ? end : min;
    }, Infinity);

    const interval = setInterval(() => {
      const diff = soonest - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        clearInterval(interval);
        getDeals().then(setDeals);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [deals]);

  const handleAddToCart = (deal) => {
    addToCart({
      id: deal.productId,
      name: deal.productName,
      price: deal.discountedPrice,
      originalPrice: deal.originalPrice,
      imageUrl: deal.imageUrl,
      dealId: deal.id,
      quantity: 1,
      stock: 99,
      categoryId: null,
      categoryName: '',
    });
  };

  if (loading) {
    return (
      <div className="wm-loading wm-page">
        <span className="spinner-border text-info" role="status" aria-hidden="true"></span>
        <span>Loading deals...</span>
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

  return (
    <div className="wm-page wm-deals">
      <section className="wm-deals-hero">
        <Badge icon="bi-lightning-charge-fill" variant="danger">Limited Time</Badge>
        <h1>Today's Deals</h1>
        <p className="wm-deals-hero__tagline">Grab them before they're gone</p>
        {deals.length > 0 && (
          <div className="wm-deals-hero__countdown">
            <span>Soonest deal expires in:</span>
            <span className="wm-countdown">{timeLeft}</span>
          </div>
        )}
      </section>

      {deals.length === 0 ? (
        <div className="wm-empty-state wm-empty-state--page">
          <i className="bi bi-tag" aria-hidden="true"></i>
          <h2>No active deals right now</h2>
          <p>Check back soon for fresh offers.</p>
          <Button icon="bi-shop" to="/catalogue" variant="primary">Browse Products</Button>
        </div>
      ) : (
        <section className="wm-deals-grid">
          <div className="wm-deals-grid__inner">
            {deals.map((deal) => (
              <article className="wm-deal-card" key={deal.id}>
                <div className="wm-deal-card__img-wrap">
                  {deal.imageUrl ? (
                    <img src={deal.imageUrl} alt={deal.productName} className="wm-deal-card__img" />
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
                  <small className="wm-deal-card__end">
                    Ends {new Date(deal.endDate).toLocaleDateString()}
                  </small>
                  <Button
                    icon="bi-cart-plus"
                    onClick={() => handleAddToCart(deal)}
                    size="sm"
                    variant="primary"
                  >
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DealsPage;
