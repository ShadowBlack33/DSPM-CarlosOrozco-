import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { IonToast } from '@ionic/react';
import { useAuth } from './AuthContext';
import useProgress from '../hooks/useProgress';
import useNotifications from '../hooks/useNotifications';
import useDistanceTracker from '../hooks/useDistanceTracker';
import useStillness from '../hooks/useStillness';
import { MISSIONS } from '../missions';
import type { MissionId } from '../types';

/**
 * Estado global del juego. Vive arriba de las rutas para que el GPS y el
 * acelerómetro sigan corriendo aunque el usuario cambie de pestaña.
 */
const useGameState = () => {
  const { user } = useAuth();
  const progress = useProgress(user);
  const { notify, permission, requestPermission } = useNotifications();

  // Aviso dentro de la app con el mismo texto de la notificación (siempre visible)
  const [toasts, setToasts] = useState<{ id: number; title: string; body: string }[]>([]);
  const alert = useCallback(
    (title: string, body: string, delayMs = 0) => {
      void notify(title, body, delayMs);
      window.setTimeout(() => setToasts((t) => [...t, { id: Date.now() + Math.random(), title, body }]), delayMs);
    },
    [notify],
  );
  const dismissToast = useCallback(() => setToasts((t) => t.slice(1)), []);

  const completeMission = useCallback(
    async (id: MissionId, photo?: string) => {
      const next = await progress.complete(id, photo);
      if (!next) return;
      const mission = MISSIONS.find((m) => m.id === id)!;
      const remaining = next.missions.filter((m) => !m.completed).length;

      alert('Has completado una misión', `${mission.title} · +${mission.points} puntos`);
      if (remaining === 1) alert('Te falta 1 misión para completar', '¡Ya casi! Termina la última misión.', 3200);
      if (remaining === 0) alert('¡Completaste todas las misiones!', `Sumaste ${next.points} puntos en total.`, 3200);
    },
    [progress, alert],
  );

  const distance = useDistanceTracker(() => void completeMission(2));
  const stillness = useStillness(() => void completeMission(3));

  const completedCount = progress.progress.missions.filter((m) => m.completed).length;
  const total = MISSIONS.length;

  const isCompleted = useCallback(
    (id: MissionId) => Boolean(progress.progress.missions.find((m) => m.id === id)?.completed),
    [progress.progress.missions],
  );

  const isUnlocked = useCallback(
    (id: MissionId) => {
      const req = MISSIONS.find((m) => m.id === id)?.requires;
      return !req || isCompleted(req);
    },
    [isCompleted],
  );

  return {
    ...progress,
    completeMission,
    distance,
    stillness,
    completedCount,
    total,
    percent: Math.round((completedCount / total) * 100),
    isCompleted,
    isUnlocked,
    notifPermission: permission,
    requestNotifPermission: requestPermission,
    toasts,
    dismissToast,
  };
};

type GameValue = ReturnType<typeof useGameState>;
const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const game = useGameState();
  const current = game.toasts[0];
  return (
    <GameContext.Provider value={game}>
      {children}
      <IonToast
        key={current?.id}
        isOpen={Boolean(current)}
        header={current?.title}
        message={current?.body}
        duration={2800}
        position="top"
        cssClass="mission-toast"
        onDidDismiss={game.dismissToast}
      />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider');
  return ctx;
};
