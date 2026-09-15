<div align="center">

# Challenge 04 — Login + Storage

![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![localStorage](https://img.shields.io/badge/Persistencia-localStorage-0f766e)

</div>

---

Demo de login en Ionic con sesión persistida en el navegador. Al iniciar sesión correctamente, la app guarda un token en `localStorage` y redirige a la lista; si el token ya existe al reabrir la app, salta el login automáticamente.

## Funcionalidades

- Formulario de login con validación de credenciales.
- Mensaje de error visible cuando las credenciales no coinciden.
- Sesión persistente: no es necesario volver a iniciar sesión si ya hay un token guardado.
- Botón de Logout que limpia la sesión y redirige de vuelta al login.
- Rutas protegidas con React Router v6 (`/login`, `/list`).

## Cómo correrla

```bash
npm install
npm run dev
```

## Estructura

```text
src/
├── App.tsx           → Rutas y redirección según sesión
└── pages/
    ├── Login.tsx      → Formulario de login
    └── ListPage.tsx   → Vista protegida + logout
```
