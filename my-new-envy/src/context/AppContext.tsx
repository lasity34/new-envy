import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      console.log('AppContext - Attempting login for user:', username);
      console.log('AppContext - Login data:', { identifier: username, password });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { identifier: username, password });
      console.log('AppContext - Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      console.log('AppContext - User set after login:', response.data.user);
    } catch (error) {
      console.error('AppContext - Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('AppContext - Error response:', error.response?.data);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('AppContext - Attempting logout');
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('AppContext - Logout failed:', error);
    } finally {
      console.log('AppContext - Clearing user state and removing token');
      setUser(null);
      localStorage.removeItem('token');
      // We'll handle cart clearing in CartContext
    }
  }, []);

  const initializeUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('AppContext - Initializing user with stored token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('AppContext - User data fetched:', response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error('AppContext - Failed to initialize user:', error);
        localStorage.removeItem('token');
      }
    } else {
      console.log('AppContext - No token found, user not initialized');
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, login, logout, initializeUser }}>
      <CartProvider user={user}>
        <UserProvider>
          {children}
        </UserProvider>
      </CartProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};