import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Haptics } from '@capacitor/haptics';
import { requestWakeLock } from '../lib/wakeLock';
import { STILL_SECONDS } from '../missions';

export type StillStatus = 'idle' | 'running' | 'done' | 'error';

// Umbrales del acelerómetro (m/s²)
const MOVE_THRESHOLD = 0.6;   // aceleración sin gravedad
const DELTA_THRESHOLD = 0.9;  // cambio brusco entre lecturas (si el sensor no separa la gravedad)

/**
 * Misión 3: el usuario debe quedarse quieto STILL_SECONDS segundos.
 * Escucha el acelerómetro (Capacitor Motion); si detecta movimiento el conteo
 * se reinicia. Al cumplirse, vibra (Capacitor Haptics). Todo con listeners e
 * intervalos: la pantalla nunca se bloquea y además se pide Wake Lock.
 */
const useStillness = (onDone: () => void) => {
  const [status, setStatus] = useState<StillStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [moved, setMoved] = useState(false);
  const [hasSensor, setHasSensor] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const listener = useRef<PluginListenerHandle | null>(null);
  const timer = useRef<number | null>(null);
  const movedTimer = useRef<number | null>(null);
  const stillSince = useRef(0);
  const last = useRef<{ x: number; y: number; z: number } | null>(null);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const cleanup = useCallback(async () => {
    if (timer.current) window.clearInterval(timer.current);
    if (movedTimer.current) window.clearTimeout(movedTimer.current);
    timer.current = null;
    await listener.current?.remove();
    listener.current = null;
    last.current = null;
    await wake.current?.release().catch(() => {});
    wake.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setElapsed(0);
    setMoved(false);
    setHasSensor(null);
    try {
      // iOS exige pedir permiso al sensor desde un toque del usuario
      const DME = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
      if (DME?.requestPermission && Capacitor.getPlatform() === 'ios' && (await DME.requestPermission()) !== 'granted') {
        throw new Error('permiso');
      }

      stillSince.current = Date.now();
      setStatus('running');
      wake.current = await requestWakeLock();

      listener.current = await Motion.addListener('accel', (e) => {
        setHasSensor(true);
        const a = e.acceleration;
        const g = e.accelerationIncludingGravity;
        let moving = false;
        if (a && a.x !== null && a.x !== undefined) {
          moving = Math.hypot(a.x, a.y ?? 0, a.z ?? 0) > MOVE_THRESHOLD;
        }
        if (g && last.current) {
          const d = Math.hypot(g.x - last.current.x, g.y - last.current.y, g.z - last.current.z);
          moving = moving || d > DELTA_THRESHOLD;
        }
        if (g) last.current = { x: g.x, y: g.y, z: g.z };

        if (moving) {
          stillSince.current = Date.now();
          setMoved(true);
          if (movedTimer.current) window.clearTimeout(movedTimer.current);
          movedTimer.current = window.setTimeout(() => setMoved(false), 1200);
        }
      });

      timer.current = window.setInterval(() => {
        const ms = Date.now() - stillSince.current;
        setElapsed(Math.min(ms, STILL_SECONDS * 1000));
        if (ms >= 1500) setHasSensor((v) => v ?? false); // sin lecturas = sin acelerómetro
        if (ms >= STILL_SECONDS * 1000) {
          void cleanup();
          setStatus('done');
          void Haptics.vibrate({ duration: 1000 }).catch(() => navigator.vibrate?.(1000));
          onDoneRef.current();
        }
      }, 100);
    } catch (e) {
      console.error(e);
      setError('No se pudo acceder al acelerómetro.');
      setStatus('error');
      void cleanup();
    }
  }, [cleanup]);

  const cancel = useCallback(() => {
    void cleanup();
    setStatus('idle');
    setElapsed(0);
  }, [cleanup]);

  useEffect(() => () => { void cleanup(); }, [cleanup]);

  return { status, elapsed, moved, hasSensor, error, start, cancel };
};

export default useStillness;
