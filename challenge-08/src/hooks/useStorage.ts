import { useState } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET = 'avatars';

// Sube archivos al bucket "avatars" dentro de la carpeta del usuario: {uid}/archivo
const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (userId: string, file: Blob, name: string) => {
    setIsUploading(true);
    setError(null);
    const ruta = `${userId}/${Date.now()}-${name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(ruta, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });
    setIsUploading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
    return data.publicUrl;
  };

  return { upload, isUploading, error };
};

export default useStorage;
