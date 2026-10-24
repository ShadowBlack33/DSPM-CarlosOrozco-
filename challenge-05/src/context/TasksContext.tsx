import { createContext, useContext, type ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import type { Task, TaskInput } from '../types';

interface TasksContextValue {
  tasks: Task[];
  getTask: (id: string) => Task | undefined;
  addTask: (data: TaskInput) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

// Las tareas se guardan por usuario: cada cuenta de Firebase ve solo las suyas
export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useLocalStorage<Task[]>(user ? `tasks_${user.uid}` : null, []);

  const getTask = (id: string) => tasks.find((t) => t.id === id);

  const addTask = (data: TaskInput) =>
    setTasks((prev) => [
      ...prev,
      { ...data, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() },
    ]);

  const updateTask = (id: string, data: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <TasksContext.Provider value={{ tasks, getTask, addTask, updateTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de TasksProvider');
  return ctx;
};
