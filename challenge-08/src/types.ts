export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  completada: boolean;
  foto_url: string | null;
  user_id: string;
  created_at: string;
}

export type TareaInput = Pick<Tarea, 'titulo' | 'descripcion'> & { foto_url?: string | null };
