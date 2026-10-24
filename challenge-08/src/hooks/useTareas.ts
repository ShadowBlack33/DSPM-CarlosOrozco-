import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Tarea, TareaInput } from '../types';

// CRUD de la tabla "tareas" + suscripción Realtime (lista en vivo)
const useTareas = (userId: string | undefined) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setTareas(data as Tarea[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) return;
    cargar();

    // Realtime: INSERT / UPDATE / DELETE llegan sin recargar
    const canal = supabase
      .channel('cambios-tareas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tareas', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT')
            setTareas((t) => (t.some((x) => x.id === payload.new.id) ? t : [payload.new as Tarea, ...t]));
          if (payload.eventType === 'UPDATE')
            setTareas((t) => t.map((x) => (x.id === payload.new.id ? (payload.new as Tarea) : x)));
          if (payload.eventType === 'DELETE')
            setTareas((t) => t.filter((x) => x.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [userId, cargar]);

  const handle = (err: { message: string } | null) => {
    setError(err ? err.message : null);
    return !err;
  };

  // Se agrega a la lista con la fila que devuelve Supabase (si Realtime también la envía, no se duplica)
  const crear = async (input: TareaInput) => {
    const { data, error } = await supabase.from('tareas').insert(input).select().single();
    if (data) setTareas((t) => (t.some((x) => x.id === data.id) ? t : [data as Tarea, ...t]));
    return handle(error);
  };

  const editar = async (id: number, cambios: Partial<TareaInput>) => {
    const { data, error } = await supabase.from('tareas').update(cambios).eq('id', id).select().single();
    if (data) setTareas((t) => t.map((x) => (x.id === id ? (data as Tarea) : x)));
    return handle(error);
  };

  const completar = async (id: number, valor: boolean) => {
    // Actualización optimista: se ve al instante, Realtime confirma
    setTareas((t) => t.map((x) => (x.id === id ? { ...x, completada: valor } : x)));
    const { error } = await supabase.from('tareas').update({ completada: valor }).eq('id', id);
    return handle(error);
  };

  const borrar = async (id: number) => {
    const { error } = await supabase.from('tareas').delete().eq('id', id);
    if (!error) setTareas((t) => t.filter((x) => x.id !== id));
    return handle(error);
  };

  return { tareas, isLoading, error, cargar, crear, editar, completar, borrar };
};

export default useTareas;
