import { useState } from 'react';
import { db } from '../firebase/config';
import {
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
  type DocumentData, type WhereFilterOp,
} from 'firebase/firestore';

export type Filter = [string, WhereFilterOp, unknown];

// CRUD básico para cualquier colección de Firestore
const useCollection = <T extends DocumentData>(table: string) => {
  const [results, setResults] = useState<(T & { id: string })[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (filters: Filter[] = []) => {
    setIsPending(true);
    setError(null);
    try {
      let q = query(collection(db, table));
      for (const [field, op, value] of filters) {
        q = query(q, where(field, op, value));
      }
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
      setResults(docs);
      setIsPending(false);
      return docs;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return [];
    }
  };

  // ── Agregar documento
  const add = async (data: T) => {
    setIsPending(true);
    setError(null);
    try {
      const ref = await addDoc(collection(db, table), { ...data, createdAt: serverTimestamp() });
      setIsPending(false);
      return ref;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return null;
    }
  };

  // ── Actualizar documento
  const update = async (id: string, data: Partial<T>) => {
    setIsPending(true);
    setError(null);
    try {
      await updateDoc(doc(db, table, id), { ...data, updatedAt: serverTimestamp() });
      setIsPending(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return false;
    }
  };

  // ── Eliminar documento
  const remove = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await deleteDoc(doc(db, table, id));
      setIsPending(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return false;
    }
  };

  return { results, isPending, error, getAll, add, update, remove };
};

export default useCollection;
