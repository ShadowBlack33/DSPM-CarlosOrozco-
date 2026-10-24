<div align="center">

# Challenge 06 — Firebase + Realtime + Dexie + Network

![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![Firebase](https://img.shields.io/badge/Firestore_+_Realtime_DB-FFCA28?logo=firebase&logoColor=black)
![Dexie](https://img.shields.io/badge/Dexie-IndexedDB-1f6feb)
![Capacitor](https://img.shields.io/badge/@capacitor/network-119EFF?logo=capacitor&logoColor=white)

</div>

---

App en Ionic con **login real (Firebase Auth)** y rutas protegidas que integra los tres tipos de almacenamiento vistos en clase:

| Módulo | Almacenamiento | Hook |
|---|---|---|
| **Contactos** | Firebase **Firestore** (colección `contactos`) | `useCollection` |
| **Tareas** | Firebase **Realtime Database** (`tareas/{uid}`) | `useRealTimeCollection` |
| **Frutas** | **Dexie** (IndexedDB local, `MiAppDB`) | `useDexie` |
| Estado de red | `@capacitor/network` | `useNetwork` |

## Funcionalidades

- Login / Register / Logout con Firebase Auth; rutas privadas (`/home`, `/contacts`, `/tasks`, `/fruits`).
- **Contactos**: CRUD en Firestore, filtrado por usuario con `getAll([["userId", "==", uid]])`, pull-to-refresh.
- **Tareas**: CRUD en Realtime Database; la lista se actualiza sola con `onValue` (ábrela en dos pestañas para verlo).
- **Frutas (newFunction)**: CRUD local en Dexie con `useLiveQuery`, y como funciones nuevas:
  - Marcar / desmarcar **favoritas** (`toggleFavorite`) y filtrar por favoritas.
  - **Búsqueda** por nombre o proveedor (filtro pasado al hook).
  - **Estadísticas en vivo**: total, favoritas y precio promedio.
  - Versionado de la BD (v1 → v2 → v3) agregando campos `proveedor`, `fechaCosecha`, `precio`, `favorita`.
- **Validación de red**: sin conexión, los botones de crear / editar / eliminar de **Contactos y Tareas se deshabilitan** y aparece un aviso rojo. Frutas sigue funcionando porque es local.

Para probarlo: DevTools → Network → **Offline** (o modo avión en el celular).

## Configurar Firebase

1. Crea un proyecto en <https://console.firebase.google.com/>.
2. **Authentication** → habilita **Correo electrónico/contraseña**.
3. **Firestore Database** → Crear base de datos → modo de prueba.
4. **Realtime Database** → Crear base de datos → modo de prueba. Copia la URL (`https://<proyecto>-default-rtdb.firebaseio.com`).
5. **Configuración del proyecto → Tus apps → Web** y copia la config.
6. Copia `.env.example` como `.env` y completa los valores (incluye `VITE_FIREBASE_DATABASE_URL`).

Reglas recomendadas para que cada usuario solo vea lo suyo:

**Firestore**
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactos/{id} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

**Realtime Database**
```json
{
  "rules": {
    "tareas": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

## Diseño

**"Tres almacenes"**: cada módulo tiene su color según dónde se guardan sus datos.

| Color | Módulo | Almacenamiento |
|---|---|---|
| Ámbar | Contactos | Firestore |
| Verde azulado | Tareas | Realtime Database |
| Frambuesa | Frutas | Dexie (local) |

- Tipografías: *Sora* para títulos y *Figtree* para el texto.
- Sin red, los módulos de la nube se ven grises con rayas y dicen "Solo lectura sin red"; Frutas sigue en color porque funciona sin internet.
- La píldora de red en la barra superior muestra Wi‑Fi, datos móviles o sin conexión.
- Redirecciones con `useRedirectOnce` (mismo arreglo que el challenge 05).

## Cómo correrla

```bash
npm install
npm run dev
```

## Estructura

```text
src/
├── firebase/config.ts           → getAuth, getFirestore, getDatabase
├── db/dexie.ts                  → MiAppDB con versiones 1, 2 y 3
├── hooks/
│   ├── useFirebaseAuth.ts
│   ├── useCollection.ts         → Firestore: getAll(filters), add, update, remove
│   ├── useRealTimeCollection.ts → Realtime DB: onValue, add (push), update, setItem, deleteItem
│   ├── useDexie.ts              → useLiveQuery, add, update, deleteItem, toggleFavorite, stats
│   └── useNetwork.ts            → Network.getStatus + networkStatusChange
├── context/  AuthContext.tsx  NetworkContext.tsx
├── components/ NetworkBanner.tsx  PageHeader.tsx  AuthForm.tsx  PrivateRoute.tsx  PublicRoute.tsx
└── pages/ Login  Register  Home  Contacts  Tasks  Fruits
```
