import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export type NotifPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

// Notificaciones locales (Capacitor). En el navegador usa la Notification API.
const useNotifications = () => {
  const [permission, setPermission] = useState<NotifPermission>('unknown');
  const nextId = useRef(Math.floor(Date.now() / 1000) % 100000);

  // Solo consulta el estado (no pregunta): así no se bloquea el aviso del navegador
  const refresh = useCallback(async () => {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      setPermission(display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt');
      return display;
    } catch {
      setPermission('unknown');
      return 'denied';
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  // Debe llamarse desde un toque/clic del usuario (Chrome bloquea la petición si no)
  const requestPermission = useCallback(async () => {
    try {
      const { display } = await LocalNotifications.requestPermissions();
      setPermission(display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt');
      return display === 'granted';
    } catch {
      setPermission('unknown');
      return false;
    }
  }, []);

  const notify = useCallback(async (title: string, body: string, delayMs = 0) => {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted') return false;
      await LocalNotifications.schedule({
        notifications: [{
          id: nextId.current++,
          title,
          body,
          schedule: delayMs ? { at: new Date(Date.now() + delayMs), allowWhileIdle: true } : undefined,
        }],
      });
      return true;
    } catch (e) {
      console.warn('No se pudo mostrar la notificación', e);
      return false;
    }
  }, []);

  return { permission, requestPermission, notify };
};

export default useNotifications;
