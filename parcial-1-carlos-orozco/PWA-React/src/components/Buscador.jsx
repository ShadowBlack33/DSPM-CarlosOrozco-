export default function Buscador({ value, onChange }) {
  return (
    <input
      placeholder="Buscar por nombre, apellido o CC..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
