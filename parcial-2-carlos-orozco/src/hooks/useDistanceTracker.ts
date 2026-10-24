import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { distanceMeters } from '../lib/geo';
import { requestWakeLock } from '../lib/wakeLock';
import { DISTANCE_GOAL_M, MAX_GPS_ACCURACY_M } from '../missions';

export type TrackerStatus = 'idle' | 'locating' | 'tracking' | 'done' | 'error';

/**
 * Misión 2: guarda la posición original y escucha el GPS (watchPosition).
 * Se cumple cuando la distancia al origen supera DISTANCE_GOAL_M con una lectura
 * suficientemente precisa (así el "salto" del GPS estando quieto no la completa).
 */
const useDistanceTracker = (onGoal: () => void) => {
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [distance, setDistance] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const origin = useRef<Position | null>(null);
  const watchId = useRef<string | null>(null);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  const onGoalRef = useRef(onGoal);
  onGoalRef.current = onGoal;

  const stop = useCallback(async () => {
    if (watchId.current) await Geolocation.clearWatch({ id: watchId.current });
    watchId.current = null;
    await wake.current?.release().catch(() => {});
    wake.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setDistance(0);
    setStatus('locating');
    try {
      try {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') await Geolocation.requestPermissions();
      } catch { /* en web no existe requestPermissions: el navegador pregunta solo */ }

      origin.current = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
      setAccuracy(origin.current.coords.accuracy);
      setStatus('tracking');
      wake.current = await requestWakeLock();

      watchId.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
        (pos, err) => {
          if (err || !pos || !origin.current) return;
          const o = origin.current.coords;
          // Si el punto de partida era impreciso y llega una lectura mejor, la usamos como origen
          if (o.accuracy > MAX_GPS_ACCURACY_M && pos.coords.accuracy < o.accuracy) {
            origin.current = pos;
            setAccuracy(pos.coords.accuracy);
            return;
          }
          const d = distanceMeters(o.latitude, o.longitude, pos.coords.latitude, pos.coords.longitude);
          setDistance(d);
          setAccuracy(pos.coords.accuracy);
          if (d > DISTANCE_GOAL_M && pos.coords.accuracy <= MAX_GPS_ACCURACY_M) {
            setStatus('done');
            void stop();
            onGoalRef.current();
          }
        },
      );
    } catch (e) {
      console.error(e);
      setError('No se pudo leer la ubicación. Activa el GPS y da permiso de ubicación.');
      setStatus('error');
      void stop();
    }
  }, [stop]);

  const cancel = useCallback(() => {
    void stop();
    setStatus('idle');
    setDistance(0);
  }, [stop]);

  useEffect(() => () => { void stop(); }, [stop]);

  return { status, distance, accuracy, error, start, cancel };
};

export default useDistanceTracker;
