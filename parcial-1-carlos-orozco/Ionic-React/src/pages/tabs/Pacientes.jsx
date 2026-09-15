import { useEffect, useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

// Ojo: esta lista es propia de la app Ionic, NO se comparte con la PWA
// (cada app usa su propia key de localStorage).
const STORAGE_KEY = 'mediclinic_ionic_pacientes'

const PACIENTES_INICIALES = [
  { id: '1', nombre: 'Luisa Fernanda Campo', cc: '1002345678' },
  { id: '2', nombre: 'Ricardo Peña Salazar', cc: '1098765432' },
  { id: '3', nombre: 'Marcela Idrobo', cc: '1055512345' },
]

function cargarPacientes() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) return JSON.parse(guardado)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(PACIENTES_INICIALES))
  return PACIENTES_INICIALES
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    setPacientes(cargarPacientes())
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pacientes.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>{p.nombre}</h2>
                <p>CC {p.cc}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
