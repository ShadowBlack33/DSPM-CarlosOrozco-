import { IonIcon } from '@ionic/react';
import { cellularOutline, cloudOfflineOutline, wifiOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import useNetwork from '../hooks/useNetwork';

const typeLabel: Record<string, string> = { wifi: 'Wi‑Fi', cellular: 'Datos móviles', none: 'Ninguna', unknown: 'El navegador no lo informa' };

const NetworkPage = () => {
  const { isOnline, connectionType, history } = useNetwork();
  const icon = !isOnline ? cloudOfflineOutline : connectionType === 'wifi' ? wifiOutline : cellularOutline;

  return (
    <SensorPage path="/network" description="Activa el modo avión o apaga el Wi‑Fi para ver el cambio en vivo.">
      <div className="big net-big" role="status">
        <IonIcon icon={icon} style={{ color: isOnline ? 'var(--sensor)' : '#ff8fa3' }} aria-hidden="true" />
        <h2>{isOnline ? 'Conectado' : 'Sin conexión'}</h2>
        <p>Tipo: {typeLabel[connectionType ?? 'unknown'] ?? connectionType}</p>
      </div>
      <h2 className="section-title">Cambios en esta sesión</h2>
      <div className="log">
        {history.length === 0 && <div className="log__empty">Aún no ha cambiado la conexión.</div>}
        {history.map((h, i) => <div className="log__item" key={i}><span>{h}</span></div>)}
      </div>
    </SensorPage>
  );
};

export default NetworkPage;
