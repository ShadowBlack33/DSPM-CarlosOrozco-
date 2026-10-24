import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { Readouts } from '../components/Readouts';
import usePushNotifications from '../hooks/usePushNotifications';
import Notice from '../components/Notice';

const PushNotificationsPage = () => {
  const { isNative, token, notifications, error, register } = usePushNotifications();

  return (
    <SensorPage
      path="/push-notifications"
      description="Registra el teléfono en Firebase Cloud Messaging y recibe mensajes enviados desde la consola."
      error={isNative ? error : null}
    >
      {!isNative && (
        <Notice>
          Las push notifications necesitan la app nativa con Firebase Cloud Messaging. En el navegador puedes ver la pantalla,
          pero el registro solo funciona instalando la app (ver README).
        </Notice>
      )}
      <Readouts items={[['Plataforma', isNative ? 'Nativa' : 'Navegador'], ['Estado', token ? 'Registrado' : 'Sin registrar']]} />
      <IonButton className="btn" expand="block" onClick={register}>Registrar este teléfono</IonButton>

      {token && (
        <div className="big">
          <div className="big__label">Token FCM. Pégalo en Firebase › Messaging › Enviar mensaje de prueba.</div>
          <div className="token">{token}</div>
        </div>
      )}

      <h2 className="section-title">Recibidas ({notifications.length})</h2>
      <div className="log">
        {notifications.length === 0 && <div className="log__empty">Las notificaciones que lleguen aparecen aquí.</div>}
        {notifications.map((n, i) => (
          <div className="log__item" key={n.id ?? i}>
            <span><strong>{n.title}</strong><br /><small>{n.body}</small></span>
          </div>
        ))}
      </div>
    </SensorPage>
  );
};

export default PushNotificationsPage;
