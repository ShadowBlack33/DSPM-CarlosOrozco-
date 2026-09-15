import { IonItem, IonLabel, IonCheckbox, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </IonLabel>
      <IonButton slot="end" color="danger" fill="clear" onClick={() => onDelete(task.id)}>
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;
