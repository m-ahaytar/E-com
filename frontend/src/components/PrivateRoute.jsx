import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getDashboardPath = (role) => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'SELLER') return '/seller';
  return '/dashboard';
};

const PrivateRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role || role;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return children;
};

export default PrivateRoute;
