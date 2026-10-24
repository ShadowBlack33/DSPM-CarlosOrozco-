// Reduce una imagen (dataURL) a una miniatura JPEG liviana para guardarla en Firestore
// (un documento de Firestore no puede pasar de 1 MB).
export const thumbnail = (dataUrl: string, maxSide = 320, quality = 0.55) =>
  new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
