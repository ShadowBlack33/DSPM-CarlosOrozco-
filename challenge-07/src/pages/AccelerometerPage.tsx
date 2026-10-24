import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { Readouts } from '../components/Readouts';
import useAccelerometer from '../hooks/useAccelerometer';
import Notice from '../components/Notice';
import { support } from '../support';

const fmt = (n?: number | null) => (n === undefined || n === null ? null : n.toFixed(2));
const clamp = (n: number, max: number) => Math.max(-max, Math.min(max, n));

const AccelerometerPage = () => {
  const { accel, orientation, isListening, error, start, stop } = useAccelerometer();
  const a = accel?.accelerationIncludingGravity;

  // Nivel de burbuja: la inclinación (beta / gamma) mueve la burbuja dentro del círculo
  const x = clamp(orientation?.gamma ?? 0, 45) / 45;
  const y = clamp(orientation?.beta ?? 0, 45) / 45;

  return (
    <SensorPage path="/accelerometer" description="Inclina el teléfono: la burbuja se mueve como en un nivel de construcción." error={error}>
      {support.isIOS && !support.isNative && !isListening && !error && (
        <Notice>En iPhone, al tocar "Empezar a leer" Safari te pedirá permiso para usar el movimiento. Elige Permitir.</Notice>
      )}
      <div className="level" aria-hidden="true">
        <div className="level__ring" />
        <div className="level__bubble" style={{ transform: `translate(${x * 95}px, ${y * 95}px)` }} />
      </div>
      {isListening && <p className="live" style={{ margin: '0 4px 12px' }}>Leyendo sensores</p>}

      <h2 className="section-title">Aceleración con gravedad (m/s²)</h2>
      <Readouts three items={[['X', fmt(a?.x)], ['Y', fmt(a?.y)], ['Z', fmt(a?.z)]]} />
      <h2 className="section-title">Orientación (grados)</h2>
      <Readouts three items={[['Brújula α', fmt(orientation?.alpha)], ['Frente β', fmt(orientation?.beta)], ['Lado γ', fmt(orientation?.gamma)]]} />

      <IonButton className={isListening ? 'btn-outline' : 'btn'} fill={isListening ? 'outline' : 'solid'} expand="block"
        onClick={isListening ? stop : start}>
        {isListening ? 'Detener' : 'Empezar a leer'}
      </IonButton>
    </SensorPage>
  );
};

export default AccelerometerPage;
