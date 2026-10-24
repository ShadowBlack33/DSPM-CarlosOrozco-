import type { Progress } from '../types';

// Persistencia local: un registro por usuario para que dos cuentas en el mismo
// celular no se mezclen.
const progressKey = (uid: string) => `parcial2:progress:${uid}`;
const photoKey = (uid: string) => `parcial2:photo:${uid}`;

const safe = <T,>(fn: () => T, fallback: T): T => {
  try { return fn(); } catch { return fallback; }
};

export const loadLocalProgress = (uid: string): Progress | null =>
  safe(() => {
    const raw = localStorage.getItem(progressKey(uid));
    return raw ? (JSON.parse(raw) as Progress) : null;
  }, null);

export const saveLocalProgress = (uid: string, progress: Progress) =>
  safe(() => localStorage.setItem(progressKey(uid), JSON.stringify(progress)), undefined);

export const loadLocalPhoto = (uid: string): string | null =>
  safe(() => localStorage.getItem(photoKey(uid)), null);

export const saveLocalPhoto = (uid: string, dataUrl: string | null) =>
  safe(() => {
    if (dataUrl) localStorage.setItem(photoKey(uid), dataUrl);
    else localStorage.removeItem(photoKey(uid));
  }, undefined);
