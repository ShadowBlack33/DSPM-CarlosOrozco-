import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import './ionic-css';
import './theme/variables.css';
import './theme/app.css';

import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import RootRedirect from './components/RootRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Fruits from './pages/Fruits';

setupIonicReact({ mode: 'ios' });

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <NetworkProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/fruits" element={<PrivateRoute><Fruits /></PrivateRoute>} />
              <Route path="/" element={<RootRedirect to="/home" />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </NetworkProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
