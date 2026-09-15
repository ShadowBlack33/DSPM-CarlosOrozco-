import { Navigate, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { calendarOutline, peopleOutline, personOutline } from 'ionicons/icons'

import Login from './pages/Login'
import Visitas from './pages/tabs/Visitas'
import Pacientes from './pages/tabs/Pacientes'
import Perfil from './pages/tabs/Perfil'
import VisitaDetalle from './pages/VisitaDetalle'

setupIonicReact()

function haySesion() {
  return localStorage.getItem('mediclinic_ionic_session') !== null
}

// Componente (no un ternario suelto): así vuelve a chequear haySesion()
// cada vez que la ruta hace match, no solo cuando App se monta la primera vez.
function RutaProtegida({ children }) {
  return haySesion() ? children : <Navigate to="/login" replace />
}

function RutaSoloInvitado({ children }) {
  return haySesion() ? <Navigate to="/tabs/visitas" replace /> : children
}

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/login"
            element={
              <RutaSoloInvitado>
                <Login />
              </RutaSoloInvitado>
            }
          />
          <Route
            path="/tabs/*"
            element={
              <RutaProtegida>
                <MainTabs />
              </RutaProtegida>
            }
          />
          <Route exact path="/" element={<Navigate to="/tabs/visitas" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="visitas" element={<Visitas />} />
        <Route exact path="visitas/:id" element={<VisitaDetalle />} />
        <Route exact path="pacientes" element={<Pacientes />} />
        <Route exact path="perfil" element={<Perfil />} />
        <Route exact path="" element={<Navigate to="/tabs/visitas" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Visitas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

export default App
