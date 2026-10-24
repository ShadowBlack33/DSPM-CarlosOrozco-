import { useEffect, useState, type FormEvent } from 'react';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonPage, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';

// La misma página sirve para crear (/tasks/new) y editar (/tasks/:id/edit)
const TaskForm = () => {
  const { id } = useParams();
  const { getTask, addTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const task = id ? getTask(id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para la tarea.');
      return;
    }
    if (isEdit && id) {
      updateTask(id, { title: title.trim(), description: description.trim() });
      navigate(`/tasks/${id}`, { replace: true });
    } else {
      addTask({ title: title.trim(), description: description.trim() });
      navigate('/tasks', { replace: true });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" text="" />
          </IonButtons>
          <IonTitle>{isEdit ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong color="primary" onClick={() => handleSubmit()} disabled={isEdit && !task}>
              {isEdit ? 'Guardar' : 'Agregar'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isEdit && !task ? (
          <div className="empty"><h2>Esta tarea ya no existe</h2><p>Puede que la hayas eliminado.</p></div>
        ) : (
          <form className="composer" onSubmit={handleSubmit}>
            <IonInput
              className="composer__title"
              aria-label="Título"
              placeholder="¿Qué hay que hacer?"
              value={title}
              autoFocus
              onIonInput={(e) => { setTitle(e.detail.value ?? ''); setError(null); }}
            />
            <div className="field">
              <label htmlFor="task-notes">Notas</label>
              <IonTextarea
                id="task-notes"
                autoGrow
                rows={5}
                placeholder="Detalles, enlaces o pasos (opcional)"
                value={description}
                onIonInput={(e) => setDescription(e.detail.value ?? '')}
              />
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <IonButton className="btn-primary" expand="block" type="submit">
              {isEdit ? 'Guardar cambios' : 'Agregar tarea'}
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskForm;
