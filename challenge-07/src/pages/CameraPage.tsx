import { IonButton, IonIcon } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { CameraSource } from '@capacitor/camera';
import SensorPage from '../components/SensorPage';
import useCamera from '../hooks/useCamera';
import Notice from '../components/Notice';
import { support } from '../support';

const CameraPage = () => {
  const { photo, error, takePhoto, clear } = useCamera();

  return (
    <SensorPage path="/camera" description="Toma una foto con la cámara o elige una de tu galería." error={error}>
      {support.needsHttps() && (
        <Notice>Sin HTTPS el navegador no deja usar la cámara; solo podrás elegir una imagen. Corre "npm run phone" en el PC y abre la dirección https:// en el celular.</Notice>
      )}
      {photo ? (
        <div className="photo"><img src={photo} alt="Foto tomada con la cámara" /></div>
      ) : (
        <div className="photo-empty">
          <div><IonIcon icon={cameraOutline} aria-hidden="true" />Aquí aparece tu foto</div>
        </div>
      )}
      <IonButton className="btn" expand="block" onClick={() => takePhoto(CameraSource.Camera)}>Tomar foto</IonButton>
      <div className="btn-row">
        <IonButton className="btn-outline" fill="outline" onClick={() => takePhoto(CameraSource.Photos)}>Galería</IonButton>
        <IonButton className="btn-outline" fill="outline" disabled={!photo} onClick={clear}>Borrar</IonButton>
      </div>
    </SensorPage>
  );
};

export default CameraPage;
