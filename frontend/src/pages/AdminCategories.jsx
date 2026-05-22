import { useState, useEffect } from 'react';
import * as productService from '../services/productService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await productService.createCategory(formData);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch {
      setError('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      // On passe par le service pour garder une logique claire et centralisee.
      await productService.deleteCategory(id);
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  if (loading) {
    return <div className="admin-page wm-loading"><span className="spinner-border" role="status" aria-hidden="true"></span><span>Loading categories...</span></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Categories</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-form">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary">
            Add Category
          </button>
        </form>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category.id)}
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

export default AdminCategories;
