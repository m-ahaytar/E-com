import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';
import ProductVisual from './ProductVisual';
import { getTechCategory } from '../utils/productTech';

const ProductCard = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const category = getTechCategory(product);

  useEffect(() => {
    if (!added) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(timeoutId);
  }, [added]);

  const stock = Number(product.stock ?? 0);
  const stockLabel = stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Limited' : 'Best Seller';
  const stockVariant = stock === 0 ? 'danger' : stock <= 5 ? 'limited' : 'success';

  const handleAddToCart = () => {
    if (!onAddToCart || stock === 0) {
      return;
    }

    onAddToCart(product);
    setAdded(true);
  };

  return (
    <article className="wm-product-card">
      <Link className="wm-product-card__visual-link" to={`/product/${product.id}`}>
        <ProductVisual product={product} />
        <Badge className="wm-product-card__badge" variant={stockVariant}>
          {stockLabel}
        </Badge>
      </Link>

      <div className="wm-product-card__body">
        <p className="wm-product-card__category">{category}</p>
        <Link className="wm-product-card__name" to={`/product/${product.id}`} title={product.name}>
          {product.name}
        </Link>
        <p className="wm-product-card__description">
          {product.description
            ? `${product.description.substring(0, 96)}${product.description.length > 96 ? '...' : ''}`
            : 'Precision-built tech gear for your next upgrade.'}
        </p>
        <div className="wm-product-card__footer">
          <strong className="wm-product-card__price">${product.price?.toFixed(2)}</strong>
          <Button
            disabled={stock === 0}
            icon={added ? 'bi-check2' : 'bi-cart-plus'}
            onClick={handleAddToCart}
            size="sm"
            variant="primary"
          >
            {added ? 'Added' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
