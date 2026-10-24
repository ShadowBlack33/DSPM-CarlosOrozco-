<div align="center">

# Challenge 05 — Tasks App + Firebase Auth

![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)
![Context API](https://img.shields.io/badge/Context_API-+_Custom_Hooks-0f766e)

</div>

---

Transformación de la Tasks App (Challenge 03) para agregar **Login / Register / Logout con Firebase**, rutas protegidas, **Context API** y **custom hooks**.

## Requisitos del challenge

| Requisito | Dónde está |
|---|---|
| Login – Register – Logout con Firebase | `hooks/useFirebaseAuth.ts`, `pages/Login.tsx`, `pages/Register.tsx` |
| Páginas: Login, Register, Lista, Agregar/Editar, Detalle | `App.tsx` (rutas) + `pages/` |
| Un context para manejar las tareas entre páginas | `context/TasksContext.tsx` |
| Otro context para login y registro | `context/AuthContext.tsx` |
| Custom hooks para la lógica de Firebase | `hooks/useFirebaseAuth.ts` (+ `useLocalStorage.ts`) |

## Rutas

| Ruta | Página | Protegida |
|---|---|---|
| `/login` | Iniciar sesión | No |
| `/register` | Crear cuenta | No |
| `/tasks` | Lista de tareas (pendientes / completadas) | Sí |
| `/tasks/new` | Agregar tarea | Sí |
| `/tasks/:id` | Detalle de la tarea | Sí |
| `/tasks/:id/edit` | Editar tarea | Sí |

- Si no hay sesión, `PrivateRoute` redirige a `/login`.
- Si ya hay sesión, `PublicRoute` salta el login y va a `/tasks`.
- Las tareas se guardan por usuario (`tasks_{uid}` en localStorage): cada cuenta ve solo las suyas.

## Configurar Firebase

1. Entra a <https://console.firebase.google.com/> y crea un proyecto.
2. **Authentication → Comenzar → Correo electrónico/contraseña → Habilitar**.
3. **Configuración del proyecto → General → Tus apps → Web (`</>`)**: registra la app y copia el objeto `firebaseConfig`.
4. Copia `.env.example` como `.env` y pega los valores:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> El archivo `.env` está en `.gitignore`, así que las llaves no se suben a GitHub.

## Cómo correrla

```bash
npm install
npm run dev
```

## Estructura

```text
src/
├── firebase/config.ts        → initializeApp + getAuth
├── hooks/
│   ├── useFirebaseAuth.ts    → login, register, logout, onAuthStateChanged
│   └── useLocalStorage.ts    → persistencia por usuario
├── context/
│   ├── AuthContext.tsx       → usuario + funciones de auth
│   └── TasksContext.tsx      → CRUD de tareas compartido entre páginas
├── components/
│   ├── AuthForm.tsx          → formulario de login/registro
│   ├── PrivateRoute.tsx / PublicRoute.tsx
│   └── TaskItem.tsx
└── pages/
    ├── Login.tsx  Register.tsx
    ├── TasksList.tsx  TaskForm.tsx  TaskDetail.tsx
```
