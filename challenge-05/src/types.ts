export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export type TaskInput = Pick<Task, 'title' | 'description'>;
