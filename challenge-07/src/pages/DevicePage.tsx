import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { BigReading, Readouts } from '../components/Readouts';
import useDevice from '../hooks/useDevice';
import Notice from '../components/Notice';

const DevicePage = () => {
  const { info, battery, id, language, refresh } = useDevice();
  const level = battery?.batteryLevel;
  const pct = level !== undefined ? Math.round(level * 100) : null;

  return (
    <SensorPage path="/device" description="Lo que el sistema cuenta sobre este equipo: modelo, sistema operativo y batería.">
      {pct === null && info && (
        <Notice>Este navegador no comparte el nivel de batería (Safari y Firefox lo ocultan). En la app nativa sí aparece.</Notice>
      )}
      <BigReading
        label={battery?.isCharging ? 'Batería, cargando' : 'Batería'}
        value={pct}
        unit="%"
        extra={pct !== null && (
          <div className="battery" style={{ marginTop: 12 }}>
            <div className="battery__shell"><div className="battery__fill" style={{ width: `${pct}%`, background: pct < 20 ? '#ff8fa3' : undefined }} /></div>
          </div>
        )}
      />
      <Readouts items={[
        ['Modelo', info?.model],
        ['Fabricante', info?.manufacturer],
        ['Sistema', info && `${info.operatingSystem} ${info.osVersion}`],
        ['Plataforma', info?.platform],
        ['Idioma', language?.value],
        ['Emulador', info ? (info.isVirtual ? 'Sí' : 'No') : null],
      ]} />
      <Readouts items={[['Identificador', id?.identifier]]} />
      <IonButton className="btn-outline" fill="outline" expand="block" onClick={refresh}>Volver a leer</IonButton>
    </SensorPage>
  );
};

export default DevicePage;
