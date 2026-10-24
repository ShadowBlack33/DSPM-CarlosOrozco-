import { createContext, useContext, type ReactNode } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';

type AuthContextValue = ReturnType<typeof useFirebaseAuth>;

// 1. Crear el contexto
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. Provider que comparte el usuario y las funciones de login/registro/logout
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// 4. Consumir el contexto desde cualquier página
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
