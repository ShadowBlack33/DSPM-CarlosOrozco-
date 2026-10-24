import { useState, type FormEvent } from 'react';
import { IonButton, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { checkmarkOutline, closeOutline, createOutline, trashOutline } from 'ionicons/icons';
import PageHeader from '../components/PageHeader';
import NetworkBanner from '../components/NetworkBanner';
import useRealTimeCollection from '../hooks/useRealTimeCollection';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../context/NetworkContext';

interface Task {
  titulo: string;
  completada: boolean;
}

const Tasks = () => {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  // Cada usuario tiene su propio nodo: tareas/{uid}
  const { results, isPending, error, add, update, deleteItem } =
    useRealTimeCollection<Task>(user ? `tareas/${user.uid}` : null);

  const [titulo, setTitulo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    if (await add({ titulo: titulo.trim(), completada: false })) setTitulo('');
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    if (await update(id, { titulo: editText.trim() })) setEditingId(null);
  };

  const sorted = [...results].sort((a, b) => Number(a.completada) - Number(b.completada));
  const pending = results.filter((t) => !t.completada).length;

  return (
    <IonPage className="mod-tasks mod-page">
      <PageHeader />
      <IonContent>
        <div className="mod-hero">
          <span className="mod-hero__store">Realtime Database</span>
          <h1>Tareas</h1>
          <p className="mod-hero__count">
            {results.length === 0 ? 'Sin tareas' : `${pending} pendientes de ${results.length}`}
          </p>
        </div>

        <NetworkBanner offlineMessage="Sin conexión. Las tareas quedan en solo lectura hasta que vuelva la red." />

        <form className={`panel inline-add${isOnline ? '' : ' is-locked'}`} onSubmit={handleAdd}>
          <div className="field">
            <label htmlFor="t-new">Nueva tarea</label>
            <IonInput id="t-new" value={titulo} disabled={!isOnline} placeholder="Escribe y presiona Agregar"
              onIonInput={(e) => setTitulo(e.detail.value ?? '')} />
          </div>
          <IonButton type="submit" disabled={!isOnline || isPending || !titulo.trim()}>Agregar</IonButton>
        </form>

        {error && <div className="form-error" role="alert" style={{ margin: '0 16px 12px' }}>{error}</div>}

        {sorted.length === 0 ? (
          <div className="empty">
            <h2>Todo al día</h2>
            <p>Las tareas que agregues aparecen aquí y en tus otros dispositivos al instante.</p>
          </div>
        ) : (
          <IonList className="rows" lines="full">
            {sorted.map((t) => (
              <IonItem key={t.id} className={`row${t.completada ? ' is-done' : ''}${editingId === t.id ? ' is-editing' : ''}`}>
                <IonCheckbox className="check" slot="start" checked={t.completada} disabled={!isOnline}
                  aria-label={t.completada ? 'Marcar pendiente' : 'Completar'}
                  onIonChange={() => update(t.id, { completada: !t.completada })} />
                {editingId === t.id ? (
                  <>
                    <IonInput className="edit-input" aria-label="Editar tarea" value={editText} autoFocus
                      onIonInput={(e) => setEditText(e.detail.value ?? '')}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(t.id)} />
                    <IonButton slot="end" fill="clear" className="row-btn" disabled={!isOnline} onClick={() => saveEdit(t.id)} aria-label="Guardar">
                      <IonIcon slot="icon-only" icon={checkmarkOutline} />
                    </IonButton>
                    <IonButton slot="end" fill="clear" className="row-btn" onClick={() => setEditingId(null)} aria-label="Cancelar">
                      <IonIcon slot="icon-only" icon={closeOutline} />
                    </IonButton>
                  </>
                ) : (
                  <>
                    <IonLabel><h3>{t.titulo}</h3></IonLabel>
                    <IonButton slot="end" fill="clear" className="row-btn" disabled={!isOnline}
                      onClick={() => { setEditingId(t.id); setEditText(t.titulo); }} aria-label="Editar">
                      <IonIcon slot="icon-only" icon={createOutline} />
                    </IonButton>
                    <IonButton slot="end" fill="clear" className="row-btn danger" disabled={!isOnline} onClick={() => deleteItem(t.id)} aria-label="Borrar">
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </>
                )}
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
