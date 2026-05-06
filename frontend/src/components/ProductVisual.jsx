import { getTechCategory, getTechIcon } from '../utils/productTech';

const ProductVisual = ({ className = '', product, size = 'card' }) => {
  const imageUrl = product?.imageUrl;
  const category = getTechCategory(product);
  const icon = getTechIcon(product);
  const classes = ['wm-product-visual', `wm-product-visual--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {imageUrl ? (
        <img src={imageUrl} alt={product?.name || category} loading="lazy" />
      ) : (
        <div className="wm-product-visual__fallback" aria-label={`${category} product visual`}>
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </div>
      )}
      <span className="wm-product-visual__scanline" aria-hidden="true"></span>
    </div>
  );
};

export default ProductVisual;
