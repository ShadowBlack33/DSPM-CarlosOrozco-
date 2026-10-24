import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import './ionic-css';
import './theme/app.css';

import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import RootRedirect from './components/RootRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Misiones from './pages/Misiones';
import Ranking from './pages/Ranking';
import Resultados from './pages/Resultados';

setupIonicReact({ mode: 'ios' });

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <GameProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/misiones" element={<PrivateRoute><Misiones /></PrivateRoute>} />
              <Route path="/ranking" element={<PrivateRoute><Ranking /></PrivateRoute>} />
              <Route path="/resultados" element={<PrivateRoute><Resultados /></PrivateRoute>} />
              <Route path="/" element={<RootRedirect to="/misiones" />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </GameProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
