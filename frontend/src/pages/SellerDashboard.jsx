import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';
import * as orderService from '../services/orderService';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const [showDealForm, setShowDealForm] = useState(false);
  const [dealForm, setDealForm] = useState({
    productId: '', discountPercentage: '', startDate: '', endDate: '',
  });

  const sellerEmail = user?.email;

  useEffect(() => {
    fetchProducts();
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerEmail]);

  useEffect(() => {
    if (products.length > 0) {
      fetchOrders();
    } else {
      setLoadingOrders(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError('');
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts({ sellerEmail }),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchDeals = async () => {
    setLoadingDeals(true);
    try {
      const dealsData = await productService.getAllDeals();
      setDeals(dealsData);
    } catch {
      // Non-critical, deals section will show empty
    } finally {
      setLoadingDeals(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const productIds = products.map((p) => p.id);
      if (productIds.length === 0) {
        setOrders([]);
        return;
      }
      const data = await orderService.getOrdersByProducts(productIds);
      setOrders(data);
    } catch {
      // Non-critical, orders section will show empty
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const sellerProductIds = new Set(products.map((p) => p.id));
  const sellerDeals = deals.filter((d) => sellerProductIds.has(d.productId));

  const validateProductForm = () => {
    const errors = {};
    if (!productForm.name || productForm.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    if (productForm.name && productForm.name.length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
    }
    if (productForm.description && productForm.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }
    const price = parseFloat(productForm.price);
    if (!productForm.price || isNaN(price)) {
      errors.price = 'Price is required and must be a number';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (price > 999999.99) {
      errors.price = 'Price is too high';
    }
    const stock = parseInt(productForm.stock);
    if (productForm.stock === '' || isNaN(stock)) {
      errors.stock = 'Stock is required and must be a number';
    } else if (stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }
    if (!productForm.categoryId) {
      errors.categoryId = 'Category is required';
    }
    if (productForm.imageUrl && productForm.imageUrl.length > 500) {
      errors.imageUrl = 'Image URL cannot exceed 500 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateProductForm()) return;

    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        categoryId: parseInt(productForm.categoryId),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
      } else {
        await productService.createProduct(data);
      }

      resetProductForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
    });
    setValidationErrors({});
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
    setValidationErrors({});
  };


  const handleDealChange = (e) => {
    const { name, value } = e.target;
    setDealForm({ ...dealForm, [name]: value });
  };

  const handleDealSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endDate = new Date(dealForm.endDate);
    const startDate = new Date(dealForm.startDate);
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      const payload = {
        productId: parseInt(dealForm.productId),
        discountPercentage: parseFloat(dealForm.discountPercentage),
        startDate: startDate.toISOString().replace('T', ' ').slice(0, 19),
        endDate: endDate.toISOString().replace('T', ' ').slice(0, 19),
      };

      await productService.createDeal(payload);
      setShowDealForm(false);
      setDealForm({ productId: '', discountPercentage: '', startDate: '', endDate: '' });
      fetchDeals();
    } catch (err) {
      setError(err.message || 'Failed to create deal');
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await productService.deleteDeal(id);
      fetchDeals();
    } catch {
      setError('Failed to delete deal');
    }
  };

  const getDealStatusBadge = (deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);
    if (now < start) return <span className="badge bg-info">Upcoming</span>;
    if (now > end) return <span className="badge bg-secondary">Expired</span>;
    return <span className="badge bg-success">Active</span>;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1>Seller Dashboard</h1>
          <p className="text-muted">Welcome, {user?.firstName || 'Seller'}!</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setError('')}></button>
        </div>
      )}

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Products Listed</h6>
                <h2 className="mb-0 fw-bold">{products.length}</h2>
              </div>
              <i className="bi bi-box" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Active Deals</h6>
                <h2 className="mb-0 fw-bold">{sellerDeals.filter(d => new Date(d.endDate) > new Date()).length}</h2>
              </div>
              <i className="bi bi-tag-fill" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm bg-info text-white h-100">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50">Total Deals</h6>
                <h2 className="mb-0 fw-bold">{sellerDeals.length}</h2>
              </div>
              <i className="bi bi-receipt" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="bi bi-box-seam me-2"></i>Your Products</span>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowProductForm(!showProductForm)}
          >
            {showProductForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
        <div className="card-body">
          {showProductForm && (
            <div className="mb-4 p-3 border rounded">
              <h5 className="mb-3">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
              <form onSubmit={handleProductSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text" className="form-control" name="name"
                    value={productForm.name} onChange={handleProductChange}
                    placeholder="Product name (3-100 characters)" maxLength="100"
                  />
                  {validationErrors.name && <small className="text-danger">{validationErrors.name}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control" name="description" rows="3"
                    value={productForm.description} onChange={handleProductChange}
                    placeholder="Product description (max 1000 characters)" maxLength="1000"
                  />
                  {validationErrors.description && <small className="text-danger">{validationErrors.description}</small>}
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number" className="form-control" name="price"
                      step="0.01" min="0" max="999999.99"
                      value={productForm.price} onChange={handleProductChange}
                      placeholder="0.00"
                    />
                    {validationErrors.price && <small className="text-danger">{validationErrors.price}</small>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number" className="form-control" name="stock" min="0"
                      value={productForm.stock} onChange={handleProductChange}
                      placeholder="0"
                    />
                    {validationErrors.stock && <small className="text-danger">{validationErrors.stock}</small>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select" name="categoryId"
                      value={productForm.categoryId} onChange={handleProductChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {validationErrors.categoryId && <small className="text-danger">{validationErrors.categoryId}</small>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url" className="form-control" name="imageUrl"
                    value={productForm.imageUrl} onChange={handleProductChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {validationErrors.imageUrl && <small className="text-danger">{validationErrors.imageUrl}</small>}
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle me-2"></i>{editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </div>
          )}

          {loadingProducts ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted">You haven't added any products yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>{product.categoryName || '-'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEditProduct(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DEALS SECTION */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="bi bi-tag-fill me-2"></i>Your Deals</span>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowDealForm(!showDealForm)}
            disabled={products.length === 0}
          >
            {showDealForm ? 'Cancel' : 'Create Deal'}
          </button>
        </div>
        <div className="card-body">
          {showDealForm && (
            <div className="mb-4 p-3 border rounded">
              <h5 className="mb-3">Create New Deal</h5>
              <form onSubmit={handleDealSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product *</label>
                  <select
                    className="form-select" name="productId"
                    value={dealForm.productId} onChange={handleDealChange}
                  >
                    <option value="">Select your product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price?.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Discount % *</label>
                    <input
                      type="number" className="form-control" name="discountPercentage"
                      min="1" max="100" step="0.1"
                      value={dealForm.discountPercentage} onChange={handleDealChange}
                      placeholder="e.g. 25"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="datetime-local" className="form-control" name="startDate"
                      value={dealForm.startDate} onChange={handleDealChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">End Date *</label>
                    <input
                      type="datetime-local" className="form-control" name="endDate"
                      value={dealForm.endDate} onChange={handleDealChange}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle me-2"></i>Create Deal
                </button>
              </form>
            </div>
          )}

          {loadingDeals ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : sellerDeals.length === 0 ? (
            <p className="text-muted">No deals on your products yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Discount</th>
                    <th>Original</th>
                    <th>Deal Price</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerDeals.map((deal) => (
                    <tr key={deal.id}>
                      <td>{deal.productName}</td>
                      <td>-{deal.discountPercentage}%</td>
                      <td>${deal.originalPrice?.toFixed(2)}</td>
                      <td style={{ color: 'var(--bs-primary)', fontWeight: 700 }}>
                        ${deal.discountedPrice?.toFixed(2)}
                      </td>
                      <td>{new Date(deal.startDate).toLocaleDateString()}</td>
                      <td>{new Date(deal.endDate).toLocaleDateString()}</td>
                      <td>{getDealStatusBadge(deal)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteDeal(deal.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ORDERS SECTION */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="bi bi-receipt me-2"></i>Orders from Your Products</span>
        </div>
        <div className="card-body">
          {loadingOrders ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted">No orders yet for your products.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber || `#${order.id}`}</td>
                      <td>
                        {order.items?.map((item, idx) => (
                          <div key={idx}>
                            {item.productName} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>${order.total?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${order.status === 'PENDING' ? 'bg-warning' : order.status === 'DELIVERED' ? 'bg-success' : order.status === 'CANCELLED' ? 'bg-danger' : 'bg-info'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
