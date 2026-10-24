import { useState } from 'react';
import { IonAlert, IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import TabBar from '../components/TabBar';
import { MISSIONS, TOTAL_POINTS } from '../missions';

const Resultados = () => {
  const { logout } = useAuth();
  const { progress, completedCount, total, percent, isCompleted, photo, reset, distance, stillness } = useGame();
  const [confirm, setConfirm] = useState(false);

  const estado =
    completedCount === 0 ? { label: 'Sin empezar', cls: 'pending' }
    : completedCount === total ? { label: '¡Todas las misiones completadas!', cls: 'done' }
    : { label: `En progreso · falta${total - completedCount === 1 ? '' : 'n'} ${total - completedCount}`, cls: 'active' };

  const handleReset = async () => {
    distance.cancel();
    stillness.cancel();
    await reset();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="topbar"><span className="brand">RESULTADOS</span></div>
        <section className="results">
          <div className="results__total">
            <span className="eyebrow">Puntos totales</span>
            <strong>{progress.points}</strong>
            <span>de {TOTAL_POINTS} posibles</span>
          </div>

          <div className="results__grid">
            <div><strong>{completedCount}/{total}</strong><span>misiones completadas</span></div>
            <div><strong>{percent}%</strong><span>progreso</span></div>
          </div>

          <div className={`results__state badge--${estado.cls}`}>
            <span className="eyebrow">Estado general</span>
            <b>{estado.label}</b>
          </div>

          <ul className="checklist">
            {MISSIONS.map((m) => (
              <li key={m.id} className={isCompleted(m.id) ? 'done' : ''}>
                <IonIcon icon={isCompleted(m.id) ? checkmarkCircle : ellipseOutline} aria-hidden="true" />
                <span>{m.title}</span>
                <b>{isCompleted(m.id) ? `+${m.points}` : `${m.points}`} pts</b>
              </li>
            ))}
          </ul>

          {photo && <img className="evidence" src={photo} alt="Foto de evidencia" />}

          <IonButton className="btn-ghost" expand="block" onClick={() => setConfirm(true)}>Reiniciar progreso</IonButton>
          <IonButton className="btn-text" expand="block" fill="clear" onClick={() => logout()}>Cerrar sesión</IonButton>
        </section>
        <IonAlert
          isOpen={confirm}
          onDidDismiss={() => setConfirm(false)}
          header="¿Reiniciar?"
          message="Se borran tus misiones y puntos en el celular y en Firebase."
          buttons={[{ text: 'Cancelar', role: 'cancel' }, { text: 'Reiniciar', role: 'destructive', handler: () => void handleReset() }]}
        />
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Resultados;
