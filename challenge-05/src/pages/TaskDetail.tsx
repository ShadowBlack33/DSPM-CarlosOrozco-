import {
  IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonToolbar,
} from '@ionic/react';
import { checkmarkCircle, createOutline, ellipseOutline, trashOutline } from 'ionicons/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';

const TaskDetail = () => {
  const { id = '' } = useParams();
  const { getTask, toggleTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const task = getTask(id);

  const handleDelete = () => {
    deleteTask(id);
    navigate('/tasks', { replace: true });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" text="" />
          </IonButtons>
          {task && (
            <IonButtons slot="end">
              <IonButton className="icon-btn" onClick={() => navigate(`/tasks/${task.id}/edit`)} aria-label="Editar">
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!task ? (
          <div className="empty"><h2>Esta tarea ya no existe</h2><p>Vuelve a la lista para ver tus tareas.</p></div>
        ) : (
          <article className="detail">
            <span className={`status ${task.completed ? 'status--done' : 'status--pending'}`}>
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>
            <h1>{task.title}</h1>
            <p className="detail__date">
              Creada el {new Date(task.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className={`detail__body${task.description ? '' : ' is-empty'}`}>
              {task.description || 'Sin notas. Toca el lápiz para agregarlas.'}
            </div>
          </article>
        )}
      </IonContent>
      {task && (
        <IonFooter className="ion-no-border">
          <div className="action-bar">
            <IonButton className="btn-primary" onClick={() => toggleTask(task.id)}>
              <IonIcon slot="start" icon={task.completed ? ellipseOutline : checkmarkCircle} />
              {task.completed ? 'Marcar pendiente' : 'Completar'}
            </IonButton>
            <IonButton className="btn-danger-ghost" onClick={handleDelete} aria-label="Eliminar">
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
          </div>
        </IonFooter>
      )}
    </IonPage>
  );
};

export default TaskDetail;
