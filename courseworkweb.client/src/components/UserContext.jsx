import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('auth_token'); // Извлекаем токен
  });

  useEffect(() => {
    if (user && authToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_token', authToken);
    }
  }, [user, authToken]);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = () => {
    return !!authToken;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated, authToken }}>
      {children}
    </UserContext.Provider>
  );
};
