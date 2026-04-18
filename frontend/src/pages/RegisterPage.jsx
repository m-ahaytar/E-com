import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    // Validate first name
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.firstName && formData.firstName.length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }
    
    // Validate last name
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (formData.lastName && formData.lastName.length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }
    
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
    } else if (formData.password.length > 100) {
      errors.password = 'Password cannot exceed 100 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword: _, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                  <i className="bi bi-person-plus me-2"></i>Create Account
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

                {/* REGISTRATION FORM */}
                <form onSubmit={handleSubmit}>
                  {/* FIRST NAME */}
                  <div className="mb-3">
                    <label className="form-label fw-600">First Name *</label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${validationErrors.firstName ? 'is-invalid' : ''}`}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      maxLength="50"
                    />
                    {validationErrors.firstName && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.firstName}
                      </div>
                    )}
                  </div>

                  {/* LAST NAME */}
                  <div className="mb-3">
                    <label className="form-label fw-600">Last Name *</label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${validationErrors.lastName ? 'is-invalid' : ''}`}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      maxLength="50"
                    />
                    {validationErrors.lastName && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.lastName}
                      </div>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label fw-600">Email Address *</label>
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
                  <div className="mb-3">
                    <label className="form-label fw-600">Password *</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      maxLength="100"
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.password}
                      </div>
                    )}
                    <small className="text-muted d-block mt-1">Must be at least 6 characters long</small>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="mb-4">
                    <label className="form-label fw-600">Confirm Password *</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      maxLength="100"
                    />
                    {validationErrors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>{validationErrors.confirmPassword}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>Register
                      </>
                    )}
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="text-center mb-3">
                  <small className="text-muted">Already registered?</small>
                </div>

                {/* LOGIN LINK */}
                <Link to="/login" className="btn btn-outline-secondary btn-lg w-100">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login Instead
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

export default RegisterPage;
