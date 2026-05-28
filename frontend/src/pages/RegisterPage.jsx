import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import Badge from '../components/Badge';
import Button from '../components/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'CUSTOMER',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword: _confirmPassword, ...registerData } = formData;
      const data = await authService.register(registerData);
      if (data?.token) {
        login(data.user, data.token);
        navigate('/');
        return;
      }
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wm-page wm-auth-page">
      <section className="wm-auth-card wm-auth-card--wide">
        <div className="wm-auth-card__brand">
          <span className="wm-nav__mark">WM</span>
          <div>
            <Badge icon="bi-person-plus" variant="info">New Signal</Badge>
            <h1>Create Account</h1>
            <p>Join With Me Shop and move with the future.</p>
          </div>
        </div>

        {error && (
          <div className="wm-alert wm-alert--danger" role="alert">
            <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
            {error}
          </div>
        )}

        <form className="wm-auth-form" onSubmit={handleSubmit}>
          <div className="wm-form-grid">
            <label className="wm-field">
              <span>First Name</span>
              <input
                className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                maxLength="50"
                name="firstName"
                onChange={handleChange}
                placeholder="John"
                type="text"
                value={formData.firstName}
              />
              {validationErrors.firstName && <small className="wm-field-error">{validationErrors.firstName}</small>}
            </label>

            <label className="wm-field">
              <span>Last Name</span>
              <input
                className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                maxLength="50"
                name="lastName"
                onChange={handleChange}
                placeholder="Doe"
                type="text"
                value={formData.lastName}
              />
              {validationErrors.lastName && <small className="wm-field-error">{validationErrors.lastName}</small>}
            </label>
          </div>

          <label className="wm-field">
            <span>Email Address</span>
            <input
              className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
              name="email"
              onChange={handleChange}
              placeholder="your@email.com"
              type="email"
              value={formData.email}
            />
            {validationErrors.email && <small className="wm-field-error">{validationErrors.email}</small>}
          </label>

          <label className="wm-field">
            <span>Password</span>
            <input
              className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
              maxLength="100"
              name="password"
              onChange={handleChange}
              placeholder="At least 6 characters"
              type="password"
              value={formData.password}
            />
            {validationErrors.password && <small className="wm-field-error">{validationErrors.password}</small>}
          </label>

          <label className="wm-field">
            <span>Confirm Password</span>
            <input
              className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
              maxLength="100"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm password"
              type="password"
              value={formData.confirmPassword}
            />
            {validationErrors.confirmPassword && <small className="wm-field-error">{validationErrors.confirmPassword}</small>}
          </label>

          <Button disabled={loading} icon="bi-person-check" size="lg" type="submit" variant="primary">
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <div className="wm-auth-card__footer">
          <span>Already registered?</span>
          <Link to="/login">Login Instead</Link>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
