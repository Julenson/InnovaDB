'use client';

import React, { createContext, useContext } from 'react';
import { useUser } from '@/hooks/use-user';

type User = {
  id: number;
  email: string;
  category: string;
  name?: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para consumir el contexto fácilmente
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de un Providers');
  }
  return context;
}
