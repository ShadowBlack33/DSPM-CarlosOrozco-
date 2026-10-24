<div align="center">

# Desarrollo de Software para Plataformas Móviles

**Universidad Autónoma de Occidente** · Carlos Andrés Orozco Caicedo

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_·_Firestore-FFCA28?logo=firebase&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)

</div>

---

Repositorio del curso **Desarrollo de Software para Plataformas Móviles (DSPM)**. Aquí están los challenges y parciales del semestre, construidos con React, Ionic, Capacitor y backends en la nube (Firebase y Supabase).

## Contenido

| Rama | Trabajo | Stack principal |
|---|---|---|
| [`challenge-1`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-1) | [Challenge 01 — Lista de contactos](#challenge-01--lista-de-contactos) | React + Vite |
| [`challenge-2`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-2) | [Challenge 02 — PWA](#challenge-02--pwa) | React + Service Worker |
| [`challenge-3`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-3) | [Challenge 03 — Task Manager](#challenge-03--task-manager) | Ionic |
| [`challenge-4`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-4) | [Challenge 04 — Login + Storage](#challenge-04--login--storage) | Ionic + localStorage |
| [`challenge-5`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-5) | [Challenge 05 — Tasks App + Firebase Auth](#challenge-05--tasks-app--firebase-auth) | Ionic + Firebase Auth + Context |
| [`challenge-6`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-6) | [Challenge 06 — Firebase + Realtime + Dexie + Network](#challenge-06--firebase--realtime--dexie--network) | Firestore, Realtime DB, Dexie |
| [`challenge-7`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-7) | [Challenge 07 — Sensores con Capacitor](#challenge-07--sensores-con-capacitor) | Capacitor (9 plugins) |
| [`challenge-8`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/challenge-8) | [Challenge 08 — Supabase](#challenge-08--supabase-auth-crud-realtime-y-storage) | Supabase + Camera |
| [`parcial-1-carlos-orozco`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/parcial-1-carlos-orozco) | [Parcial 1 — MediClinic](#parcial-1--mediclinic) | PWA React + Ionic React |
| [`parcial-2-carlos-orozco`](https://github.com/ShadowBlack33/DSPM-CarlosOrozco-/tree/parcial-2-carlos-orozco) | [Parcial 2 — Misiones](#parcial-2--misiones) | Ionic + Capacitor + Firebase |

## Tecnologías

| | |
|---|---|
| ⚛️ **React** | Componentes, hooks, Context API, `useReducer` |
| 🔷 **Ionic** | Componentes móviles, navegación y rutas protegidas |
| ⚡ **Capacitor** | Cámara, GPS, acelerómetro, vibración, notificaciones, red, archivos |
| 🌐 **PWA** | Service Workers, manifest, instalable |
| 🔥 **Firebase** | Auth, Firestore, Realtime Database |
| 🟢 **Supabase** | Auth, Postgres con RLS, Realtime, Storage |
| 💾 **Local** | localStorage y Dexie (IndexedDB) |

## Cómo abrir un trabajo

Cada trabajo vive en su propia rama y en su propia carpeta:

```bash
git checkout challenge-5      # o parcial-2-carlos-orozco, etc.
cd challenge-05               # la carpeta lleva el número con dos dígitos
npm install
npm run dev
```

Los proyectos con Firebase o Supabase traen un `.env.example`: cópialo como `.env` y completa las credenciales. Cada rama tiene su propio README con los detalles.

---

## Challenge 01 — Lista de contactos

App en **React + Vite** para listar, agregar y eliminar contactos.

- Loader inicial simulando la carga de datos (`setTimeout` en `useEffect`).
- Agregar contacto (nombre y teléfono) y eliminarlo.
- App dividida en componentes reutilizables.

## Challenge 02 — PWA

La app del Challenge 01 convertida en **Progressive Web App**.

- Manifest con ícono personalizado.
- Service Worker con estrategia híbrida de cacheo (Network First, Cache First, Stale While Revalidate).
- Instalable en el celular. Demo: <https://dspm-contactos-carlos.netlify.app>

## Challenge 03 — Task Manager

App en **Ionic** para gestionar tareas.

- Listar, agregar, completar y eliminar tareas.
- Componentes padre/hijo con estado compartido.

## Challenge 04 — Login + Storage

Demo de autenticación en **Ionic** con sesión persistente.

- Login con validación de credenciales.
- Token guardado en `localStorage`: si ya existe, se salta el login.
- Logout que limpia la sesión y vuelve al login.

## Challenge 05 — Tasks App + Firebase Auth

La Tasks App con **Login / Register / Logout en Firebase**.

- Rutas protegidas (`PrivateRoute` / `PublicRoute`).
- Un Context para la sesión y otro para las tareas, con custom hooks para la lógica de Firebase.
- Páginas de lista, agregar/editar y detalle; las tareas se guardan por usuario.

## Challenge 06 — Firebase + Realtime + Dexie + Network

App con login real que integra tres tipos de almacenamiento.

- **Contactos** en Firestore, **Tareas** en Realtime Database (se actualizan en vivo), **Frutas** en Dexie (IndexedDB) con favoritas, búsqueda y estadísticas.
- Detección de red con `@capacitor/network`: sin conexión se deshabilitan las acciones que requieren la nube.

## Challenge 07 — Sensores con Capacitor

Home con un botón por sensor y una página por cada uno, cada sensor con su propio custom hook.

- Geolocalización, cámara, acelerómetro, dispositivo, vibración, archivos, notificaciones locales, push y red.

## Challenge 08 — Supabase: Auth, CRUD, Realtime y Storage

App de tareas conectada a **Supabase**.

- Registro y login, CRUD con **Row Level Security**.
- Lista en vivo con Supabase Realtime.
- Fotos con la cámara subidas al bucket `avatars` (foto de perfil y foto por tarea).

## Parcial 1 — MediClinic

Dos apps **independientes** para una clínica, sin backend (todo en `localStorage`).

- **PWA React**: administración de pacientes (login, lista, formulario, búsqueda).
- **Ionic React** con pestañas: el médico consulta y actualiza sus visitas del día.

## Parcial 2 — Misiones

App en **Ionic + React + Capacitor + Firebase** donde usuarios reales completan misiones con sensores del celular y ganan puntos.

| Misión | Sensor | Puntos |
|---|---|---|
| Evidencia: tomar y guardar una foto | Camera | 50 |
| Movimiento real: alejarse 50 m del punto de partida | Geolocation | 70 |
| Permanencia activa: quedarse quieto 10 s y vibrar | Motion (acelerómetro) + Haptics | 80 |

- Login y registro con Firebase Auth.
- Puntos, barra de progreso y pantalla de resultados.
- Progreso guardado en Firestore y en `localStorage` (funciona sin internet).
- Notificaciones locales ("Has completado una misión", "Te falta 1 misión para completar").
- Ranking top 5 en vivo con usuarios reales.
- Probado en el navegador y en iPhone (Safari) por túnel de Cloudflare.
