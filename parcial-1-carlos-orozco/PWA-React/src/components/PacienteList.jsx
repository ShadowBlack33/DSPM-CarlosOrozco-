export default function PacienteList({ pacientes, onDelete }) {
  if (pacientes.length === 0) {
    return <p className="empty-state">No hay pacientes para mostrar.</p>
  }

  return (
    <table className="paciente-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>CC</th>
          <th>Teléfono</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((p) => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>{p.apellido}</td>
            <td>{p.cc}</td>
            <td>{p.telefono}</td>
            <td>
              <button className="secondary" onClick={() => onDelete(p.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}