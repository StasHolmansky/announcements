import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Token } from '../types/types';

// Create the context
const TokenContext = createContext<{ token: Token[], setToken: React.Dispatch<React.SetStateAction<Token[]>> } | undefined>(undefined);

// Create a provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<Token[]>([]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the Token context
export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};