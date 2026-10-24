import { createContext, useContext, type ReactNode } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';

type AuthValue = ReturnType<typeof useFirebaseAuth>;

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
