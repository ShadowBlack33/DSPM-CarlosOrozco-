<div align="center">

# Retos 1 a 4 — Desarrollo de Software para Plataformas Móviles

**DSPM** · Carlos Orozco

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Service_Worker-5A0FC8?logo=pwa&logoColor=white)

</div>

---

Cuatro challenges **individuales** del curso DSPM: desde un CRUD básico en React hasta una app Ionic con sesión persistente. Cada challenge vive en su propia rama, construido sobre los conceptos del challenge anterior cuando aplica.

| | Challenge 01 | Challenge 02 | Challenge 03 | Challenge 04 |
|---|---|---|---|---|
| **Rama** | `challenge-1` | `challenge-2` | `challenge-3` | `challenge-4` |
| **Propósito** | Lista de contactos | PWA instalable | Gestor de tareas | Login con sesión |
| **Stack** | React + Vite | React + Service Worker | Ionic | Ionic + localStorage |

## Contenido

- [Estructura de ramas](#estructura-de-ramas)
- [Challenge 01 — Lista de contactos](#challenge-01--lista-de-contactos)
- [Challenge 02 — PWA](#challenge-02--pwa)
- [Challenge 03 — Task Manager](#challenge-03--task-manager)
- [Challenge 04 — Login + Storage](#challenge-04--login--storage)
- [Flujo de ramas por challenge](#flujo-de-ramas-por-challenge)
- [Antes de subir](#antes-de-subir)

## Estructura de ramas

```text
main               → Este README
challenge-1        → Challenge 01 — Lista de contactos (React)
challenge-2        → Challenge 02 — PWA (React + Service Worker)
challenge-3        → Challenge 03 — Task Manager (Ionic)
challenge-4        → Challenge 04 — Login + Storage (Ionic)
```

---

## Challenge 01 — Lista de contactos

App en **React + Vite** para listar, agregar y eliminar contactos.

### Funcionalidades

- Loader al iniciar, simulando una carga inicial de datos.
- Carga de una lista inicial de contactos.
- Agregar contacto con nombre y teléfono.
- Eliminar contacto desde el listado.
- App dividida en componentes: `Loader`, `ContactList`, `ContactItem`, `AddContactForm`.

### Cómo correrla

```bash
cd challenge-1
npm install
npm run dev
```

---

## Challenge 02 — PWA

La misma app del Challenge 01, convertida en **Progressive Web App**.

### Funcionalidades

- Imagen agregada al componente padre.
- Manifest con ícono personalizado.
- Service Worker con estrategia híbrida: Network First (HTML/API), Cache First (JS/CSS), Cache First + Stale While Revalidate (imágenes).
- Desplegada en Netlify e instalable desde el celular.

### Cómo correrla

```bash
cd challenge-2
npm install
npm run build
```

**Demo:** _(link de Netlify pendiente)_

---

## Challenge 03 — Task Manager

App en **Ionic** para gestionar tareas.

### Funcionalidades

- Estado y efectos para la carga inicial de tareas.
- 3+ componentes padre/hijo: `TaskManager` → `TaskList` → `TaskItem`, más `AddTaskForm`.
- Ver, agregar, completar y eliminar tareas.

### Cómo correrla

```bash
cd challenge-3
npm install
ionic serve
```

---

## Challenge 04 — Login + Storage

Demo de **Login en Ionic** con sesión persistida en `localStorage`.

### Funcionalidades

- Login con Email y Password, validado contra credenciales fijas.
- Al iniciar sesión guarda un token y redirige a la lista.
- Si el token ya existe al reabrir la app, salta el login automáticamente.
- Botón de Logout que limpia el token y regresa al login.

### Credenciales

| Usuario | Contraseña |
|---|---|
| `user@mail.com` | `123` |

### Cómo correrla

```bash
cd challenge-4
npm install
ionic serve
```

---

## Flujo de ramas por challenge

```bash
git checkout main
git checkout -b challenge-1
# crea el proyecto (npm create vite@latest / ionic start ...)
# copia los archivos de la carpeta challenge-01/ correspondiente
git add .
git commit -m "Challenge 1: lista de contactos"
git push origin challenge-1
```

Repite para `challenge-2`, `challenge-3` y `challenge-4`, cambiando el número en cada comando.

## Antes de subir

- Revisa cada archivo y entiende qué hace — el profesor puede preguntarte por el código.
- Cambia algo (nombres de variables, estilos, textos) para que no sea idéntico al repo que compartiste con tu compañero.
- El Challenge 02 necesita que **tú** despliegues en Netlify con tu cuenta — eso no se puede automatizar por ti.
