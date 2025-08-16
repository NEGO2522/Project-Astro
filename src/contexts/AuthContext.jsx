import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
export default AuthContext;
