import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Pacientes from './pages/Pacientes'
import './index.css'

function haySesion() {
  return localStorage.getItem('mediclinic_session') !== null
}

function RutaProtegida({ children }) {
  return haySesion() ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={haySesion() ? <Navigate to="/pacientes" replace /> : <Login />}
        />
        <Route
          path="/pacientes"
          element={
            <RutaProtegida>
              <Pacientes />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
