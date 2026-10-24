export type MissionId = 1 | 2 | 3;

export interface MissionDef {
  id: MissionId;
  title: string;
  description: string;
  points: number;
  /** Misión que debe estar completada antes de poder empezar esta */
  requires?: MissionId;
}

export interface MissionState {
  id: MissionId;
  completed: boolean;
}

/** Forma exacta que se guarda en Firebase y en localStorage */
export interface Progress {
  points: number;
  missions: MissionState[];
}

export interface RankingRow {
  uid: string;
  name: string;
  points: number;
  rank: number;
  isMe: boolean;
}
