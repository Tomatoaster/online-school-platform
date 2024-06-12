import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const useAuthPersistence = (authState) => {
  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);
};

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuthState = localStorage.getItem('authState');
    return savedAuthState ? JSON.parse(savedAuthState) : { username: '', role: '' };
  });

  useAuthPersistence(authState);

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
