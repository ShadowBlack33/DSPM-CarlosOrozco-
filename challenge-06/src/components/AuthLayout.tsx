import type { ReactNode } from 'react';
import { IonBackButton, IonContent, IonPage } from '@ionic/react';

interface Props { title: ReactNode; subtitle: string; back?: boolean; children: ReactNode }

const AuthLayout = ({ title, subtitle, back, children }: Props) => (
  <IonPage>
    <IonContent fullscreen>
      <div className="auth">
        <header className="auth__hero">
          {back && <IonBackButton className="auth__back" defaultHref="/login" text="" color="light" />}
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        <section className="auth__sheet">{children}</section>
      </div>
    </IonContent>
  </IonPage>
);

export default AuthLayout;
