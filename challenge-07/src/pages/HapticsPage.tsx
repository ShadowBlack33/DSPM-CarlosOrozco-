import { ImpactStyle, NotificationType } from '@capacitor/haptics';
import SensorPage from '../components/SensorPage';
import useHaptics from '../hooks/useHaptics';
import Notice from '../components/Notice';
import { support } from '../support';

const HapticsPage = () => {
  const { impact, notification, vibrate, selection } = useHaptics();

  return (
    <SensorPage path="/haptics" description="Toca cada botón y siente la diferencia. En equipos sin vibrador no pasa nada.">
      {!support.vibration && (
        <Notice>
          {support.isIOS
            ? 'Safari en iPhone no permite vibrar desde una página web. La vibración funciona en la app nativa (npx cap add android / ios).'
            : 'Este navegador no permite vibrar. Pruébalo en Chrome de Android o en la app nativa.'}
        </Notice>
      )}
      <h2 className="section-title">Golpe</h2>
      <div className="pads">
        <button className="pad" onClick={() => impact(ImpactStyle.Light)}><i style={{ width: 10, height: 10 }} />Suave</button>
        <button className="pad" onClick={() => impact(ImpactStyle.Medium)}><i style={{ width: 18, height: 18 }} />Medio</button>
        <button className="pad" onClick={() => impact(ImpactStyle.Heavy)}><i style={{ width: 28, height: 28 }} />Fuerte</button>
      </div>
      <h2 className="section-title">Aviso</h2>
      <div className="pads">
        <button className="pad" onClick={() => notification(NotificationType.Success)}>Éxito</button>
        <button className="pad" onClick={() => notification(NotificationType.Warning)}>Alerta</button>
        <button className="pad" onClick={() => notification(NotificationType.Error)}>Error</button>
      </div>
      <h2 className="section-title">Otros</h2>
      <div className="pads">
        <button className="pad" onClick={() => vibrate(1000)}>1 segundo</button>
        <button className="pad" onClick={() => vibrate(300)}>Corta</button>
        <button className="pad" onClick={selection}>Selección</button>
      </div>
    </SensorPage>
  );
};

export default HapticsPage;
