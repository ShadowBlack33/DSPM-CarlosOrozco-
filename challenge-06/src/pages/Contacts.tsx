import { useEffect, useState, type FormEvent } from 'react';
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage,
  IonRefresher, IonRefresherContent, IonSpinner,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import PageHeader from '../components/PageHeader';
import NetworkBanner from '../components/NetworkBanner';
import useCollection from '../hooks/useCollection';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../context/NetworkContext';

interface Contact {
  nombre: string;
  telefono: string;
  email: string;
  userId: string;
}

const empty = { nombre: '', telefono: '', email: '' };

const Contacts = () => {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { results, isPending, error, getAll, add, update, remove } = useCollection<Contact>('contactos');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Solo los contactos del usuario logueado
  const load = () => (user ? getAll([['userId', '==', user.uid]]) : Promise.resolve([]));

  useEffect(() => {
    if (isOnline) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOnline]);

  const reset = () => { setForm(empty); setEditingId(null); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !form.nombre.trim()) return;
    const ok = editingId ? await update(editingId, form) : Boolean(await add({ ...form, userId: user.uid }));
    if (ok) { reset(); await load(); }
  };

  const handleEdit = (c: Contact & { id: string }) => {
    setEditingId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email });
  };

  const handleDelete = async (id: string) => {
    if (await remove(id)) await load();
  };

  const sorted = [...results].sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <IonPage className="mod-contacts mod-page">
      <PageHeader />
      <IonContent>
        <IonRefresher slot="fixed" disabled={!isOnline} onIonRefresh={async (e) => { await load(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="mod-hero">
          <span className="mod-hero__store">Firestore</span>
          <h1>Contactos</h1>
          <p className="mod-hero__count">
            {results.length === 1 ? '1 contacto' : `${results.length} contactos`}
            {isPending && <IonSpinner name="dots" style={{ height: 14, marginLeft: 6 }} />}
          </p>
        </div>

        <NetworkBanner offlineMessage="Sin conexión. Puedes ver tus contactos, pero no crear, editar ni borrar hasta que vuelva la red." />

        <form className={`panel${isOnline ? '' : ' is-locked'}`} onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar contacto' : 'Nuevo contacto'}</h2>
          <div className="field">
            <label htmlFor="c-name">Nombre</label>
            <IonInput id="c-name" value={form.nombre} disabled={!isOnline} placeholder="Ana Gómez"
              onIonInput={(e) => setForm({ ...form, nombre: e.detail.value ?? '' })} />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="c-phone">Teléfono</label>
              <IonInput id="c-phone" type="tel" inputmode="tel" value={form.telefono} disabled={!isOnline}
                onIonInput={(e) => setForm({ ...form, telefono: e.detail.value ?? '' })} />
            </div>
            <div className="field">
              <label htmlFor="c-mail">Correo</label>
              <IonInput id="c-mail" type="email" inputmode="email" value={form.email} disabled={!isOnline}
                onIonInput={(e) => setForm({ ...form, email: e.detail.value ?? '' })} />
            </div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <IonButton className="btn-primary" expand="block" type="submit" disabled={!isOnline || isPending || !form.nombre.trim()}>
            {editingId ? 'Guardar cambios' : 'Agregar contacto'}
          </IonButton>
          {editingId && <IonButton className="btn-text" expand="block" fill="clear" onClick={reset}>Cancelar edición</IonButton>}
        </form>

        {sorted.length === 0 && !isPending ? (
          <div className="empty">
            <h2>Aún no tienes contactos</h2>
            <p>{isOnline ? 'Agrega el primero con el formulario de arriba.' : 'Conéctate para cargarlos.'}</p>
          </div>
        ) : (
          <IonList className="rows" lines="full">
            {sorted.map((c) => (
              <IonItem key={c.id} className={`row${editingId === c.id ? ' is-editing' : ''}`}>
                <span className="avatar-initial" slot="start" aria-hidden="true">{c.nombre.charAt(0).toUpperCase()}</span>
                <IonLabel>
                  <h3>{c.nombre}</h3>
                  <p>{[c.telefono, c.email].filter(Boolean).join('  ·  ') || 'Sin datos de contacto'}</p>
                </IonLabel>
                <IonButton slot="end" fill="clear" className="row-btn" disabled={!isOnline} onClick={() => handleEdit(c)} aria-label={`Editar ${c.nombre}`}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton slot="end" fill="clear" className="row-btn danger" disabled={!isOnline} onClick={() => handleDelete(c.id)} aria-label={`Borrar ${c.nombre}`}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Contacts;
