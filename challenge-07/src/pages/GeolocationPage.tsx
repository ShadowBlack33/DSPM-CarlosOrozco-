import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { BigReading, Readouts } from '../components/Readouts';
import useGeolocation from '../hooks/useGeolocation';
import Notice from '../components/Notice';
import { support } from '../support';

const GeolocationPage = () => {
  const { position, isWatching, error, getCurrentPosition, startWatch, stopWatch } = useGeolocation();
  const c = position?.coords;

  return (
    <SensorPage path="/geolocation" description="Tu posición según el GPS. Usa seguimiento para ver cómo cambia mientras te mueves." error={error}>
      {support.needsHttps() && !error && (
        <Notice>El GPS solo funciona en páginas HTTPS. Corre "npm run phone" en el PC y abre la dirección https:// en el celular.</Notice>
      )}
      <div className="radar" aria-hidden="true">
        <div className={`radar__dot${c ? '' : ' is-idle'}`} />
        {c && <span className="radar__coords">±{c.accuracy.toFixed(0)} m</span>}
      </div>
      {isWatching && <p className="live" style={{ margin: '0 4px 12px' }}>Siguiendo tu posición</p>}

      <Readouts items={[
        ['Latitud', c?.latitude.toFixed(6)],
        ['Longitud', c?.longitude.toFixed(6)],
      ]} />
      <Readouts three items={[
        ['Altitud', c?.altitude != null ? `${c.altitude.toFixed(0)} m` : null],
        ['Velocidad', c?.speed != null ? `${(c.speed * 3.6).toFixed(1)} km/h` : null],
        ['Rumbo', c?.heading != null ? `${c.heading.toFixed(0)}°` : null],
      ]} />

      <IonButton className="btn" expand="block" onClick={getCurrentPosition}>Leer ubicación</IonButton>
      <IonButton className="btn-outline" expand="block" fill="outline" onClick={isWatching ? stopWatch : startWatch}>
        {isWatching ? 'Detener seguimiento' : 'Seguir mi posición'}
      </IonButton>
      {c && (
        <IonButton className="btn-outline" expand="block" fill="outline" target="_blank"
          href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}>
          Abrir en Google Maps
        </IonButton>
      )}
      {position && <BigReading label="Última lectura" value={new Date(position.timestamp).toLocaleTimeString()} />}
    </SensorPage>
  );
};

export default GeolocationPage;
