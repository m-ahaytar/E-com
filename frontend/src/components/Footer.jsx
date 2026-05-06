import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wm-footer">
      <div className="wm-footer__inner">
        <div className="wm-footer__brand">
          <span className="wm-nav__mark">WM</span>
          <div>
            <h2>With Me Shop</h2>
            <p>We Move To The Future</p>
          </div>
        </div>

        <nav className="wm-footer__links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/catalogue">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </nav>

        <div className="wm-footer__signal">
          <span>48H Dispatch</span>
          <span>Secure Checkout</span>
          <span>Tech Only</span>
        </div>
      </div>

      <div className="wm-footer__bottom">
        <span>&copy; {currentYear} With Me Shop</span>
        <span>All systems operational</span>
      </div>
    </footer>
  );
};

export default Footer;
