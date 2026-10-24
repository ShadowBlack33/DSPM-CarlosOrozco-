import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { type Fruta } from '../db/dexie';

type NewFruta = Omit<Fruta, 'id' | 'createdAt'>;

// CRUD básico para la tabla de frutas en Dexie (IndexedDB local)
const useDexie = (filterFn: ((f: Fruta) => boolean) | null = null) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Tiempo real - useLiveQuery se re-ejecuta cuando la tabla cambia
  const liveResults =
    useLiveQuery(() => {
      if (filterFn) return db.frutas.filter(filterFn).toArray();
      return db.frutas.orderBy('createdAt').reverse().toArray();
    }, [filterFn]) ?? [];

  const run = async (fn: () => Promise<unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      await fn();
      setIsPending(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return false;
    }
  };

  // ── Lectura manual
  const getAll = () => db.frutas.toArray();

  // ── Agregar
  const add = (data: NewFruta) =>
    run(() => db.frutas.add({ ...data, createdAt: new Date().toISOString() } as Fruta));

  // ── Actualizar
  const update = (id: number, data: Partial<Fruta>) => run(() => db.frutas.update(id, data));

  // ── Eliminar
  const deleteItem = (id: number) => run(() => db.frutas.delete(id));

  // ── Nueva función: marcar / desmarcar como favorita
  const toggleFavorite = (fruta: Fruta) =>
    run(() => db.frutas.update(fruta.id, { favorita: !fruta.favorita }));

  // ── Nueva función: estadísticas de la tabla, también en tiempo real
  const stats =
    useLiveQuery(async () => {
      const all = await db.frutas.toArray();
      const total = all.length;
      const favoritas = all.filter((f) => f.favorita).length;
      const promedio = total ? all.reduce((s, f) => s + (Number(f.precio) || 0), 0) / total : 0;
      return { total, favoritas, promedio };
    }) ?? { total: 0, favoritas: 0, promedio: 0 };

  return { liveResults, isPending, error, getAll, add, update, deleteItem, toggleFavorite, stats };
};

export default useDexie;
