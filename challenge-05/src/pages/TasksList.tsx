import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonToolbar, useIonRouter } from '@ionic/react';
import { add, logOutOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import TaskItem from '../components/TaskItem';

const EmptyIllustration = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
    <rect x="18" y="12" width="60" height="74" rx="10" fill="#fff" stroke="var(--rule)" strokeWidth="2" />
    {[32, 46, 60].map((y) => (
      <g key={y}>
        <circle cx="32" cy={y} r="5" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="44" y={y - 2.5} width="24" height="5" rx="2.5" fill="var(--ink-soft)" />
      </g>
    ))}
  </svg>
);

const TasksList = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const router = useIonRouter();

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const name = user?.email?.split('@')[0];

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton className="icon-btn" onClick={handleLogout} aria-label="Cerrar sesión">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="list-head">
          <p className="list-head__hello">Hola, {name}</p>
          <h1>Mis tareas</h1>
          {tasks.length > 0 && (
            <div className="progress">
              <div className="progress__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress__fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress__text">
                <span><strong>{done.length}</strong> de {tasks.length} completadas</span>
                <span>{pct}%</span>
              </div>
            </div>
          )}
        </div>

        {tasks.length === 0 && (
          <div className="empty">
            <EmptyIllustration />
            <h2>Nada por hacer</h2>
            <p>Toca el botón + para escribir tu primera tarea.</p>
          </div>
        )}

        {pending.length > 0 && (
          <>
            <h2 className="group-title">Pendientes ({pending.length})</h2>
            <IonList className="task-list" lines="full">
              {pending.map((t) => <TaskItem key={t.id} task={t} />)}
            </IonList>
          </>
        )}

        {done.length > 0 && (
          <>
            <h2 className="group-title">Completadas ({done.length})</h2>
            <IonList className="task-list" lines="full">
              {done.map((t) => <TaskItem key={t.id} task={t} />)}
            </IonList>
          </>
        )}
        <div className="bottom-space" />

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton className="fab-add" onClick={() => navigate('/tasks/new')} aria-label="Nueva tarea">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TasksList;
