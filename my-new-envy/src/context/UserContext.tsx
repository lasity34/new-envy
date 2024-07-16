import React, { createContext, useContext, ReactNode } from 'react';
import { useAppContext } from './AppContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, login, logout, initializeUser } = useAppContext();

  return (
    <UserContext.Provider value={{ user, login, logout, initializeUser }}>
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