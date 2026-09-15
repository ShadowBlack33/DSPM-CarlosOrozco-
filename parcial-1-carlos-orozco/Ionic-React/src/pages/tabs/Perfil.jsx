import { useNavigate } from 'react-router-dom'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

function usuarioActual() {
  const sesion = localStorage.getItem('mediclinic_ionic_session')
  return sesion ? JSON.parse(sesion).username : null
}

export default function Perfil() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('mediclinic_ionic_session')
    navigate('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Usuario</IonLabel>
          <IonLabel slot="end">{usuarioActual()}</IonLabel>
        </IonItem>

        <IonButton expand="block" color="danger" className="ion-margin-top" onClick={handleLogout}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  )
}
