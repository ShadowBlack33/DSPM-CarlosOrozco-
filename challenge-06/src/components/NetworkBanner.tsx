import { IonIcon } from '@ionic/react';
import { cloudOfflineOutline } from 'ionicons/icons';
import { useNetworkStatus } from '../context/NetworkContext';

const typeLabel: Record<string, string> = { wifi: 'Wi‑Fi', cellular: 'Datos móviles', none: 'Sin red', unknown: 'Conectado' };

// Píldora con el estado actual de la red
export const NetPill = () => {
  const { isOnline, connectionType } = useNetworkStatus();
  return (
    <span className={`net${isOnline ? '' : ' is-off'}`} role="status">
      <span className="net__dot" />
      {isOnline ? typeLabel[connectionType ?? 'unknown'] ?? 'Conectado' : 'Sin conexión'}
    </span>
  );
};

// Franja que solo aparece cuando no hay red
const NetworkBanner = ({ offlineMessage }: { offlineMessage: string }) => {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="offline-band" role="alert">
      <IonIcon icon={cloudOfflineOutline} />
      <span>{offlineMessage}</span>
    </div>
  );
};

export default NetworkBanner;
