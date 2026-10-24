import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Toma una foto con la cámara (o galería) y la devuelve como Blob listo para subir
const useCamera = () => {
  const takePhoto = async (source: CameraSource = CameraSource.Prompt) => {
    const image = await Camera.getPhoto({
      quality: 70,
      width: 800,
      resultType: CameraResultType.DataUrl,
      source,
      promptLabelHeader: 'Foto',
      promptLabelPhoto: 'Elegir de la galería',
      promptLabelPicture: 'Tomar foto',
    });
    if (!image.dataUrl) return null;
    const blob = await (await fetch(image.dataUrl)).blob();
    return { blob, dataUrl: image.dataUrl, format: image.format || 'jpeg' };
  };

  return { takePhoto };
};

export default useCamera;
