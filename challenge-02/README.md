# Challenge 02 - PWA sobre la app de contactos

## Cómo usarlo
1. Parte del proyecto del Challenge 01 (o copia esta carpeta completa: `src` y `public`).
2. Agrega un ícono real en `public/contacts-icon.png` y en `public/icon-192.png` / `icon-512.png`.
3. En `index.html`, dentro de `<head>`, agrega:
   ```html
   <link rel="manifest" href="/manifest.json" />
   <meta name="theme-color" content="#317EFB" />
   ```
4. `npm run build` y prueba localmente que el service worker se registre (consola del navegador).

## Desplegar en Netlify (debes hacerlo tú con tu cuenta)
1. Ve a https://app.netlify.com y entra con tu cuenta (GitHub sirve).
2. "Add new site" → "Import an existing project" → conecta tu repo o arrastra la carpeta `dist` generada por `npm run build`.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Copia el link que te da Netlify (ej. `https://tu-app.netlify.app`).

## Para el Readme.md de tu entrega
Agrega algo así:
```markdown
## Demo
Link: https://tu-app.netlify.app

## Cómo instalar en el celular
1. Abre el link en Chrome (Android) o Safari (iOS).
2. Toca el menú (⋮) → "Agregar a pantalla de inicio" / "Añadir a inicio".
3. Confirma. La app quedará instalada como una app nativa.
```

## Qué cumple del enunciado
- Imagen agregada al componente padre (`App.jsx`).
- PWA con estrategia híbrida: Network First (HTML/API), Cache First (JS/CSS), Cache First + Stale While Revalidate (imágenes).
- Ícono personalizado vía `manifest.json`.
- Pendiente por tu parte: desplegar en Netlify y pegar el link + instrucciones en el Readme real.
