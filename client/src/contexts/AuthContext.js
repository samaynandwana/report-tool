import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Developer',
    email: 'john@example.com',
    role: 'employee',
    manager_id: 1
  });

  const switchUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 