import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import Badge from '../components/Badge';
import Button from '../components/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      const data = await authService.login(formData.email, formData.password);
      login(
        {
          email: data.email,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        data.token
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wm-page wm-auth-page">
      <section className="wm-auth-card">
        <div className="wm-auth-card__brand">
          <span className="wm-nav__mark">WM</span>
          <div>
            <Badge icon="bi-shield-lock" variant="info">Secure Access</Badge>
            <h1>Login</h1>
            <p>Enter the With Me Shop command deck.</p>
          </div>
        </div>

        {error && (
          <div className="wm-alert wm-alert--danger" role="alert">
            <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
            {error}
          </div>
        )}

        <form className="wm-auth-form" onSubmit={handleSubmit}>
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
              name="password"
              onChange={handleChange}
              placeholder="Password"
              type="password"
              value={formData.password}
            />
            {validationErrors.password && <small className="wm-field-error">{validationErrors.password}</small>}
          </label>

          <Button disabled={loading} icon="bi-lock" size="lg" type="submit" variant="primary">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="wm-auth-card__footer">
          <span>New here?</span>
          <Link to="/register">Create Account</Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
