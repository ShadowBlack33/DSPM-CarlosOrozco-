import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Buscador from '../components/Buscador'
import PacienteForm from '../components/PacienteForm'
import PacienteList from '../components/PacienteList'

const STORAGE_KEY = 'mediclinic_pacientes'

function cargarPacientes() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado ? JSON.parse(guardado) : []
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState(cargarPacientes)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes))
  }, [pacientes])

  function handleAdd(nuevoPaciente) {
    setPacientes((prev) => [...prev, { id: crypto.randomUUID(), ...nuevoPaciente }])
  }

  function handleDelete(id) {
    setPacientes((prev) => prev.filter((p) => p.id !== id))
  }

  function handleLogout() {
    localStorage.removeItem('mediclinic_session')
    navigate('/')
  }

  const termino = busqueda.trim().toLowerCase()
  const pacientesFiltrados = termino
    ? pacientes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.apellido.toLowerCase().includes(termino) ||
          p.cc.toLowerCase().includes(termino)
      )
    : pacientes

  return (
    <div>
      <header className="app-header">
        <h1>MediClinic — Pacientes</h1>
        <button className="secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <div className="page-content">
        <section className="card">
          <h2>Agregar paciente</h2>
          <PacienteForm onAdd={handleAdd} />
        </section>

        <section className="card">
          <h2>Listado ({pacientesFiltrados.length})</h2>
          <div className="buscador">
            <Buscador value={busqueda} onChange={setBusqueda} />
          </div>
          <PacienteList pacientes={pacientesFiltrados} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  )
}