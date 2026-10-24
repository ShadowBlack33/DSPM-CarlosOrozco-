import type { ReactNode } from 'react';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, lockClosed } from 'ionicons/icons';
import type { MissionDef } from '../types';

interface Props {
  mission: MissionDef;
  completed: boolean;
  locked?: boolean;
  active?: boolean;
  lockedText?: string;
  children?: ReactNode;
}

// Tarjeta de misión: número, estado (pendiente / completada), puntos y zona de acción
const MissionCard = ({ mission, completed, locked, active, lockedText, children }: Props) => {
  const state = completed ? 'done' : locked ? 'locked' : active ? 'active' : 'pending';
  const label = { done: 'Completada', locked: 'Bloqueada', active: 'En curso', pending: 'Pendiente' }[state];

  return (
    <article className={`mission mission--${state}`}>
      <div className="mission__head">
        <span className="mission__num">{String(mission.id).padStart(2, '0')}</span>
        <div className="mission__title">
          <h2>{mission.title}</h2>
          <p>{mission.description}</p>
        </div>
        <span className="mission__pts">+{mission.points}</span>
      </div>
      <div className="mission__status">
        <span className={`badge badge--${state}`}>
          {state === 'done' && <IonIcon icon={checkmarkCircle} aria-hidden="true" />}
          {state === 'locked' && <IonIcon icon={lockClosed} aria-hidden="true" />}
          {label}
        </span>
      </div>
      {locked && !completed ? <p className="mission__locked">{lockedText}</p> : children}
    </article>
  );
};

export default MissionCard;
