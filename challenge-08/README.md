<div align="center">

# Challenge 08 — Supabase: Auth, CRUD, Realtime y Storage

![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_RLS-3ECF8E?logo=supabase&logoColor=white)
![Capacitor](https://img.shields.io/badge/@capacitor/camera-119EFF?logo=capacitor&logoColor=white)

</div>

---

App de tareas en Ionic conectada a **Supabase**: registro, login, CRUD con **RLS**, **lista en vivo con Realtime** y **fotos con la cámara** subidas al bucket `avatars`.

## Requisitos del challenge

| Requisito | Implementación |
|---|---|
| Proyecto, tabla `tareas` con RLS y bucket `avatars` | `supabase/schema.sql` |
| Registro y login | `hooks/useSupabaseAuth.ts` (`signUp`, `signInWithPassword`, `signOut`) |
| CRUD | `hooks/useTareas.ts` (`select`, `insert`, `update`, `delete`) |
| Lista en vivo | `useTareas.ts` → `supabase.channel(...).on('postgres_changes', ...)` |
| Componentes Ionic | `IonModal`, `IonItemSliding`, `IonSegment`, `IonFab`, `IonRefresher`, `IonAvatar`… |
| Foto con la cámara | `hooks/useCamera.ts` + `hooks/useStorage.ts` (foto de perfil y foto por tarea) |

## Funcionalidades

- Registro con nombre (guardado en los metadatos del usuario) y login con email y contraseña.
- Lista de tareas con filtros Todas / Pendientes / Hechas, completar con checkbox, deslizar para editar o borrar.
- Crear y editar en un modal, con **foto opcional** tomada con la cámara.
- **Perfil**: tomar foto o elegirla de la galería → se sube a `avatars/{uid}/...` → la URL se guarda en `user_metadata.avatar_url` y aparece en la barra superior.
- **Realtime**: abre la app en dos pestañas con el mismo usuario; lo que hagas en una aparece en la otra.

## Configurar Supabase

1. En <https://supabase.com> → **New project** (región South America – São Paulo).
2. **SQL Editor → New query** → pega y ejecuta todo `supabase/schema.sql`. Esto crea:
   - la tabla `tareas` con RLS (cada usuario solo ve y modifica lo suyo),
   - Realtime habilitado en la tabla,
   - el bucket público `avatars` con políticas para que cada usuario escriba solo en su carpeta.
3. **Authentication → Sign In / Providers → Email**: para desarrollo puedes desactivar **Confirm email**.
4. **Authentication → URL Configuration**: Site URL = `http://localhost:5173`.
5. **Project Settings → API Keys**: copia la Project URL y la **publishable key** (nunca la secret / service_role).
6. Copia `.env.example` como `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_KEY=sb_publishable_xxxxxxxx
```

## Diseño

**"Tareas con foto"**: la foto es la protagonista.

- Tipografía: *Manrope*. Color de acción violeta.
- Las tarjetas crecen cuando la tarea tiene foto; al completarla, la foto se vuelve gris.
- El indicador verde **En vivo** late para mostrar que la lista está suscrita a Supabase Realtime.
- El perfil tiene la cámara sobre el avatar para cambiar la foto de un toque.
- Las tareas creadas o editadas se reflejan al instante aunque Realtime no esté activado (se usa la fila que devuelve `insert().select()`).

## Cómo correrla

```bash
npm install
npm run dev
```

En el navegador la cámara funciona gracias a `@ionic/pwa-elements`. Para Android:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## Estructura

```text
supabase/schema.sql          → tabla, RLS, realtime, bucket y políticas
src/
├── lib/supabase.ts          → createClient (una sola instancia)
├── hooks/
│   ├── useSupabaseAuth.ts   → sesión, login, registro, logout, metadatos
│   ├── useTareas.ts         → CRUD + suscripción Realtime
│   ├── useCamera.ts         → Camera.getPhoto → Blob
│   └── useStorage.ts        → upload + getPublicUrl en "avatars"
├── context/AuthContext.tsx
├── components/ AuthForm  TareaModal  Avatar  PrivateRoute  PublicRoute
└── pages/ Login  Register  Tareas  Perfil
```
