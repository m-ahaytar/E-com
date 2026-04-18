import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row mb-4">
          {/* About Section */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-shop me-2"></i>E-Shop
            </h5>
            <p className="text-muted small">
              Your trusted online shopping destination for quality products at great prices.
            </p>
            <div className="footer-social mt-3">
              <a href="#" className="text-white me-3" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white me-3" title="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white me-3" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogue" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Catalogue
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Shipping Info
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right"></i> Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="fw-bold mb-3">Newsletter</h5>
            <p className="text-muted small mb-3">Subscribe to get exclusive offers and updates</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Email address"
              />
              <button className="btn btn-primary" type="button">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="bg-secondary" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0">
              &copy; {currentYear} E-Shop. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-muted">
              <a href="#" className="text-muted text-decoration-none me-3">Privacy Policy</a>
              <a href="#" className="text-muted text-decoration-none me-3">Terms of Service</a>
              <a href="#" className="text-muted text-decoration-none">Cookie Policy</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
