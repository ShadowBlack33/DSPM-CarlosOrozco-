import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Capacitor } from '@capacitor/core';
import App from './App.tsx';

// Necesario para que la cámara funcione en el navegador (web)
defineCustomElements(window);

// En la versión web (navegador del celular) las notificaciones salen por un service worker
if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW no registrado', e));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
