<div align="center">

# Challenge 02 — PWA

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Service_Worker-5A0FC8?logo=pwa&logoColor=white)

</div>

---

La app de contactos del Challenge 01, convertida en Progressive Web App instalable.

## Funcionalidades

- Imagen agregada al componente padre.
- Manifest con ícono personalizado (`manifest.json`).
- Service Worker con estrategia híbrida de cacheo: Network First (HTML/API), Cache First (JS/CSS), Cache First + Stale While Revalidate (imágenes).
- Instalable en dispositivos móviles desde el navegador.

## Cómo correrla

```bash
npm install
npm run build
npm run preview
```

El modo `dev` no siempre activa el Service Worker correctamente — usa `build` + `preview` para probar el comportamiento real de producción.

## Demo

Link: _(pendiente de desplegar en Netlify)_

## Cómo instalar en el celular

1. Abre el link en Chrome (Android) o Safari (iOS).
2. Toca el menú (⋮) → "Agregar a pantalla de inicio" / "Añadir a inicio".
3. Confirma. La app quedará instalada como una app nativa.

## Estructura

```text
public/
├── manifest.json
└── service-worker.js
src/
├── App.tsx
└── components/
```
