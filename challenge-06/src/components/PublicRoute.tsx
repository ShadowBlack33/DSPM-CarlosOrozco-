import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import useRedirectOnce from './useRedirectOnce';

// Con sesión activa no tiene sentido ver login/registro
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  useRedirectOnce(!isLoading && Boolean(user), '/home');
  return <>{children}</>;
};

export default PublicRoute;
