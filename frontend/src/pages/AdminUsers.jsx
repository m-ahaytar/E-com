import { useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', firstName: '', lastName: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      role: user.role || 'CUSTOMER',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ role: '', firstName: '', lastName: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await authService.updateUser(id, editForm);
      setSuccess('User updated successfully');
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.firstName || user.email}? This cannot be undone.`)) return;
    try {
      await authService.deleteUser(user.id);
      setSuccess('User deleted successfully');
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="admin-page wm-loading"><span className="spinner-border" role="status" aria-hidden="true"></span><span>Loading users...</span></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Users</h1>
      </div>

      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <i className="bi bi-exclamation-circle me-2"></i>{error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setError('')}></button>
      </div>}
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
        <i className="bi bi-check-circle me-2"></i>{success}
        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setSuccess('')}></button>
      </div>}

      {users.length === 0 && !error ? (
        <p>No users found.</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  {editingId === user.id ? (
                    <>
                      <td>
                        <input
                          type="text" className="form-control form-control-sm"
                          name="firstName" value={editForm.firstName}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text" className="form-control form-control-sm"
                          name="lastName" value={editForm.lastName}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          name="role" value={editForm.role}
                          onChange={handleEditChange}
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="SELLER">SELLER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleSave(user.id)}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(user)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
