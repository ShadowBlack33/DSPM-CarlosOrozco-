import { useMemo, useState, type FormEvent } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSearchbar } from '@ionic/react';
import { createOutline, star, starOutline, trashOutline } from 'ionicons/icons';
import PageHeader from '../components/PageHeader';
import useDexie from '../hooks/useDexie';
import type { Fruta } from '../db/dexie';

const empty = { nombre: '', proveedor: '', fechaCosecha: '', precio: '' };
const money = (n: number) => `$${Math.round(n).toLocaleString('es-CO')}`;

const Fruits = () => {
  const [search, setSearch] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);

  // Filtro por nombre/proveedor + favoritas (se pasa al hook y useLiveQuery lo aplica)
  const filterFn = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term && !onlyFav) return null;
    return (f: Fruta) =>
      (!onlyFav || f.favorita) &&
      (!term || f.nombre.toLowerCase().includes(term) || f.proveedor.toLowerCase().includes(term));
  }, [search, onlyFav]);

  const { liveResults, isPending, error, add, update, deleteItem, toggleFavorite, stats } = useDexie(filterFn);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  const reset = () => { setForm(empty); setEditingId(null); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const data = {
      nombre: form.nombre.trim(),
      proveedor: form.proveedor.trim(),
      fechaCosecha: form.fechaCosecha,
      precio: Number(form.precio) || 0,
    };
    const ok = editingId ? await update(editingId, data) : await add({ ...data, favorita: false });
    if (ok) reset();
  };

  const handleEdit = (f: Fruta) => {
    setEditingId(f.id);
    setForm({ nombre: f.nombre, proveedor: f.proveedor, fechaCosecha: f.fechaCosecha, precio: String(f.precio) });
  };

  return (
    <IonPage className="mod-fruits mod-page">
      <PageHeader />
      <IonContent>
        <div className="mod-hero">
          <span className="mod-hero__store">Dexie, en tu dispositivo</span>
          <h1>Frutas</h1>
        </div>

        <div className="stats">
          <div className="stat is-accent"><strong>{stats.total}</strong><span>Frutas</span></div>
          <div className="stat"><strong>{stats.favoritas}</strong><span>Favoritas</span></div>
          <div className="stat"><strong>{money(stats.promedio)}</strong><span>Precio promedio</span></div>
        </div>

        <form className="panel" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar fruta' : 'Nueva fruta'}</h2>
          <div className="field-row">
            <div className="field">
              <label htmlFor="f-name">Nombre</label>
              <IonInput id="f-name" value={form.nombre} placeholder="Mango"
                onIonInput={(e) => setForm({ ...form, nombre: e.detail.value ?? '' })} />
            </div>
            <div className="field">
              <label htmlFor="f-price">Precio</label>
              <IonInput id="f-price" type="number" inputmode="numeric" value={form.precio} placeholder="5000"
                onIonInput={(e) => setForm({ ...form, precio: e.detail.value ?? '' })} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="f-prov">Proveedor</label>
              <IonInput id="f-prov" value={form.proveedor} placeholder="Finca El Paraíso"
                onIonInput={(e) => setForm({ ...form, proveedor: e.detail.value ?? '' })} />
            </div>
            <div className="field">
              <label htmlFor="f-date">Cosecha</label>
              <IonInput id="f-date" type="date" value={form.fechaCosecha}
                onIonInput={(e) => setForm({ ...form, fechaCosecha: e.detail.value ?? '' })} />
            </div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <IonButton className="btn-primary" expand="block" type="submit" disabled={isPending || !form.nombre.trim()}>
            {editingId ? 'Guardar cambios' : 'Agregar fruta'}
          </IonButton>
          {editingId && <IonButton className="btn-text" expand="block" fill="clear" onClick={reset}>Cancelar edición</IonButton>}
        </form>

        <div className="filters">
          <IonSearchbar placeholder="Buscar por nombre o proveedor" value={search} showClearButton="focus"
            onIonInput={(e) => setSearch(e.detail.value ?? '')} />
          <button type="button" className="chip-toggle" aria-pressed={onlyFav} onClick={() => setOnlyFav(!onlyFav)}>
            <IonIcon icon={onlyFav ? star : starOutline} /> Favoritas
          </button>
        </div>

        {liveResults.length === 0 ? (
          <div className="empty">
            <h2>{search || onlyFav ? 'Nada coincide' : 'Sin frutas todavía'}</h2>
            <p>{search || onlyFav ? 'Prueba con otra búsqueda o quita el filtro de favoritas.' : 'Agrega una con el formulario. Se guarda en tu dispositivo, aunque no haya internet.'}</p>
          </div>
        ) : (
          <IonList className="rows" lines="full">
            {liveResults.map((f) => (
              <IonItem key={f.id} className={`row${editingId === f.id ? ' is-editing' : ''}`}>
                <IonButton slot="start" fill="clear" className={`fav-btn${f.favorita ? ' is-fav' : ''}`}
                  onClick={() => toggleFavorite(f)} aria-label={f.favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}>
                  <IonIcon slot="icon-only" icon={f.favorita ? star : starOutline} />
                </IonButton>
                <IonLabel>
                  <h3>{f.nombre}</h3>
                  <p>{[f.proveedor || 'Sin proveedor', f.fechaCosecha && `cosecha ${f.fechaCosecha}`].filter(Boolean).join('  ·  ')}</p>
                </IonLabel>
                <span slot="end" className="price">{money(f.precio)}</span>
                <IonButton slot="end" fill="clear" className="row-btn" onClick={() => handleEdit(f)} aria-label={`Editar ${f.nombre}`}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton slot="end" fill="clear" className="row-btn danger" onClick={() => deleteItem(f.id)} aria-label={`Borrar ${f.nombre}`}>
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

export default Fruits;
