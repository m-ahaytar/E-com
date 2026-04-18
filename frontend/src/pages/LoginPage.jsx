import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
    
    setLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg">
              {/* HEADER */}
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </h2>
              </div>

              <div className="card-body p-5">
                {/* ERROR MESSAGE */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit}>
                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label fw-600">Email Address</label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${validationErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.email}
                      </div>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4">
                    <label className="form-label fw-600">Password</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.password}
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2"></i>Login
                      </>
                    )}
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="text-center mb-3">
                  <small className="text-muted">New here?</small>
                </div>

                {/* SIGNUP LINK */}
                <Link to="/register" className="btn btn-outline-secondary btn-lg w-100">
                  <i className="bi bi-person-plus me-2"></i>Create Account
                </Link>
              </div>
            </div>

            {/* FOOTER TEXT */}
            <p className="text-center text-muted mt-4 small">
              <i className="bi bi-shield-check"></i> Your account is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
