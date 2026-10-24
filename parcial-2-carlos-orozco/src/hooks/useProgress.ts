import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { User } from 'firebase/auth';
import { deleteField, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { loadLocalPhoto, loadLocalProgress, saveLocalPhoto, saveLocalProgress } from '../lib/storage';
import { thumbnail } from '../lib/image';
import { emptyProgress, mergeProgress, pointsFor } from '../missions';
import type { MissionId, Progress } from '../types';

export type SyncStatus = 'idle' | 'saving' | 'synced' | 'error';

interface State {
  progress: Progress;
  photo: string | null;
  loaded: boolean;
  sync: SyncStatus;
}

type Action =
  | { type: 'LOAD'; progress: Progress; photo: string | null }
  | { type: 'SET'; progress: Progress; photo?: string | null }
  | { type: 'SYNC'; status: SyncStatus };

const initial: State = { progress: emptyProgress(), photo: null, loaded: false, sync: 'idle' };

// Manejo de estado del progreso con useReducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD':
      return { ...state, progress: action.progress, photo: action.photo, loaded: true };
    case 'SET':
      return {
        ...state,
        progress: action.progress,
        photo: action.photo === undefined ? state.photo : action.photo,
      };
    case 'SYNC':
      return { ...state, sync: action.status };
  }
};

/**
 * Progreso del usuario: { points, missions: [{ id, completed }] }
 * - Se guarda SIEMPRE en localStorage (funciona sin internet)
 * - Se envía a Firestore en users/{uid} (de ahí sale el ranking)
 * - Al entrar se unen ambas fuentes: lo completado en cualquiera cuenta
 */
const useProgress = (user: User | null) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const stateRef = useRef(state);
  stateRef.current = state;
  const uid = user?.uid ?? null;

  // API: envía puntos y misiones a Firebase
  const pushToFirebase = useCallback(
    async (u: User, progress: Progress, extra: Record<string, unknown> = {}) => {
      dispatch({ type: 'SYNC', status: 'saving' });
      try {
        await setDoc(
          doc(db, 'users', u.uid),
          {
            name: u.displayName || u.email?.split('@')[0] || 'Jugador',
            email: u.email,
            points: progress.points,
            missions: progress.missions,
            updatedAt: serverTimestamp(),
            ...extra,
          },
          { merge: true },
        );
        dispatch({ type: 'SYNC', status: 'synced' });
      } catch (e) {
        console.error('Firestore', e);
        dispatch({ type: 'SYNC', status: 'error' });
      }
    },
    [],
  );

  // Carga inicial: primero local (instantáneo), luego Firebase
  useEffect(() => {
    if (!user || !uid) return;
    let cancelled = false;
    const local = loadLocalProgress(uid);
    const localPhoto = loadLocalPhoto(uid);
    dispatch({ type: 'LOAD', progress: mergeProgress(local, null), photo: localPhoto });

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (cancelled) return;
        const remote = snap.exists() ? (snap.data() as Progress & { photo?: string }) : null;
        const merged = mergeProgress(stateRef.current.progress, remote);
        const photo = stateRef.current.photo ?? remote?.photo ?? null;
        dispatch({ type: 'LOAD', progress: merged, photo });
        saveLocalProgress(uid, merged);
        // Sube lo que haya quedado solo en local (p. ej. misiones hechas sin internet)
        const differs = !remote || remote.points !== merged.points || !Array.isArray(remote.missions);
        if (differs) await pushToFirebase(user, merged);
        else dispatch({ type: 'SYNC', status: 'synced' });
      } catch (e) {
        console.error('Firestore', e);
        if (!cancelled) dispatch({ type: 'SYNC', status: 'error' });
      }
    })();

    return () => { cancelled = true; };
  }, [uid]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Marca una misión como completada. Devuelve el progreso nuevo (o null si ya lo estaba). */
  const complete = useCallback(
    async (id: MissionId, photo?: string) => {
      if (!user) return null;
      const current = stateRef.current.progress;
      if (current.missions.find((m) => m.id === id)?.completed) return null;

      const missions = current.missions.map((m) => (m.id === id ? { ...m, completed: true } : m));
      const next: Progress = { points: pointsFor(missions), missions };

      dispatch({ type: 'SET', progress: next, photo });
      saveLocalProgress(user.uid, next);
      if (photo) saveLocalPhoto(user.uid, photo);

      void pushToFirebase(user, next, photo ? { photo: await thumbnail(photo) } : {});
      return next;
    },
    [user, pushToFirebase],
  );

  /** Reinicia el progreso (útil para la demo) */
  const reset = useCallback(async () => {
    if (!user) return;
    const next = emptyProgress();
    dispatch({ type: 'SET', progress: next, photo: null });
    saveLocalProgress(user.uid, next);
    saveLocalPhoto(user.uid, null);
    await pushToFirebase(user, next, { photo: deleteField() });
  }, [user, pushToFirebase]);

  return { ...state, complete, reset };
};

export default useProgress;
