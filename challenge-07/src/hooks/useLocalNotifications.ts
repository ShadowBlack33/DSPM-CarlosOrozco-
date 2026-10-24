import { useEffect, useState } from 'react';
import { LocalNotifications, type PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { friendlyError } from '../support';

const useLocalNotifications = () => {
  const [permission, setPermission] = useState<string>('prompt');
  const [pending, setPending] = useState<PendingLocalNotificationSchema[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const res = await LocalNotifications.requestPermissions();
      setPermission(res.display);
      return res.display === 'granted';
    } catch (err) {
      setError(friendlyError(err));
      return false;
    }
  };

  const refreshPending = async () => {
    try {
      const res = await LocalNotifications.getPending();
      setPending(res.notifications);
    } catch {
      setPending([]);
    }
  };

  // Programa una notificación dentro de `seconds` segundos
  const schedule = async (title: string, body: string, seconds = 5) => {
    setError(null);
    try {
      if (permission !== 'granted' && !(await requestPermission())) {
        throw new Error('Permiso de notificaciones denegado');
      }
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.floor(Math.random() * 100000),
          title,
          body,
          schedule: { at: new Date(Date.now() + seconds * 1000), allowWhileIdle: true },
        }],
      });
      await refreshPending();
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  const cancelAll = async () => {
    if (pending.length) await LocalNotifications.cancel({ notifications: pending.map((n) => ({ id: n.id })) });
    await refreshPending();
  };

  useEffect(() => {
    LocalNotifications.checkPermissions().then((r) => setPermission(r.display)).catch(() => {});
    refreshPending();
    const received = LocalNotifications.addListener('localNotificationReceived', (n) => {
      setLastAction(`Recibida: ${n.title}`);
      refreshPending();
    });
    const action = LocalNotifications.addListener('localNotificationActionPerformed', (a) => {
      setLastAction(`Tocada: ${a.notification.title}`);
    });
    return () => {
      received.then((h) => h.remove());
      action.then((h) => h.remove());
    };
  }, []);

  return { permission, pending, lastAction, error, requestPermission, schedule, cancelAll };
};

export default useLocalNotifications;
