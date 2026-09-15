import { useNavigate } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
} from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';

function ListPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('logged');
    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Mi Lista</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="list-bg">
        <IonList inset className="list-card">
          <IonItem lines="full">
            <IonAvatar slot="start">
              <IonIcon icon={personCircleOutline} style={{ fontSize: 40 }} />
            </IonAvatar>
            <IonLabel>
              <h2>Elemento 1</h2>
              <p>Descripción breve</p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonAvatar slot="start">
              <IonIcon icon={personCircleOutline} style={{ fontSize: 40 }} />
            </IonAvatar>
            <IonLabel>
              <h2>Elemento 2</h2>
              <p>Descripción breve</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <div className="logout-wrapper">
          <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ListPage;
