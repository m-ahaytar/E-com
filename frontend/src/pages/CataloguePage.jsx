import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const CataloguePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category?.name === selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="catalogue-page">
      <div className="row">
        {/* SIDEBAR FILTERS */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-funnel me-2"></i>Filters
            </div>
            <div className="card-body">
              {/* SEARCH */}
              <div className="mb-4">
                <label className="form-label fw-600">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* CATEGORY FILTER */}
              <div className="mb-4">
                <label className="form-label fw-600">Category</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id="allCategories"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="allCategories">
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id={`category-${category.id}`}
                      value={category.name}
                      checked={selectedCategory === category.name}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={`category-${category.id}`}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>

              {/* PRICE RANGE FILTER */}
              <div className="mb-4">
                <label className="form-label fw-600">Price Range</label>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    min="0"
                  />
                </div>
                <small className="text-muted">${priceRange[0]} - ${priceRange[1]}</small>
              </div>

              {/* SORT */}
              <div className="mb-4">
                <label className="form-label fw-600">Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* CLEAR FILTERS */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setPriceRange([0, 1000]);
                  setSortBy('');
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-lg-9">
          {/* HEADER */}
          <div className="mb-4">
            <h1>Product Catalogue</h1>
            <p className="text-muted">Showing {filteredProducts.length} products</p>
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

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <h3>No products found</h3>
              <p className="text-muted">Try adjusting your filters or search term</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CataloguePage;
