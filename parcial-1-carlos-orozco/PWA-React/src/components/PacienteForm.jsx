import { useState } from 'react'

const CAMPOS_VACIOS = { nombre: '', apellido: '', cc: '', telefono: '' }

export default function PacienteForm({ onAdd }) {
  const [form, setForm] = useState(CAMPOS_VACIOS)
  const [errores, setErrores] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validar() {
    const nuevosErrores = {}
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!form.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio'
    if (!form.cc.trim()) {
      nuevosErrores.cc = 'La CC es obligatoria'
    } else if (!/^\d+$/.test(form.cc.trim())) {
      nuevosErrores.cc = 'La CC solo debe contener números'
    } else if (form.cc.trim().length < 6 || form.cc.trim().length > 10) {
      nuevosErrores.cc = 'La CC debe tener entre 6 y 10 números'
    }

    if (form.telefono.trim()) {
      if (!/^\d+$/.test(form.telefono.trim())) {
        nuevosErrores.telefono = 'El teléfono solo debe contener números'
      } else if (form.telefono.trim().length < 6 || form.telefono.trim().length > 10) {
        nuevosErrores.telefono = 'El teléfono debe tener entre 6 y 10 números'
      }
    }
    return nuevosErrores
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    onAdd(form)
    setForm(CAMPOS_VACIOS)
    setErrores({})
  }

  return (
    <form className="paciente-form" onSubmit={handleSubmit}>
      <div className="field">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        {errores.nombre && <p className="field-error">{errores.nombre}</p>}
      </div>

      <div className="field">
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
        {errores.apellido && <p className="field-error">{errores.apellido}</p>}
      </div>

      <div className="field">
        <input name="cc" placeholder="Cédula" value={form.cc} onChange={handleChange} />
        {errores.cc && <p className="field-error">{errores.cc}</p>}
      </div>

      <div className="field">
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        {errores.telefono && <p className="field-error">{errores.telefono}</p>}
      </div>

      <button type="submit">Agregar paciente</button>
    </form>
  )
}