import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonToast,
} from '@ionic/react'

const USUARIOS = [{ username: 'medico', password: '1234' }]

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()

  function handleLogin() {
    const usuarioValido = USUARIOS.find(
      (u) => u.username === username && u.password === password
    )

    if (usuarioValido) {
      localStorage.setItem('mediclinic_ionic_session', JSON.stringify({ username }))
      navigate('/tabs/visitas')
    } else {
      setShowToast(true)
    }
  }

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <div className="login-wrap">
          <div className="login-card">
            <h1>MediClinic</h1>
            <p className="login-subtitle">Panel del médico — visitas del día</p>

            <IonItem lines="full">
              <IonInput
                label="Usuario"
                labelPlacement="floating"
                value={username}
                onIonInput={(e) => setUsername(e.detail.value)}
              />
            </IonItem>

            <IonItem lines="full" className="ion-margin-bottom">
              <IonInput
                label="Contraseña"
                labelPlacement="floating"
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value)}
              />
            </IonItem>

            <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
              Ingresar
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  )
}
