import { IonCheckbox, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import type { Task } from '../types';

const TaskItem = ({ task }: { task: Task }) => {
  const { toggleTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  return (
    <IonItemSliding>
      <IonItem className={`task-row${task.completed ? ' is-done' : ''}`} button detail={false}
        onClick={() => navigate(`/tasks/${task.id}`)}>
        <IonCheckbox
          className="check"
          slot="start"
          aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          checked={task.completed}
          onClick={(e) => e.stopPropagation()}
          onIonChange={() => toggleTask(task.id)}
        />
        <IonLabel>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="primary" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
          <IonIcon slot="icon-only" icon={createOutline} aria-label="Editar" />
        </IonItemOption>
        <IonItemOption color="danger" onClick={() => deleteTask(task.id)}>
          <IonIcon slot="icon-only" icon={trashOutline} aria-label="Eliminar" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default TaskItem;
