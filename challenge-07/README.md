<div align="center">

# Challenge 07 — Sensores con Capacitor

![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?logo=ionic&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)

</div>

---

App vacía en Ionic con una **Home de botones (uno por sensor)** y **una página por sensor**. Cada sensor tiene su propio custom hook.

| Sensor | Plugin | Hook | Página |
|---|---|---|---|
| Geolocalización | `@capacitor/geolocation` | `useGeolocation` (getCurrentPosition, watchPosition) | `/geolocation` |
| Cámara | `@capacitor/camera` | `useCamera` (getPhoto: cámara o galería) | `/camera` |
| Acelerómetro | `@capacitor/motion` | `useAccelerometer` (`accel` + `orientation`) | `/accelerometer` |
| Dispositivo | `@capacitor/device` | `useDevice` (info, batería, id, idioma) | `/device` |
| Vibración | `@capacitor/haptics` | `useHaptics` (impact, notification, vibrate, selection) | `/haptics` |
| Archivos | `@capacitor/filesystem` | `useFilesystem` (write, read, append, delete, readdir) | `/filesystem` |
| Notificaciones locales | `@capacitor/local-notifications` | `useLocalNotifications` | `/local-notifications` |
| Push notifications | `@capacitor/push-notifications` | `usePushNotifications` (token FCM) | `/push-notifications` |
| Red | `@capacitor/network` | `useNetwork` | `/network` |

Los botones del Home se generan desde `src/sensors.ts`, así que agregar un sensor es agregar una entrada ahí y su ruta.

## Diseño

**"Tablero de instrumentos"**: fondo oscuro de cabina y un color de señal distinto para cada sensor.

- Tipografías: *Archivo* para títulos y *JetBrains Mono* para las lecturas, de ancho fijo para que los números no "bailen" al cambiar.
- Ubicación con una retícula de radar, Movimiento con un nivel de burbuja que se inclina con el teléfono y Dispositivo con un indicador de batería.
- El color de cada sensor está en `src/sensors.ts` y se propaga con la variable CSS `--sensor`.

## Cómo correrla

### En el navegador

```bash
npm install
npm run dev
```

### En el celular (misma red Wi‑Fi)

```bash
npm run phone
```

Abre en el celular la dirección `https://192.168.x.x:5173` que aparece en `Network:`. Como el certificado es de desarrollo, el navegador muestra una advertencia: toca **Mostrar detalles → Visitar este sitio web** (Safari) o **Configuración avanzada → Continuar** (Chrome).

**Si Safari no deja abrir el certificado de desarrollo** (pasa en iOS 18), usa un túnel con HTTPS válido:

```bash
npm run dev
# en otra terminal (instalar una vez: winget install --id Cloudflare.cloudflared)
cloudflared tunnel --url http://localhost:5173
```

Abre en el celular la URL `https://xxxx.trycloudflare.com` que aparece. `vite.config.ts` ya permite ese dominio en `server.allowedHosts`.

El HTTPS es obligatorio: iOS y Android solo habilitan GPS, cámara y movimiento en páginas seguras.

| Sensor | Navegador del celular | App nativa |
|---|---|---|
| Ubicación, cámara, movimiento, archivos, dispositivo, red | ✅ (con HTTPS) | ✅ |
| Vibración | Solo Chrome de Android (Safari no lo permite) | ✅ |
| Notificaciones locales | Solo si la página se agrega a la pantalla de inicio en iPhone | ✅ |
| Push notifications | ❌ | ✅ (con Firebase) |
| Nivel de batería | Solo Chrome (Safari lo oculta) | ✅ |

Cuando el navegador no ofrece un sensor, la página lo explica con un aviso en vez de fallar.

### En Android (todos los sensores)

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Agrega estos permisos en `android/app/src/main/AndroidManifest.xml` si Android Studio no los incluye:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

### Push notifications

Solo funcionan en un dispositivo real con Firebase Cloud Messaging:

1. En Firebase, agrega una app **Android** con el package `co.edu.uao.challenge07`.
2. Descarga `google-services.json` y ponlo en `android/app/`.
3. En la app: **Push notifications → Registrar dispositivo** y copia el token.
4. Firebase → **Messaging → Nueva campaña → Enviar mensaje de prueba** y pega el token.

## Estructura

```text
src/
├── sensors.ts            → lista de sensores para el Home
├── hooks/                → un custom hook por sensor
├── components/ SensorPage.tsx  DataRow.tsx
└── pages/ Home + una página por sensor
```
