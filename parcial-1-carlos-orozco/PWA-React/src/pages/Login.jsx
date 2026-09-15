import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const USUARIOS = [
  { username: 'admin', password: '1234' },
  { username: 'doctor', password: 'clinica2024' },
]

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    const usuarioValido = USUARIOS.find(
      (u) => u.username === username && u.password === password
    )

    if (usuarioValido) {
      setError('')
      localStorage.setItem('mediclinic_session', JSON.stringify({ username }))
      navigate('/pacientes')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>MediClinic</h1>
        <p className="login-subtitle">Administración de pacientes</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}
