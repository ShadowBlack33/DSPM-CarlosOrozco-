import { useState } from 'react';
import { IonItem, IonInput, IonButton } from '@ionic/react';
import type { Task } from '../types';

interface AddTaskFormProps {
  onAdd: (task: Task) => void;
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ id: Date.now(), title, completed: false });
    setTitle('');
  };

  return (
    <IonItem>
      <IonInput
        placeholder="Nueva tarea"
        value={title}
        onIonChange={(e) => setTitle(e.detail.value ?? '')}
      />
      <IonButton slot="end" onClick={handleAdd}>
        Agregar
      </IonButton>
    </IonItem>
  );
}

export default AddTaskForm;
