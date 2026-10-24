import { useEffect, useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonModal, IonSpinner, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { CameraSource } from '@capacitor/camera';
import useCamera from '../hooks/useCamera';
import useStorage from '../hooks/useStorage';
import { useAuth } from '../context/AuthContext';
import type { Tarea, TareaInput } from '../types';

interface Props {
  isOpen: boolean;
  tarea: Tarea | null; // null = crear
  onClose: () => void;
  onSave: (data: TareaInput) => Promise<boolean>;
  onDelete?: (id: number) => void;
}

// Modal para crear o editar una tarea, con foto opcional tomada con la cámara
const TareaModal = ({ isOpen, tarea, onClose, onSave, onDelete }: Props) => {
  const { user } = useAuth();
  const { takePhoto } = useCamera();
  const { upload, isUploading, error: uploadError } = useStorage();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitulo(tarea?.titulo ?? '');
      setDescripcion(tarea?.descripcion ?? '');
      setFotoUrl(tarea?.foto_url ?? null);
    }
  }, [isOpen, tarea]);

  const handlePhoto = async (source: CameraSource = CameraSource.Prompt) => {
    if (!user) return;
    try {
      const photo = await takePhoto(source);
      if (!photo) return;
      const url = await upload(user.id, photo.blob, `tarea.${photo.format}`);
      if (url) setFotoUrl(url);
    } catch {
      // el usuario canceló la cámara
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) return;
    setSaving(true);
    const ok = await onSave({ titulo: titulo.trim(), descripcion: descripcion.trim() || null, foto_url: fotoUrl });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonButton onClick={onClose}>Cancelar</IonButton></IonButtons>
          <IonTitle>{tarea ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong disabled={!titulo.trim() || saving || isUploading} onClick={handleSave}>
              {saving ? <IonSpinner name="dots" /> : 'Guardar'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="sheet-pad">
          <button type="button" className={`photo-slot${fotoUrl ? ' has-photo' : ''}`} onClick={() => handlePhoto()}
            disabled={isUploading} aria-label={fotoUrl ? 'Cambiar foto' : 'Agregar foto'}>
            {fotoUrl ? <img src={fotoUrl} alt="Foto de la tarea" /> : (
              <span><IonIcon icon={cameraOutline} aria-hidden="true" />Agregar una foto</span>
            )}
            {isUploading && <span className="uploading"><IonSpinner name="crescent" color="primary" /></span>}
          </button>
          {fotoUrl && (
            <div className="photo-slot__actions">
              <button type="button" className="chip" onClick={() => handlePhoto(CameraSource.Camera)}>Otra foto</button>
              <button type="button" className="chip danger" onClick={() => setFotoUrl(null)}>Quitar foto</button>
            </div>
          )}
          {uploadError && <div className="form-error" role="alert">No se pudo subir la foto: {uploadError}</div>}

          <div className="field">
            <label htmlFor="t-title">Título</label>
            <IonInput id="t-title" value={titulo} placeholder="¿Qué hay que hacer?"
              onIonInput={(e) => setTitulo(e.detail.value ?? '')} />
          </div>
          <div className="field">
            <label htmlFor="t-desc">Notas</label>
            <IonTextarea id="t-desc" autoGrow rows={3} value={descripcion} placeholder="Opcional"
              onIonInput={(e) => setDescripcion(e.detail.value ?? '')} />
          </div>
          <IonButton className="btn-primary" expand="block" disabled={!titulo.trim() || saving || isUploading} onClick={handleSave}>
            {tarea ? 'Guardar cambios' : 'Crear tarea'}
          </IonButton>
          {tarea && onDelete && (
            <IonButton className="btn-danger-text" expand="block" fill="clear" onClick={() => { onDelete(tarea.id); onClose(); }}>
              Eliminar tarea
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default TareaModal;
