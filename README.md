<div align="center">

# Desarrollo de Software para Plataformas Móviles

**Universidad Autónoma de Occidente**

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Service_Worker-5A0FC8?logo=pwa&logoColor=white)

</div>

---

Repositorio del curso **Desarrollo de Software para Plataformas Móviles (DSPM)**. Aquí se organizan los challenges, prácticas y parciales desarrollados durante el semestre, usando React, Ionic y tecnologías PWA para construir aplicaciones móviles multiplataforma.

## Contenido

- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Challenge 01 — Lista de contactos](#challenge-01--lista-de-contactos)
- [Challenge 02 — PWA](#challenge-02--pwa)
- [Challenge 03 — Task Manager](#challenge-03--task-manager)
- [Challenge 04 — Login + Storage](#challenge-04--login--storage)

## Tecnologías

| | |
|---|---|
| ⚛️ **React** | Componentes, estados y efectos |
| 🌐 **PWA** | Service Workers y manifest |
| 🔷 **Ionic** | Componentes nativos y navegación |
| ⚡ **Vite** | Bundler y entorno de desarrollo |
| 💾 **localStorage** | Persistencia local |

## Estructura del repositorio

Cada trabajo se organiza en su propia rama:

```text
main               → Este README
challenge-1        → Challenge 01 — Lista de contactos (React)
challenge-2        → Challenge 02 — PWA (React + Service Worker)
challenge-3        → Challenge 03 — Task Manager (Ionic)
challenge-4        → Challenge 04 — Login + Storage (Ionic)
```

---

## Challenge 01 — Lista de contactos

Aplicación en **React + Vite** para administrar una lista de contactos.

**Funcionalidades:**
- Carga inicial de contactos con estado de loading.
- Agregar contacto (nombre y teléfono).
- Eliminar contacto.
- Aplicación dividida en componentes reutilizables.

```bash
cd challenge-1
npm install
npm run dev
```

---

## Challenge 02 — PWA

Extensión del Challenge 01 como **Progressive Web App**.

**Funcionalidades:**
- Manifest con ícono personalizado.
- Service Worker con estrategia híbrida de cacheo.
- Instalable en dispositivos móviles.

```bash
cd challenge-2
npm install
npm run build
```

---

## Challenge 03 — Task Manager

Aplicación en **Ionic** para gestión de tareas.

**Funcionalidades:**
- Listar, agregar, completar y eliminar tareas.
- Componentes padre/hijo con estado compartido.

```bash
cd challenge-3
npm install
ionic serve
```

---

## Challenge 04 — Login + Storage

Demo de autenticación en **Ionic** con sesión persistente.

**Funcionalidades:**
- Login con validación de credenciales.
- Sesión guardada en `localStorage`.
- Logout que limpia la sesión.

```bash
cd challenge-4
npm install
ionic serve
```
