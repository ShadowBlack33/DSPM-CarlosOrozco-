import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import './ionic-css';
import './theme/variables.css';
import './theme/app.css';

import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import RootRedirect from './components/RootRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import TasksList from './pages/TasksList';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';

setupIonicReact({ mode: 'ios' });

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <TasksProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/tasks" element={<PrivateRoute><TasksList /></PrivateRoute>} />
              <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
              <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/" element={<RootRedirect to="/tasks" />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </TasksProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
