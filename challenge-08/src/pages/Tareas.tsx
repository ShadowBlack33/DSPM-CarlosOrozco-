import { useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage,
  IonRefresher, IonRefresherContent, IonSpinner, IonToolbar,
} from '@ionic/react';
import { add, checkmark, closeOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTareas from '../hooks/useTareas';
import TareaModal from '../components/TareaModal';
import Avatar from '../components/Avatar';
import type { Tarea } from '../types';

type Filtro = 'todas' | 'pendientes' | 'completadas';
const filtros: [Filtro, string][] = [['todas', 'Todas'], ['pendientes', 'Pendientes'], ['completadas', 'Hechas']];

const Tareas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tareas, isLoading, error, cargar, crear, editar, completar, borrar } = useTareas(user?.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tarea | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todas');

  const visibles = tareas.filter((t) =>
    filtro === 'todas' ? true : filtro === 'completadas' ? t.completada : !t.completada);
  const pendientes = tareas.filter((t) => !t.completada).length;
  const nombre = user?.user_metadata?.nombre as string | undefined;

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Tarea) => { setEditing(t); setModalOpen(true); };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton className="avatar-btn" onClick={() => navigate('/perfil')} aria-label="Ir a mi perfil">
              <Avatar url={user?.user_metadata?.avatar_url} name={nombre ?? user?.email} size={36} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={async (e) => { await cargar(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <header className="feed-head">
          <div>
            <h1>Mis tareas</h1>
            <p>{tareas.length === 0 ? 'Empieza con la primera' : `${pendientes} pendientes de ${tareas.length}`}</p>
          </div>
          <span className="live" title="Los cambios llegan por Supabase Realtime"><span className="live__dot" />En vivo</span>
        </header>

        <div className="segment" role="group" aria-label="Filtrar tareas">
          {filtros.map(([value, label]) => (
            <button key={value} className="seg" aria-pressed={filtro === value} onClick={() => setFiltro(value)}>{label}</button>
          ))}
        </div>

        {error && <div className="form-error" role="alert" style={{ margin: '0 16px 12px' }}>{error}</div>}
        {isLoading && <div className="center-fill" style={{ height: 120 }}><IonSpinner name="crescent" color="primary" /></div>}

        {!isLoading && visibles.length === 0 && (
          <div className="empty">
            <h2>{filtro === 'todas' ? 'Sin tareas todavía' : filtro === 'pendientes' ? 'Nada pendiente' : 'Aún no terminas ninguna'}</h2>
            <p>{filtro === 'todas' ? 'Toca + para crear una. Puedes adjuntarle una foto con la cámara.' : 'Cambia el filtro para ver el resto.'}</p>
          </div>
        )}

        <div className="feed">
          {visibles.map((t) => (
            <article key={t.id} className={`card${t.completada ? ' is-done' : ''}`}>
              {t.foto_url && (
                <img className="card__photo" src={t.foto_url} alt="" loading="lazy" onClick={() => openEdit(t)} />
              )}
              <div className="card__body">
                <button className="tick" role="checkbox" aria-checked={t.completada}
                  aria-label={t.completada ? 'Marcar pendiente' : 'Completar'}
                  onClick={() => completar(t.id, !t.completada)}>
                  {t.completada && <IonIcon icon={checkmark} />}
                </button>
                <div className="card__text" onClick={() => openEdit(t)} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openEdit(t)}>
                  <h3>{t.titulo}</h3>
                  {t.descripcion && <p>{t.descripcion}</p>}
                  <span className="card__date">
                    {new Date(t.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <button className="card__del" aria-label={`Eliminar ${t.titulo}`} onClick={() => borrar(t.id)}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton className="fab" onClick={openNew} aria-label="Nueva tarea"><IonIcon icon={add} /></IonFabButton>
        </IonFab>

        <TareaModal
          isOpen={modalOpen}
          tarea={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => (editing ? editar(editing.id, data) : crear(data))}
          onDelete={borrar}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tareas;
