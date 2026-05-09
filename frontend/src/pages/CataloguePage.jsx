import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts, getCategories, getDeals } from '../services/productService';
import { useCart } from '../context/CartContext';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { buildCategoryOptions, getRawCategoryName } from '../utils/productTech';

const CataloguePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    const searchFromUrl = params.get('search');
    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }
  }, [location.search]);

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
        setDeals(dealsData);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => (
    products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          !selectedCategory ||
          getRawCategoryName(product).toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      })
  ), [priceRange, products, search, selectedCategory, sortBy]);

  const categoryCounts = useMemo(() => (
    buildCategoryOptions(categories, products)
  ), [categories, products]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange([0, 2500]);
    setSortBy('');
  };

  return (
    <div className="wm-page wm-catalogue">
      <header className="wm-page-heading">
        <div>
          <Badge icon="bi-grid-3x3-gap" variant="info">Product Matrix</Badge>
          <h1>Product Catalogue</h1>
          <p>
            {filteredProducts.length} products visible from {categories.length || 'live'} backend categories.
          </p>
        </div>
        <div className="wm-view-toggle" role="group" aria-label="View mode">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            title="Grid view"
            type="button"
          >
            <i className="bi bi-grid-3x3-gap" aria-hidden="true"></i>
          </button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            title="List view"
            type="button"
          >
            <i className="bi bi-list-ul" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <div className="wm-catalogue__layout">
        <aside className="wm-panel wm-filters" aria-label="Product filters">
          <div className="wm-panel__header">
            <h2>Filters</h2>
            <i className="bi bi-funnel" aria-hidden="true"></i>
          </div>

          <label className="wm-field">
            <span>Search</span>
            <input
              className="form-control"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              type="text"
              value={search}
            />
          </label>

          <div className="wm-filter-block">
            <span className="wm-filter-block__label">Category</span>
            <button
              className={`wm-filter-option${selectedCategory === '' ? ' active' : ''}`}
              onClick={() => setSelectedCategory('')}
              type="button"
            >
              <i className="bi bi-stars" aria-hidden="true"></i>
              All systems
              <small>{products.length}</small>
            </button>
            {categoryCounts.map((category) => (
              <button
                className={`wm-filter-option${selectedCategory === category.name ? ' active' : ''}`}
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                type="button"
              >
                <i className={`bi ${category.icon}`} aria-hidden="true"></i>
                {category.name}
                <small>{category.count}</small>
              </button>
            ))}
          </div>

          <div className="wm-filter-block">
            <span className="wm-filter-block__label">Price Range</span>
            <div className="wm-price-inputs">
              <input
                className="form-control"
                min="0"
                onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
                type="number"
                value={priceRange[0]}
              />
              <input
                className="form-control"
                min="0"
                onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
                type="number"
                value={priceRange[1]}
              />
            </div>
            <small className="wm-muted">${priceRange[0]} - ${priceRange[1]}</small>
          </div>

          <label className="wm-field">
            <span>Sort By</span>
            <select className="form-select" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>

          <Button icon="bi-arrow-clockwise" onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </aside>

        <section className="wm-catalogue__products">
          <div className="wm-active-filters">
            <Badge variant="default">Search: {search || 'All'}</Badge>
            <Badge variant="default">Category: {selectedCategory || 'All'}</Badge>
            <Badge variant="default">Range: ${priceRange[0]}-${priceRange[1]}</Badge>
            {sortBy && <Badge variant="default">Sort: {sortBy}</Badge>}
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

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="wm-empty-state">
              <i className="bi bi-inbox" aria-hidden="true"></i>
              <h2>No products found</h2>
              <p>Try changing the signal filters or search term.</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className={`wm-product-grid${viewMode === 'list' ? ' is-list' : ''}`}>
              {filteredProducts.map((product) => {
                const productDeal = deals.find((d) => d.productId === product.id) ?? null;
                return (
                  <ProductCard key={product.id} product={product} deal={productDeal} onAddToCart={addToCart} />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CataloguePage;
