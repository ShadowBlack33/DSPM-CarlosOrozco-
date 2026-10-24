import { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonInput, IonTextarea } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import useFilesystem from '../hooks/useFilesystem';

const FilesystemPage = () => {
  const { files, error, listFiles, writeFile, readFile, appendFile, deleteFile } = useFilesystem();
  const [name, setName] = useState('nota.txt');
  const [content, setContent] = useState('');
  const [opened, setOpened] = useState<{ name: string; text: string } | null>(null);

  useEffect(() => { listFiles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const open = async (file: string) => {
    const text = await readFile(file);
    if (text !== null) setOpened({ name: file, text });
  };

  const save = async () => { if (await writeFile(name, content)) open(name); };
  const append = async () => { if (await appendFile(name, `\n${content}`)) open(name); };

  return (
    <SensorPage path="/filesystem" description="Guarda notas de texto en la carpeta Documentos/notas del dispositivo." error={error}>
      <div className="field">
        <label htmlFor="fs-name">Nombre del archivo</label>
        <IonInput id="fs-name" value={name} onIonInput={(e) => setName(e.detail.value ?? '')} />
      </div>
      <div className="field">
        <label htmlFor="fs-content">Contenido</label>
        <IonTextarea id="fs-content" autoGrow rows={3} placeholder="Escribe algo…" value={content}
          onIonInput={(e) => setContent(e.detail.value ?? '')} />
      </div>
      <div className="btn-row">
        <IonButton className="btn" disabled={!name} onClick={save}>Guardar</IonButton>
        <IonButton className="btn-outline" fill="outline" disabled={!name || !content} onClick={append}>Agregar al final</IonButton>
      </div>

      <h2 className="section-title">Archivos guardados ({files.length})</h2>
      <div className="log">
        {files.length === 0 && <div className="log__empty">Todavía no hay archivos. Guarda el primero.</div>}
        {files.map((f) => (
          <div className="log__item" key={f.name}>
            <button className="file-btn" onClick={() => open(f.name)}>
              {f.name} <small>{f.size} B</small>
            </button>
            <button className="icon-btn" aria-label={`Borrar ${f.name}`}
              onClick={() => { deleteFile(f.name); if (opened?.name === f.name) setOpened(null); }}>
              <IonIcon icon={trashOutline} />
            </button>
          </div>
        ))}
      </div>

      {opened && (
        <div className="file-view">
          <strong>{opened.name}</strong>
          <pre>{opened.text || '(vacío)'}</pre>
        </div>
      )}
    </SensorPage>
  );
};

export default FilesystemPage;
