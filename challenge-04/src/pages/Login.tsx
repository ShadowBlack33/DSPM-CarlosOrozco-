import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'user@mail.com' && password === '123') {
      localStorage.setItem('logged', 'true');
      navigate('/list');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="auth-bg">
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-icon">
              <IonIcon icon={lockClosedOutline} />
            </div>
            <h1 className="auth-title">Bienvenido</h1>
            <p className="auth-subtitle">Inicia sesión para continuar</p>

            <IonItem className="auth-input" lines="none">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
              />
            </IonItem>

            <IonItem className="auth-input" lines="none">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                placeholder="••••••"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value ?? '')}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="auth-error">{error}</p>
              </IonText>
            )}

            <IonButton expand="block" className="auth-button" onClick={handleLogin}>
              Iniciar sesión
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Login;
