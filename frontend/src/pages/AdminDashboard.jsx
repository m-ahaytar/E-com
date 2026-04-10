import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-nav">
        <Link to="/admin/products" className="admin-nav-card">
          <h2>Products</h2>
          <p>Manage product catalog</p>
        </Link>
        <Link to="/admin/categories" className="admin-nav-card">
          <h2>Categories</h2>
          <p>Manage product categories</p>
        </Link>
        <Link to="/admin/orders" className="admin-nav-card">
          <h2>Orders</h2>
          <p>View and manage orders</p>
        </Link>
        <Link to="/admin/users" className="admin-nav-card">
          <h2>Users</h2>
          <p>View registered users</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
