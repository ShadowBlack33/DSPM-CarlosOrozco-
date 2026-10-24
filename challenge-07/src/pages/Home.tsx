import type { CSSProperties } from 'react';
import { IonContent, IonHeader, IonIcon, IonPage, IonToolbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { sensors } from '../sensors';
import useDevice from '../hooks/useDevice';

const Home = () => {
  const navigate = useNavigate();
  const { info } = useDevice();

  return (
    <IonPage>
      <IonHeader><IonToolbar /></IonHeader>
      <IonContent>
        <header className="home-head">
          <h1>Sensores</h1>
          <p>
            {info?.platform === 'web'
              ? 'Estás en el navegador: algunos sensores solo responden en el teléfono.'
              : info ? `${info.manufacturer} ${info.model}. Elige un sensor para probarlo.` : 'Elige un sensor para probarlo.'}
          </p>
        </header>
        <nav className="tiles" aria-label="Sensores">
          {sensors.map((s, i) => (
            <button
              key={s.path}
              className={`tile${i === sensors.length - 1 && sensors.length % 2 ? ' is-wide' : ''}`}
              style={{ '--sensor': s.color } as CSSProperties}
              onClick={() => navigate(s.path)}
            >
              <span className="tile__icon"><IonIcon icon={s.icon} aria-hidden="true" /></span>
              <div>
                <h2>{s.name}</h2>
                <span>{s.hint}</span>
              </div>
            </button>
          ))}
        </nav>
      </IonContent>
    </IonPage>
  );
};

export default Home;
