import type { MissionDef, MissionState, Progress } from './types';

// Reglas de cada misión (fáciles de ajustar)
export const DISTANCE_GOAL_M = 30;   // Misión 2: "distancia > 30m"
export const MAX_GPS_ACCURACY_M = 35; // lecturas con más error que esto no cuentan
export const STILL_SECONDS = 10;     // Misión 3

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    title: 'Evidencia',
    description: 'Toma una foto con la cámara y guárdala.',
    points: 50,
  },
  {
    id: 2,
    title: 'Movimiento real',
    description: `Aléjate más de ${DISTANCE_GOAL_M} m de tu posición original.`,
    points: 70,
  },
  {
    id: 3,
    title: 'Permanencia activa',
    description: `Quédate quieto ${STILL_SECONDS} segundos. Al terminar el celular vibra.`,
    points: 80,
    requires: 2,
  },
];

export const TOTAL_POINTS = MISSIONS.reduce((s, m) => s + m.points, 0);

export const emptyProgress = (): Progress => ({
  points: 0,
  missions: MISSIONS.map((m) => ({ id: m.id, completed: false })),
});

/** Los puntos siempre se recalculan a partir de las misiones completadas */
export const pointsFor = (missions: MissionState[]) =>
  missions.reduce((s, ms) => s + (ms.completed ? MISSIONS.find((m) => m.id === ms.id)?.points ?? 0 : 0), 0);

/** Une dos progresos (local y Firebase): una misión completada en cualquiera de los dos cuenta */
export const mergeProgress = (a: Progress | null, b: Progress | null): Progress => {
  const missions = MISSIONS.map((m) => ({
    id: m.id,
    completed: Boolean(
      a?.missions?.find((x) => x.id === m.id)?.completed || b?.missions?.find((x) => x.id === m.id)?.completed,
    ),
  }));
  return { points: pointsFor(missions), missions };
};
