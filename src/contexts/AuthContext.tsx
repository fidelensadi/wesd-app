import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserCredentials } from '../types/user';
import { authenticateUser } from '../data/users';
import { sessionService } from '../services/sessionService';
import { householdService } from '../services/householdService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return sessionService.getSession();
  });

  useEffect(() => {
    if (user) {
      sessionService.saveSession(user);
    } else {
      sessionService.clearSession();
      householdService.clearStorage();
    }
  }, [user]);

  const login = async (credentials: UserCredentials) => {
    const authenticatedUser = authenticateUser(credentials);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};