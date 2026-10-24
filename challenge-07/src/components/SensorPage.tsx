import type { CSSProperties, ReactNode } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { sensorByPath } from '../sensors';

interface Props { path: string; description: string; error?: string | null; children: ReactNode }

// Estructura común: el color del sensor se propaga con la variable --sensor
const SensorPage = ({ path, description, error, children }: Props) => {
  const s = sensorByPath(path);
  return (
    <IonPage style={{ '--sensor': s.color, '--ion-color-primary': s.color } as CSSProperties}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/home" text="Sensores" /></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <header className="sensor-head">
          <span className="sensor-head__plugin">{s.plugin}</span>
          <h1>{s.name}</h1>
          <p>{description}</p>
        </header>
        <div className="sensor-body">
          {error && <div className="alert" role="alert">{error}</div>}
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SensorPage;
