import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';
import './ionic-css';
import './theme/variables.css';
import './theme/app.css';

import Home from './pages/Home';
import GeolocationPage from './pages/GeolocationPage';
import CameraPage from './pages/CameraPage';
import AccelerometerPage from './pages/AccelerometerPage';
import DevicePage from './pages/DevicePage';
import HapticsPage from './pages/HapticsPage';
import FilesystemPage from './pages/FilesystemPage';
import LocalNotificationsPage from './pages/LocalNotificationsPage';
import PushNotificationsPage from './pages/PushNotificationsPage';
import NetworkPage from './pages/NetworkPage';

setupIonicReact({ mode: 'ios' });

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" element={<Home />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/accelerometer" element={<AccelerometerPage />} />
          <Route path="/device" element={<DevicePage />} />
          <Route path="/haptics" element={<HapticsPage />} />
          <Route path="/filesystem" element={<FilesystemPage />} />
          <Route path="/local-notifications" element={<LocalNotificationsPage />} />
          <Route path="/push-notifications" element={<PushNotificationsPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
