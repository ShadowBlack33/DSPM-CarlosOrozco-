import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Abre la cámara y devuelve la foto como dataURL (o null si el usuario cancela)
const useCamera = () => {
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        width: 720,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
      });
      return image.dataUrl ?? null;
    } catch (e) {
      // "User cancelled photos app" no es un error real
      if (/cancel/i.test(String((e as Error)?.message))) return null;
      throw e;
    }
  };

  return { takePhoto };
};

export default useCamera;
