import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { friendlyError } from '../support';

const useCamera = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // source: Camera (tomar foto) | Photos (galería) | Prompt (preguntar)
  const takePhoto = async (source: CameraSource = CameraSource.Camera) => {
    setError(null);
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });
      setPhoto(image.dataUrl ?? null);
      return image.dataUrl ?? null;
    } catch (err) {
      setError(friendlyError(err) || null);
      return null;
    }
  };

  return { photo, error, takePhoto, clear: () => setPhoto(null) };
};

export default useCamera;
