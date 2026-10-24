import type { ReactNode } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import useRedirectOnce from './useRedirectOnce';

// Solo deja pasar si hay sesión; si no, redirige al login (una sola vez)
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  useRedirectOnce(!isLoading && !user, '/login');

  if (isLoading || !user) {
    return (
      <IonPage>
        <IonContent>
          <div className="center-fill"><IonSpinner name="crescent" color="primary" /></div>
        </IonContent>
      </IonPage>
    );
  }
  return <>{children}</>;
};

export default PrivateRoute;
