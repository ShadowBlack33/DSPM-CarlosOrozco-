import {
  locateOutline, cameraOutline, speedometerOutline, phonePortraitOutline, pulseOutline,
  folderOpenOutline, notificationsOutline, cloudDownloadOutline, wifiOutline,
} from 'ionicons/icons';

export interface Sensor {
  path: string;
  name: string;
  plugin: string;
  hint: string;
  icon: string;
  color: string;
}

// El Home crea un botón por cada sensor de esta lista
export const sensors: Sensor[] = [
  { path: '/geolocation', name: 'Ubicación', plugin: '@capacitor/geolocation', hint: 'GPS', icon: locateOutline, color: '#6ea8ff' },
  { path: '/camera', name: 'Cámara', plugin: '@capacitor/camera', hint: 'Foto o galería', icon: cameraOutline, color: '#ff9f6e' },
  { path: '/accelerometer', name: 'Movimiento', plugin: '@capacitor/motion', hint: 'Acelerómetro', icon: speedometerOutline, color: '#7ee0b5' },
  { path: '/device', name: 'Dispositivo', plugin: '@capacitor/device', hint: 'Modelo y batería', icon: phonePortraitOutline, color: '#c9a3ff' },
  { path: '/haptics', name: 'Vibración', plugin: '@capacitor/haptics', hint: 'Háptica', icon: pulseOutline, color: '#ffd166' },
  { path: '/filesystem', name: 'Archivos', plugin: '@capacitor/filesystem', hint: 'Leer y escribir', icon: folderOpenOutline, color: '#5fd4e6' },
  { path: '/local-notifications', name: 'Recordatorios', plugin: '@capacitor/local-notifications', hint: 'Notificaciones locales', icon: notificationsOutline, color: '#ff8fa3' },
  { path: '/push-notifications', name: 'Push', plugin: '@capacitor/push-notifications', hint: 'Firebase Messaging', icon: cloudDownloadOutline, color: '#a3b8ff' },
  { path: '/network', name: 'Red', plugin: '@capacitor/network', hint: 'Conectividad', icon: wifiOutline, color: '#b5e36e' },
];

export const sensorByPath = (path: string) => sensors.find((s) => s.path === path)!;
