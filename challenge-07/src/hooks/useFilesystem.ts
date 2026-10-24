import { useState } from 'react';
import { Directory, Encoding, Filesystem, type FileInfo } from '@capacitor/filesystem';

const DIR = Directory.Documents;
const FOLDER = 'notas';

const useFilesystem = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const safe = async <T,>(fn: () => Promise<T>) => {
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };

  const listFiles = () =>
    safe(async () => {
      try {
        const res = await Filesystem.readdir({ path: FOLDER, directory: DIR });
        setFiles(res.files);
        return res.files;
      } catch {
        setFiles([]); // la carpeta aún no existe
        return [];
      }
    });

  const writeFile = (name: string, content: string) =>
    safe(async () => {
      await Filesystem.writeFile({
        path: `${FOLDER}/${name}`, data: content, directory: DIR, encoding: Encoding.UTF8, recursive: true,
      });
      await listFiles();
      return true;
    });

  const readFile = (name: string) =>
    safe(async () => {
      const res = await Filesystem.readFile({ path: `${FOLDER}/${name}`, directory: DIR, encoding: Encoding.UTF8 });
      return typeof res.data === 'string' ? res.data : await res.data.text();
    });

  const appendFile = (name: string, content: string) =>
    safe(async () => {
      await Filesystem.appendFile({ path: `${FOLDER}/${name}`, data: content, directory: DIR, encoding: Encoding.UTF8 });
      return true;
    });

  const deleteFile = (name: string) =>
    safe(async () => {
      await Filesystem.deleteFile({ path: `${FOLDER}/${name}`, directory: DIR });
      await listFiles();
      return true;
    });

  return { files, error, listFiles, writeFile, readFile, appendFile, deleteFile };
};

export default useFilesystem;
