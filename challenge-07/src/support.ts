import { Capacitor } from '@capacitor/core';

// Qué puede hacer el entorno actual. En la app nativa (Android/iOS) todo está disponible;
// en el navegador depende de HTTPS y del navegador (Safari en iPhone es el más restrictivo).
const isNative = Capacitor.isNativePlatform();
const isSecure = typeof window !== 'undefined' && window.isSecureContext;
const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

const HTTPS_MSG =
  'El navegador bloquea este sensor porque la página no usa HTTPS. En el PC corre "npm run phone" y abre en el celular la dirección https:// que aparece.';

export const support = {
  isNative,
  isIOS,
  /** Mensaje si el sensor necesita HTTPS y no lo hay; null si está bien */
  needsHttps: (): string | null => (!isNative && !isSecure ? HTTPS_MSG : null),
  vibration: isNative || (typeof navigator !== 'undefined' && 'vibrate' in navigator),
  notifications: isNative || (typeof window !== 'undefined' && 'Notification' in window),
  motion: isNative || (typeof window !== 'undefined' && 'DeviceMotionEvent' in window),
};

// Traduce errores típicos del navegador a algo entendible
export const friendlyError = (err: unknown): string => {
  const msg = err instanceof Error ? err.message : String(err);
  if (/origin does not have permission|secure|only secure origins/i.test(msg)) return HTTPS_MSG;
  if (/denied|permission/i.test(msg)) return 'Permiso denegado. Actívalo en los ajustes del navegador para este sitio y vuelve a intentar.';
  if (/DeviceMotionEvent/i.test(msg)) return HTTPS_MSG;
  if (/not supported/i.test(msg)) return 'Este navegador no ofrece esta función. Pruébala en la app nativa.';
  if (/cancel/i.test(msg)) return '';
  return msg;
};
