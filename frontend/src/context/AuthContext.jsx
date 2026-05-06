/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

const getStoredAuth = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');

  if (!storedUser || !storedToken) {
    return { user: null, token: null, role: null };
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    return {
      user: parsedUser,
      token: storedToken,
      role: parsedUser.role || storedRole,
    };
  } catch (error) {
    console.warn('Invalid stored user data, clearing auth state.', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return { user: null, token: null, role: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = (userData, authToken) => {
    const userRole = userData.role || 'CUSTOMER';
    setAuth({ user: userData, token: authToken, role: userRole });
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setAuth({ user: null, token: null, role: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        role: auth.role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
