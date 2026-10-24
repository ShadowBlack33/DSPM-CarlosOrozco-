import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, type PushNotificationSchema } from '@capacitor/push-notifications';

// Solo funciona en Android/iOS nativo con Firebase Cloud Messaging configurado (google-services.json)
const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isNative = Capacitor.isNativePlatform();

  const register = async () => {
    setError(null);
    if (!isNative) {
      setError('Las push notifications solo funcionan en un dispositivo Android/iOS');
      return;
    }
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === 'prompt') perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      setError('Permiso de notificaciones denegado');
      return;
    }

    await PushNotifications.removeAllListeners();
    await PushNotifications.addListener('registration', (t) => setToken(t.value));
    await PushNotifications.addListener('registrationError', (e) => setError(JSON.stringify(e.error)));
    await PushNotifications.addListener('pushNotificationReceived', (n) =>
      setNotifications((prev) => [n, ...prev]));
    await PushNotifications.addListener('pushNotificationActionPerformed', (a) =>
      setNotifications((prev) => [a.notification, ...prev]));

    await PushNotifications.register();
  };

  return { isNative, token, notifications, error, register };
};

export default usePushNotifications;
