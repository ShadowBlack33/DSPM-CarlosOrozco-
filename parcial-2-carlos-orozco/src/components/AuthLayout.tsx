import type { ReactNode } from 'react';
import { IonContent, IonPage } from '@ionic/react';

interface Props { title: ReactNode; subtitle: string; children: ReactNode }

const AuthLayout = ({ title, subtitle, children }: Props) => (
  <IonPage>
    <IonContent fullscreen>
      <div className="auth">
        <header className="auth__hero">
          <span className="eyebrow">Parcial 2 · Misiones</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="auth__badges" aria-hidden="true">
            <span>01</span><span>02</span><span>03</span>
          </div>
        </header>
        <section className="auth__sheet">{children}</section>
      </div>
    </IonContent>
  </IonPage>
);

export default AuthLayout;
