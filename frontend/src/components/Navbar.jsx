import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';
import wmLogo from '../assets/wm-logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const { user, logout, role } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const userRole = user?.role || role;
  const displayName = user?.firstName || user?.username || 'Pilot';
  const cartCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const canShop = !userRole || userRole === 'CUSTOMER';

  const navLinkClass = ({ isActive }) => `wm-nav__link${isActive ? ' active' : ''}`;

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="wm-nav">
      <Link className="wm-nav__brand" to="/" onClick={() => setMenuOpen(false)}>
        <img alt="WM logo" className="wm-nav__logo" src={wmLogo} />
        <span className="wm-nav__brand-copy">
          <strong>WITH ME SHOP</strong>
          <small>We Move To The Future</small>
        </span>
      </Link>

      <button
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        className="wm-nav__toggle"
        onClick={() => setMenuOpen((current) => !current)}
        type="button"
      >
        <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
      </button>

      <nav className={`wm-nav__links${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
        <NavLink className={navLinkClass} end onClick={() => setMenuOpen(false)} to="/">
          Home
        </NavLink>
        <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/deals">
          Deals
        </NavLink>
        {canShop && (
          <>
            <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/catalogue">
              Products
            </NavLink>
            <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/catalogue?category=Gadgets">
              Gadgets
            </NavLink>
          </>
        )}
        {userRole === 'SELLER' && (
          <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/seller">
            Store
          </NavLink>
        )}
        {userRole === 'ADMIN' && (
          <>
            <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/admin">
              Admin
            </NavLink>
            <NavLink className={navLinkClass} onClick={() => setMenuOpen(false)} to="/admin/orders">
              Orders
            </NavLink>
          </>
        )}
      </nav>

      <div className="wm-nav__actions">
        {canShop && (
          <Link className="wm-icon-button" to="/cart" aria-label="Cart">
            <i className="bi bi-bag-fill" aria-hidden="true"></i>
            {cartCount > 0 && <span className="wm-count-badge">{cartCount}</span>}
          </Link>
        )}

        {user ? (
          <div className="wm-account">
            <button
              aria-expanded={accountOpen}
              className="wm-icon-button"
              onClick={() => setAccountOpen((current) => !current)}
              type="button"
            >
              <i className="bi bi-person-fill" aria-hidden="true"></i>
              <span className="visually-hidden">Account menu</span>
            </button>

            {accountOpen && (
              <div className="wm-account__menu">
                <p className="wm-account__eyebrow">Signed in as</p>
                <strong>{displayName}</strong>
                <small>{userRole || 'CUSTOMER'}</small>
                <Link
                  className="wm-account__item"
                  onClick={() => setAccountOpen(false)}
                  to={userRole === 'ADMIN' ? '/admin' : '/dashboard'}
                >
                  <i className="bi bi-speedometer2" aria-hidden="true"></i>
                  Dashboard
                </Link>
                <button className="wm-account__item" onClick={handleLogout} type="button">
                  <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="wm-auth-actions">
            <Link className="wm-icon-button" to="/login" aria-label="Login">
              <i className="bi bi-person-fill" aria-hidden="true"></i>
            </Link>
            <Button className="wm-nav__join" size="sm" to="/register" variant="outline">
              Join
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
