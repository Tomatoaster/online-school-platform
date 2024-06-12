import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ token: null, user: null });
  };

  const isAuthenticated = () => !!authState.user;

  const isAdmin = () => {
    return authState.user && authState.user.role === 'admin';
  };

  const isTeacher = () => {
    return authState.user && authState.user.role === 'teacher';
  };

  const isOwner = (owner, viewer) => {
    return owner === viewer;
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAuthenticated, isAdmin, isTeacher, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
