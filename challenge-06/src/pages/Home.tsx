import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { checkboxOutline, nutritionOutline, peopleOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { NetPill } from '../components/NetworkBanner';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../context/NetworkContext';

const modules = [
  { path: '/contacts', cls: 'mod-contacts', title: 'Contactos', store: 'Guardados en Firestore', icon: peopleOutline, cloud: true },
  { path: '/tasks', cls: 'mod-tasks', title: 'Tareas', store: 'Sincronizadas en tiempo real', icon: checkboxOutline, cloud: true },
  { path: '/fruits', cls: 'mod-fruits', title: 'Frutas', store: 'Guardadas en este dispositivo', icon: nutritionOutline, cloud: false },
];

const Home = () => {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const navigate = useNavigate();

  return (
    <IonPage>
      <PageHeader back={false} />
      <IonContent>
        <div className="home-head">
          <p>Hola, {user?.email?.split('@')[0]}</p>
          <h1>¿Qué quieres revisar?</h1>
          <NetPill />
        </div>
        <div className="stores">
          {modules.map((m) => {
            const off = m.cloud && !isOnline;
            return (
              <button key={m.path} className={`store ${m.cls}${off ? ' is-off' : ''}`} onClick={() => navigate(m.path)}>
                <h2>{m.title}</h2>
                <p>{m.store}</p>
                <span className="store__tag">
                  {m.cloud ? (isOnline ? 'Puedes editar' : 'Solo lectura sin red') : 'Funciona sin internet'}
                </span>
                <IonIcon className="store__icon" icon={m.icon} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
