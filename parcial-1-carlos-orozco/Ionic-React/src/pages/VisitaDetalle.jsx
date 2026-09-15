import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IonBackButton,
  IonButton,
  IonButtons,
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

// Orden de avance del estado. finalizada no tiene siguiente.
const SIGUIENTE_ESTADO = {
  pendiente: 'en_camino',
  en_camino: 'finalizada',
  finalizada: null,
}

const ETIQUETA_ESTADO = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  finalizada: 'Finalizada',
}

function cargarVisitas() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado ? JSON.parse(guardado) : []
}

export default function VisitaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [visita, setVisita] = useState(null)

  useEffect(() => {
    const visitas = cargarVisitas()
    setVisita(visitas.find((v) => v.id === id) ?? null)
  }, [id])

  function avanzarEstado() {
    const siguiente = SIGUIENTE_ESTADO[visita.estado]
    if (!siguiente) return

    const visitas = cargarVisitas()
    const actualizadas = visitas.map((v) =>
      v.id === id ? { ...v, estado: siguiente } : v
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas))
    setVisita({ ...visita, estado: siguiente })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/visitas" />
          </IonButtons>
          <IonTitle>Detalle de visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!visita ? (
          <p>Visita no encontrada.</p>
        ) : (
          <>
            <IonList>
              <IonItem>
                <IonLabel>Paciente</IonLabel>
                <IonLabel slot="end">{visita.paciente}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Hora</IonLabel>
                <IonLabel slot="end">{visita.hora}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Estado</IonLabel>
                <IonLabel slot="end">{ETIQUETA_ESTADO[visita.estado]}</IonLabel>
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              className="ion-margin-top"
              disabled={!SIGUIENTE_ESTADO[visita.estado]}
              onClick={avanzarEstado}
            >
              {SIGUIENTE_ESTADO[visita.estado]
                ? `Marcar como "${ETIQUETA_ESTADO[SIGUIENTE_ESTADO[visita.estado]]}"`
                : 'Visita finalizada'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
