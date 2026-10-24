// Mantiene la pantalla encendida mientras corre una misión (Screen Wake Lock API,
// disponible en el WebView de Android y en Chrome). Si no existe, no pasa nada.
type Sentinel = { release: () => Promise<void> };

export const requestWakeLock = async (): Promise<Sentinel | null> => {
  try {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } };
    return (await nav.wakeLock?.request('screen')) ?? null;
  } catch {
    return null;
  }
};
