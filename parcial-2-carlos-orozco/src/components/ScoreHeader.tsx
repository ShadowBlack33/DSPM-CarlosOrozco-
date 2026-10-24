import { IonIcon, IonProgressBar } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { useGame } from '../context/GameContext';
import { TOTAL_POINTS } from '../missions';

const SYNC_LABEL = {
  idle: 'Cargando…',
  saving: 'Enviando a Firebase…',
  synced: 'Guardado en Firebase',
  error: 'Guardado solo en el celular',
} as const;

// Puntos acumulados + barra de progreso (% y misiones completadas / total)
const ScoreHeader = ({ name }: { name: string }) => {
  const { progress, completedCount, total, percent, sync, notifPermission, requestNotifPermission } = useGame();

  return (
    <header className="score">
      <div className="score__top">
        <span className="eyebrow">Agente {name}</span>
        <span className={`sync sync--${sync}`}><i aria-hidden="true" />{SYNC_LABEL[sync]}</span>
      </div>
      <div className="score__points">
        <strong>{progress.points}</strong>
        <span>/ {TOTAL_POINTS} pts</span>
      </div>
      <IonProgressBar className="score__bar" value={percent / 100} />
      <div className="score__meta">
        <span>{completedCount} / {total} misiones</span>
        <span>{percent}% completado</span>
      </div>
      {notifPermission !== 'granted' && (
        <button type="button" className="notif-btn" onClick={() => void requestNotifPermission()}>
          <IonIcon icon={notificationsOutline} aria-hidden="true" />
          {notifPermission === 'denied'
            ? 'Notificaciones bloqueadas: actívalas en el candado de la barra de direcciones'
            : 'Activar notificaciones'}
        </button>
      )}
    </header>
  );
};

export default ScoreHeader;
