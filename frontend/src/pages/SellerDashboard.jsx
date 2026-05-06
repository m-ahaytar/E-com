import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products] = useState([
    { id: 1, name: 'Sample Product 1', price: 29.99, stock: 100 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all fields');
      return;
    }
    const productData = {
      name: newProduct.name,
      description: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      categoryId: 1,
    };
    try {
      await createProduct(productData);
      alert('Product added successfully');
      setNewProduct({ name: '', price: '', stock: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.message || 'Error adding product');
    }
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
          <p className="text-muted">Welcome, {user?.username || 'Seller'}!</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-box text-primary"></i>
            </div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Products Listed</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-graph-up text-success"></i>
            </div>
            <div className="stat-value">$0</div>
            <div className="stat-label">Revenue</div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="bi bi-plus-circle me-2"></i>Add New Product
        </div>
        <div className="card-body">
          <button
            className="btn btn-sm btn-primary mb-3"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>

          {showForm && (
            <form onSubmit={handleAddProduct} className="mb-3">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-check-circle me-2"></i>Create Product
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="bi bi-list me-2"></i>Your Products
        </div>
        <div className="card-body">
          {products.length === 0 ? (
            <p className="text-muted">No products yet. Add your first product!</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
