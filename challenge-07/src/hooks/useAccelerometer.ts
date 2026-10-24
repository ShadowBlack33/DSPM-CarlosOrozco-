import { useEffect, useRef, useState } from 'react';
import { Motion, type AccelListenerEvent, type RotationRate } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';
import { friendlyError, support } from '../support';

interface Orientation { alpha: number; beta: number; gamma: number }

const useAccelerometer = () => {
  const [accel, setAccel] = useState<AccelListenerEvent | null>(null);
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handles = useRef<PluginListenerHandle[]>([]);

  const start = async () => {
    setError(null);
    if (!support.motion || support.needsHttps()) {
      setError(support.needsHttps() ?? 'Este navegador no expone el sensor de movimiento.');
      return;
    }
    try {
      // En iOS (Safari) se necesita pedir permiso explícito, y debe ser tras un toque del usuario
      const DME = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof DME.requestPermission === 'function') {
        const res = await DME.requestPermission();
        if (res !== 'granted') throw new Error('Permiso de movimiento denegado. Toca de nuevo y elige Permitir.');
      }
      handles.current.push(await Motion.addListener('accel', (e) => setAccel(e)));
      handles.current.push(await Motion.addListener('orientation', (e: RotationRate) => setOrientation(e)));
      setIsListening(true);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  const stop = async () => {
    await Promise.all(handles.current.map((h) => h.remove()));
    handles.current = [];
    setIsListening(false);
  };

  useEffect(() => () => { handles.current.forEach((h) => h.remove()); }, []);

  return { accel, orientation, isListening, error, start, stop };
};

export default useAccelerometer;
