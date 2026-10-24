import { useState } from 'react';
import { IonButton, IonInput, IonRange } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { Readouts } from '../components/Readouts';
import useLocalNotifications from '../hooks/useLocalNotifications';
import Notice from '../components/Notice';
import { support } from '../support';

const permLabel: Record<string, string> = { granted: 'Permitido', denied: 'Bloqueado', prompt: 'Sin pedir', 'prompt-with-rationale': 'Sin pedir' };

const LocalNotificationsPage = () => {
  const { permission, pending, lastAction, error, requestPermission, schedule, cancelAll } = useLocalNotifications();
  const [title, setTitle] = useState('Recordatorio');
  const [body, setBody] = useState('Revisa el challenge 07');
  const [seconds, setSeconds] = useState(5);

  return (
    <SensorPage path="/local-notifications" description="Programa un recordatorio en el teléfono, sin servidor de por medio." error={error}>
      {!support.notifications && (
        <Notice>
          {support.isIOS
            ? 'En iPhone, Safari solo permite notificaciones si agregas la página a la pantalla de inicio (Compartir › Agregar a inicio). En la app nativa funcionan siempre.'
            : 'Este navegador no ofrece notificaciones. Pruébalas en la app nativa.'}
        </Notice>
      )}
      <Readouts items={[['Permiso', permLabel[permission] ?? permission], ['Última', lastAction]]} />
      <div className="field">
        <label htmlFor="ln-title">Título</label>
        <IonInput id="ln-title" value={title} onIonInput={(e) => setTitle(e.detail.value ?? '')} />
      </div>
      <div className="field">
        <label htmlFor="ln-body">Mensaje</label>
        <IonInput id="ln-body" value={body} onIonInput={(e) => setBody(e.detail.value ?? '')} />
      </div>
      <div className="field">
        <label htmlFor="ln-sec">Llega en <span className="num">{seconds}</span> segundos</label>
        <IonRange id="ln-sec" aria-label="Segundos" min={1} max={60} value={seconds} onIonInput={(e) => setSeconds(Number(e.detail.value))} />
      </div>
      {permission !== 'granted' && (
        <IonButton className="btn-outline" fill="outline" expand="block" onClick={requestPermission}>Pedir permiso</IonButton>
      )}
      <IonButton className="btn" expand="block" onClick={() => schedule(title, body, seconds)}>Programar recordatorio</IonButton>

      <h2 className="section-title">Programados ({pending.length})</h2>
      <div className="log">
        {pending.length === 0 && <div className="log__empty">No hay recordatorios pendientes.</div>}
        {pending.map((n) => (
          <div className="log__item" key={n.id}>
            <span>{n.title}</span>
            <small>{n.schedule?.at && new Date(n.schedule.at).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      {pending.length > 0 && (
        <IonButton className="btn-danger" expand="block" style={{ marginTop: 12 }} onClick={cancelAll}>Cancelar todos</IonButton>
      )}
    </SensorPage>
  );
};

export default LocalNotificationsPage;
