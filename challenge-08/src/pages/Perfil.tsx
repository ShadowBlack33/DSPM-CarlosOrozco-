import { useEffect, useState } from 'react';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonSpinner, IonToolbar, useIonRouter,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { CameraSource } from '@capacitor/camera';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import useCamera from '../hooks/useCamera';
import useStorage from '../hooks/useStorage';

const Perfil = () => {
  const { user, logout, updateMetadata, error: authError } = useAuth();
  const { takePhoto } = useCamera();
  const { upload, isUploading, error } = useStorage();
  const router = useIonRouter();
  const [stats, setStats] = useState({ total: 0, hechas: 0 });

  const nombre = (user?.user_metadata?.nombre as string | undefined) ?? user?.email?.split('@')[0] ?? 'Tú';
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  useEffect(() => {
    supabase.from('tareas').select('completada').then(({ data }) => {
      if (data) setStats({ total: data.length, hechas: data.filter((t) => t.completada).length });
    });
  }, []);

  // Captura con la cámara → sube a avatars/{uid}/ → guarda la URL en los metadatos del usuario
  const cambiarAvatar = async (source: CameraSource) => {
    if (!user) return;
    try {
      const photo = await takePhoto(source);
      if (!photo) return;
      const url = await upload(user.id, photo.blob, `avatar.${photo.format}`);
      if (url) await updateMetadata({ avatar_url: url });
    } catch {
      // cámara cancelada
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/tareas" text="Tareas" /></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="profile">
          <div className="profile__avatar">
            {avatar ? <img src={avatar} alt="Tu foto de perfil" /> : <div className="profile__placeholder">{nombre.charAt(0).toUpperCase()}</div>}
            <button className="profile__cam" aria-label="Tomar foto de perfil" disabled={isUploading}
              onClick={() => cambiarAvatar(CameraSource.Camera)}>
              {isUploading ? <IonSpinner name="crescent" style={{ width: 20, height: 20, color: '#fff' }} /> : <IonIcon icon={cameraOutline} />}
            </button>
          </div>
          <h1>{nombre}</h1>
          <p className="profile__mail">{user?.email}</p>

          <div className="facts">
            <div className="fact"><strong>{stats.total}</strong><span>Tareas creadas</span></div>
            <div className="fact"><strong>{stats.hechas}</strong><span>Completadas</span></div>
          </div>

          {(error || authError) && <div className="form-error" role="alert">{error ?? authError}</div>}

          <IonButton className="btn-soft" expand="block" disabled={isUploading} onClick={() => cambiarAvatar(CameraSource.Photos)}>
            Elegir foto de la galería
          </IonButton>
          <IonButton className="btn-danger-text" expand="block" fill="clear" onClick={handleLogout}>Cerrar sesión</IonButton>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
