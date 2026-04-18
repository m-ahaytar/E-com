import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  // Generate a placeholder image using picsum.photos with product ID
  const imageUrl = `https://picsum.photos/280/200?random=${product.id}`;

  // Determine stock status
  const getStockBadge = () => {
    if (product.stock === 0) {
      return <span className="badge stock-out mb-2">Out of Stock</span>;
    } else if (product.stock <= 5) {
      return <span className="badge stock-low mb-2">Only {product.stock} left!</span>;
    }
    return <span className="badge stock-in mb-2">In Stock</span>;
  };

  return (
    <div className="card product-card h-100">
      {/* Product Image */}
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        {/* Category Badge */}
        {product.category && (
          <span className="badge bg-info position-absolute top-0 end-0 m-2">
            {product.category.name || product.category}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="card-body d-flex flex-column">
        {/* Stock Badge */}
        <div>{getStockBadge()}</div>

        {/* Product Name */}
        <h5 className="card-title product-name text-truncate" title={product.name}>
          {product.name}
        </h5>

        {/* Product Description */}
        <p className="card-text product-description text-muted small flex-grow-1">
          {product.description?.substring(0, 100)}...
        </p>

        {/* Product Price */}
        <h4 className="product-price text-primary fw-bold mb-3">
          ${product.price?.toFixed(2)}
        </h4>

        {/* Action Buttons */}
        <div className="gap-2 d-flex">
          <Link to={`/product/${product.id}`} className="btn btn-outline-primary flex-grow-1 btn-sm">
            <i className="bi bi-eye me-1"></i>Details
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="btn btn-primary flex-grow-1 btn-sm"
          >
            <i className="bi bi-cart-plus me-1"></i>Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
