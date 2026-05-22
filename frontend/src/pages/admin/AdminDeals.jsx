import { useState, useEffect } from 'react';
import { getAllDeals, getProducts, createDeal, updateDeal, deleteDeal } from '../../services/productService';

const AdminDeals = () => {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsData, productsData] = await Promise.all([
        getAllDeals(),
        getProducts(),
      ]);
      setDeals(dealsData);
      setProducts(productsData);
    } catch {
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endDate = new Date(formData.endDate);
    const startDate = new Date(formData.startDate);
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      const payload = {
        productId: parseInt(formData.productId),
        discountPercentage: parseFloat(formData.discountPercentage),
        startDate: startDate.toISOString().replace('T', ' ').slice(0, 19),
        endDate: endDate.toISOString().replace('T', ' ').slice(0, 19),
      };

      if (editingDeal) {
        await updateDeal(editingDeal.id, payload);
      } else {
        await createDeal(payload);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      productId: deal.productId.toString(),
      discountPercentage: deal.discountPercentage.toString(),
      startDate: formatDateForInput(deal.startDate),
      endDate: formatDateForInput(deal.endDate),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await deleteDeal(id);
      fetchData();
    } catch {
      setError('Failed to delete deal');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDeal(null);
    setFormData({ productId: '', discountPercentage: '', startDate: '', endDate: '' });
  };

  const getStatusBadge = (deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);

    if (now < start) {
      return <span className="wm-badge wm-badge--limited">Upcoming</span>;
    }
    if (now > end) {
      return <span className="wm-badge wm-badge--danger">Expired</span>;
    }
    return <span className="wm-badge wm-badge--success">Active</span>;
  };

  if (loading) {
    return <div className="admin-page wm-loading"><span className="spinner-border" role="status" aria-hidden="true"></span><span>Loading deals...</span></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Deals</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Deal'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="admin-form">
          <h2>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product *</label>
              <select name="productId" value={formData.productId} onChange={handleChange}>
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price?.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Discount % *</label>
                <input
                  type="number"
                  name="discountPercentage"
                  min="1"
                  max="100"
                  step="0.1"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {editingDeal ? 'Update Deal' : 'Add Deal'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
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
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.id}</td>
                <td>{deal.productName}</td>
                <td>-{deal.discountPercentage}%</td>
                <td>${deal.originalPrice?.toFixed(2)}</td>
                <td style={{ color: 'var(--space-cyan)', fontWeight: 700 }}>
                  ${deal.discountedPrice?.toFixed(2)}
                </td>
                <td>{new Date(deal.startDate).toLocaleDateString()}</td>
                <td>{new Date(deal.endDate).toLocaleDateString()}</td>
                <td>{getStatusBadge(deal)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(deal)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(deal.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDeals;
