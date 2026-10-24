import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export type NotifPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

const isNative = Capacitor.isNativePlatform();
const hasWebNotifications = () => typeof window !== 'undefined' && 'Notification' in window;

const toPermission = (p: string): NotifPermission =>
  p === 'granted' ? 'granted' : p === 'denied' ? 'denied' : p === 'default' || p === 'prompt' ? 'prompt' : 'unknown';

/**
 * Notificaciones locales.
 * - App nativa (Android/iOS): @capacitor/local-notifications
 * - Navegador: Notification API a través del service worker (/sw.js), que es lo
 *   único que Chrome en Android permite. Si no hay SW, se intenta new Notification().
 */
const useNotifications = () => {
  const [permission, setPermission] = useState<NotifPermission>('unknown');
  const nextId = useRef(Math.floor(Date.now() / 1000) % 100000);

  const refresh = useCallback(async () => {
    try {
      if (isNative) {
        const { display } = await LocalNotifications.checkPermissions();
        setPermission(toPermission(display));
      } else {
        setPermission(hasWebNotifications() ? toPermission(Notification.permission) : 'unknown');
      }
    } catch {
      setPermission('unknown');
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  // Debe llamarse desde un toque/clic del usuario (Chrome bloquea la petición si no)
  const requestPermission = useCallback(async () => {
    try {
      let result: NotifPermission = 'unknown';
      if (isNative) result = toPermission((await LocalNotifications.requestPermissions()).display);
      else if (hasWebNotifications()) result = toPermission(await Notification.requestPermission());
      setPermission(result);
      return result === 'granted';
    } catch {
      setPermission('unknown');
      return false;
    }
  }, []);

  const showWeb = async (title: string, body: string, tag: string) => {
    if (!hasWebNotifications() || Notification.permission !== 'granted') return false;
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (reg) {
      await reg.showNotification(title, { body, tag, icon: '/favicon.png' });
      return true;
    }
    new Notification(title, { body, tag });
    return true;
  };

  const notify = useCallback(async (title: string, body: string, delayMs = 0) => {
    const id = nextId.current++;
    try {
      if (isNative) {
        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') return false;
        await LocalNotifications.schedule({
          notifications: [{
            id,
            title,
            body,
            schedule: delayMs ? { at: new Date(Date.now() + delayMs), allowWhileIdle: true } : undefined,
          }],
        });
        return true;
      }
      if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
      return await showWeb(title, body, String(id));
    } catch (e) {
      console.warn('No se pudo mostrar la notificación', e);
      return false;
    }
  }, []);

  return { permission, requestPermission, notify };
};

export default useNotifications;
