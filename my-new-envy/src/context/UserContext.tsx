import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    console.log('User cleared');
  }, []);

  const initializeUser = useCallback(async () => {
    console.log('Initializing user...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found:', token);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        console.log('User set:', response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        clearUser();
      }
    } else {
      console.log('No token found');
    }
  }, [clearUser]);

  const logout = useCallback(() => {
    clearUser();
    console.log('User logged out');
  }, [clearUser]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, initializeUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
