import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  // Calculate total items in cart
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-shop me-2"></i>E-Shop
        </Link>

        {/* Hamburger Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Left - Main Navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalogue">
                <i className="bi bi-grid-3x3-gap me-1"></i>Catalogue
              </Link>
            </li>
          </ul>

          {/* Right - User & Cart */}
          <ul className="navbar-nav ms-auto">
            {/* Cart Link */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart3"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Admin Links (if logged in as admin) */}
            {user?.role === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-lock-fill me-1"></i>Admin
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      <i className="bi bi-graph-up me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/products">
                      <i className="bi bi-box me-2"></i>Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/categories">
                      <i className="bi bi-tag me-2"></i>Categories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/orders">
                      <i className="bi bi-receipt me-2"></i>Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/users">
                      <i className="bi bi-people me-2"></i>Users
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* User Menu */}
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>{user.firstName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="bi bi-person me-2"></i>My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={logout}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
