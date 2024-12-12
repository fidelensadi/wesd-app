import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/user';

interface OnlineState {
  onlineUsers: User[];
  signingStatus: Record<number, string | null>; // householdId -> userEmail
}

interface OnlineContextType {
  onlineUsers: User[];
  signingStatus: Record<number, string | null>;
  setUserOnline: (user: User) => void;
  setUserOffline: (email: string) => void;
  setSigningStatus: (householdId: number, userEmail: string | null) => void;
}

const OnlineContext = createContext<OnlineContextType | null>(null);

export const useOnline = () => {
  const context = useContext(OnlineContext);
  if (!context) {
    throw new Error('useOnline must be used within an OnlineProvider');
  }
  return context;
};

export const OnlineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnlineState>({
    onlineUsers: [],
    signingStatus: {}
  });

  const setUserOnline = (user: User) => {
    setState(prev => ({
      ...prev,
      onlineUsers: [...prev.onlineUsers.filter(u => u.email !== user.email), user]
    }));
  };

  const setUserOffline = (email: string) => {
    setState(prev => ({
      ...prev,
      onlineUsers: prev.onlineUsers.filter(u => u.email !== email),
      signingStatus: Object.fromEntries(
        Object.entries(prev.signingStatus).filter(([_, userEmail]) => userEmail !== email)
      )
    }));
  };

  const setSigningStatus = (householdId: number, userEmail: string | null) => {
    setState(prev => ({
      ...prev,
      signingStatus: {
        ...prev.signingStatus,
        [householdId]: userEmail
      }
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setState({ onlineUsers: [], signingStatus: {} });
    };
  }, []);

  return (
    <OnlineContext.Provider value={{
      onlineUsers: state.onlineUsers,
      signingStatus: state.signingStatus,
      setUserOnline,
      setUserOffline,
      setSigningStatus
    }}>
      {children}
    </OnlineContext.Provider>
  );
};