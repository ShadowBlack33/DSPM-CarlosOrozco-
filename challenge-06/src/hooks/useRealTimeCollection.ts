import { useEffect, useState } from 'react';
import { rtdb } from '../firebase/config';
import { ref, push, set, update as rtUpdate, remove, onValue, get } from 'firebase/database';

// CRUD básico para cualquier ruta de Firebase Realtime Database
const useRealTimeCollection = <T extends object>(table: string | null) => {
  const [results, setResults] = useState<(T & { id: string })[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toArray = (val: Record<string, T> | null) =>
    val ? Object.entries(val).map(([id, data]) => ({ id, ...data })) : [];

  // ── Escucha en tiempo real: cada cambio en la BD refresca la lista
  useEffect(() => {
    if (!table) return;
    const unsubscribe = onValue(
      ref(rtdb, table),
      (snapshot) => setResults(toArray(snapshot.val())),
      (err) => setError(err.message),
    );
    return () => unsubscribe();
  }, [table]);

  // ── Lectura manual (no es necesaria porque onValue ya refresca)
  const getAll = async () => {
    if (!table) return [];
    const snapshot = await get(ref(rtdb, table));
    return toArray(snapshot.val());
  };

  const run = async (fn: () => Promise<unknown>) => {
    if (!table) return false;
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

  // ── Agregar (push genera el id)
  const add = (data: T) =>
    run(async () => {
    await push(ref(rtdb, table!), { ...data, createdAt: new Date().toISOString() });
  });

  // ── Actualizar campos de un registro
  const update = (id: string, data: Partial<T>) =>
    run(() => rtUpdate(ref(rtdb, `${table}/${id}`), { ...data, updatedAt: new Date().toISOString() }));

  // ── Reemplazar un registro completo
  const setItem = (id: string, data: T) => run(() => set(ref(rtdb, `${table}/${id}`), data));

  // ── Eliminar
  const deleteItem = (id: string) => run(() => remove(ref(rtdb, `${table}/${id}`)));

  return { results, isPending, error, getAll, add, update, setItem, deleteItem };
};

export default useRealTimeCollection;
