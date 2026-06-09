import { useState, useEffect } from 'react';
import * as productService from '../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    if (formData.name && formData.name.length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price)) {
      errors.price = 'Price is required and must be a number';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (price > 999999.99) {
      errors.price = 'Price is too high';
    }
    
    const stock = parseInt(formData.stock);
    if (formData.stock === '' || isNaN(stock)) {
      errors.stock = 'Stock is required and must be a number';
    } else if (stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (formData.imageUrl && formData.imageUrl.length > 500) {
      errors.imageUrl = 'Image URL cannot exceed 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
    });
    setValidationErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      fetchData();
    } catch {
      setError('Failed to delete product');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      imageUrl: '',
    });
    setValidationErrors({});
  };

  if (loading) {
    return <div className="admin-page wm-loading"><span className="spinner-border" role="status" aria-hidden="true"></span><span>Loading...</span></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="admin-form">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name (3-100 characters)"
                maxLength="100"
              />
              {validationErrors.name && <span className="form-error">{validationErrors.name}</span>}
              <small className="char-count">{formData.name.length}/100</small>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description (max 1000 characters)"
                maxLength="1000"
                rows="4"
              />
              {validationErrors.description && <span className="form-error">{validationErrors.description}</span>}
              <small className="char-count">{formData.description.length}/1000</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price * (USD)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  max="999999.99"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                {validationErrors.price && <span className="form-error">{validationErrors.price}</span>}
              </div>

              <div className="form-group">
                <label>Stock * (Units)</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
                {validationErrors.stock && <span className="form-error">{validationErrors.stock}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && <span className="form-error">{validationErrors.categoryId}</span>}
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {validationErrors.imageUrl && <span className="form-error">{validationErrors.imageUrl}</span>}
            </div>

            <button type="submit" className="btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.category?.name || '-'}</td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
