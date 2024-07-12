import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If there's no token, just clear the user state
        setUser(null);
        localStorage.removeItem('token');
        return;
      }
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear the user state and remove the token
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);

  const initializeUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, initializeUser }}>
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