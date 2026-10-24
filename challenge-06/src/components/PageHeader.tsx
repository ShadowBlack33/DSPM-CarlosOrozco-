import { IonBackButton, IonButton, IonButtons, IonHeader, IonIcon, IonToolbar, useIonRouter } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { NetPill } from './NetworkBanner';

const PageHeader = ({ back = true }: { back?: boolean }) => {
  const { logout } = useAuth();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root', 'replace');
  };

  return (
    <IonHeader>
      <IonToolbar>
        {back && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="" />
          </IonButtons>
        )}
        {back && <div slot="end" style={{ marginRight: 4 }}><NetPill /></div>}
        <IonButtons slot="end">
          <IonButton onClick={handleLogout} aria-label="Cerrar sesión" color="dark">
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
