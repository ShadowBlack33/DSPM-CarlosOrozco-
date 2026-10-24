import { IonFooter, IonIcon, useIonRouter } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { flag, podium, ribbon } from 'ionicons/icons';

const TABS = [
  { path: '/misiones', label: 'Misiones', icon: flag },
  { path: '/ranking', label: 'Ranking', icon: podium },
  { path: '/resultados', label: 'Resultados', icon: ribbon },
];

// Barra inferior propia: cambia de página sin animación y sin apilar historial
const TabBar = () => {
  const router = useIonRouter();
  const { pathname } = useLocation();

  return (
    <IonFooter className="tabbar">
      <nav>
        {TABS.map((t) => (
          <button key={t.path} type="button" aria-current={pathname === t.path ? 'page' : undefined}
            onClick={() => pathname !== t.path && router.push(t.path, 'none', 'replace')}>
            <IonIcon icon={t.icon} aria-hidden="true" />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </IonFooter>
  );
};

export default TabBar;
