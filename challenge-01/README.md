<div align="center">

# Challenge 01 — Lista de contactos

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

</div>

---

App en React para listar, agregar y eliminar contactos, con una carga inicial simulada mediante un loader.

## Funcionalidades

- Loader al iniciar, simulando la carga inicial de datos (`setTimeout` dentro de `useEffect`).
- Carga de una lista inicial de contactos.
- Agregar contacto con nombre y teléfono.
- Eliminar contacto desde el listado.
- App dividida en componentes reutilizables.

## Cómo correrla

```bash
npm install
npm run dev
```

## Estructura

```text
src/
├── App.tsx
├── types.ts               → Interfaz Contact
└── components/
    ├── Loader.tsx
    ├── AddContactForm.tsx
    ├── ContactList.tsx
    └── ContactItem.tsx
```
