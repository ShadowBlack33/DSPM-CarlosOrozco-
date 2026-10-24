import { useEffect, useState, type SetStateAction } from 'react';

const read = <T,>(key: string | null, fallback: T): T => {
  if (!key) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

// Guarda un estado en localStorage bajo una llave; si la llave cambia (otro usuario), carga sus datos
const useLocalStorage = <T,>(key: string | null, initialValue: T) => {
  const [state, setState] = useState(() => ({ key, value: read(key, initialValue) }));

  // Si cambió el usuario, se recarga el valor antes de pintar
  if (state.key !== key) {
    setState({ key, value: read(key, initialValue) });
  }

  useEffect(() => {
    if (state.key) localStorage.setItem(state.key, JSON.stringify(state.value));
  }, [state]);

  const setValue = (action: SetStateAction<T>) =>
    setState((prev) => ({
      key: prev.key,
      value: typeof action === 'function' ? (action as (p: T) => T)(prev.value) : action,
    }));

  return [state.key === key ? state.value : read(key, initialValue), setValue] as const;
};

export default useLocalStorage;
