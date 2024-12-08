// import React, { createContext, useState, useContext } from 'react';

// const UserContext = createContext();

// export const useUser = () => {
//   return useContext(UserContext);
// };

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };


// добавление в корзину
// components/UserContext.jsx
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
      localStorage.setItem('auth_token', authToken); // Обновляем токен в localStorage
    }
  }, [user, authToken]);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token); // Сохраняем токен
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token); // Сохраняем токен в localStorage
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = () => {
    return !!authToken; // Проверка на наличие токена
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated, authToken }}>
      {children}
    </UserContext.Provider>
  );
};
