import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IonBadge,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

const STORAGE_KEY = 'mediclinic_visitas'

const VISITAS_INICIALES = [
  { id: '1', paciente: 'Luisa Fernanda Campo', hora: '09:00', estado: 'pendiente' },
  { id: '2', paciente: 'Ricardo Peña Salazar', hora: '10:30', estado: 'en_camino' },
  { id: '3', paciente: 'Marcela Idrobo', hora: '11:15', estado: 'finalizada' },
]

function cargarVisitas() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) return JSON.parse(guardado)
  // primera vez: sembramos datos de ejemplo para el día
  localStorage.setItem(STORAGE_KEY, JSON.stringify(VISITAS_INICIALES))
  return VISITAS_INICIALES
}

const COLOR_ESTADO = {
  pendiente: 'medium',
  en_camino: 'warning',
  finalizada: 'success',
}

export default function Visitas() {
  const [visitas, setVisitas] = useState([])
  const navigate = useNavigate()

  // Releemos del localStorage cada vez que se entra a la pestaña,
  // por si el estado cambió en el detalle de una visita
  useEffect(() => {
    setVisitas(cargarVisitas())
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {visitas.map((v) => (
            <IonItem
              key={v.id}
              button
              onClick={() => navigate(`/tabs/visitas/${v.id}`)}
            >
              <IonLabel>
                <h2>{v.paciente}</h2>
                <p>{v.hora}</p>
              </IonLabel>
              <IonBadge color={COLOR_ESTADO[v.estado]}>{v.estado}</IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
