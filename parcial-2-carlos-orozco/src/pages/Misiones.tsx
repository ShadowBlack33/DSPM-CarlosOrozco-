import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { camera, locate, logOutOutline, refresh, stopCircleOutline, walk } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import useCamera from '../hooks/useCamera';
import MissionCard from '../components/MissionCard';
import ScoreHeader from '../components/ScoreHeader';
import TabBar from '../components/TabBar';
import { DISTANCE_GOAL_M, MAX_GPS_ACCURACY_M, MISSIONS, STILL_SECONDS } from '../missions';

/* ---------- Misión 1: Evidencia (cámara) ---------- */
const PhotoMission = () => {
  const { isCompleted, completeMission, photo } = useGame();
  const { takePhoto } = useCamera();
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const done = isCompleted(1);

  const shoot = async () => {
    setError(null);
    try {
      const img = await takePhoto();
      if (img) setDraft(img);
    } catch {
      setError('No se pudo abrir la cámara. Revisa el permiso de cámara.');
    }
  };

  // La misión se completa al guardar la imagen
  const save = async () => {
    if (!draft) return;
    setSaving(true);
    await completeMission(1, draft);
    setSaving(false);
    setDraft(null);
  };

  return (
    <MissionCard mission={MISSIONS[0]} completed={done} active={Boolean(draft)}>
      {done && photo && <img className="evidence" src={photo} alt="Foto de evidencia guardada" />}
      {!done && draft && (
        <>
          <img className="evidence" src={draft} alt="Vista previa de la foto" />
          <div className="row">
            <IonButton className="btn-ghost" onClick={shoot}><IonIcon slot="start" icon={refresh} />Repetir</IonButton>
            <IonButton className="btn-primary" onClick={save} disabled={saving}>
              {saving ? <IonSpinner name="dots" /> : 'Guardar evidencia'}
            </IonButton>
          </div>
        </>
      )}
      {!done && !draft && (
        <IonButton className="btn-primary" expand="block" onClick={shoot}>
          <IonIcon slot="start" icon={camera} />Abrir cámara
        </IonButton>
      )}
      {error && <div className="form-error">{error}</div>}
    </MissionCard>
  );
};

/* ---------- Misión 2: Movimiento real (GPS) ---------- */
const MoveMission = () => {
  const { isCompleted, distance } = useGame();
  const done = isCompleted(2);
  const { status, error, start, cancel, accuracy } = distance;
  const meters = distance.distance;
  const running = status === 'locating' || status === 'tracking';

  return (
    <MissionCard mission={MISSIONS[1]} completed={done} active={running}>
      {!done && running && (
        <div className="meter">
          <div className="meter__value">
            <strong>{status === 'locating' ? '—' : meters.toFixed(1)}</strong>
            <span>/ {DISTANCE_GOAL_M} m</span>
          </div>
          <div className="meter__track"><i style={{ width: `${Math.min(100, (meters / DISTANCE_GOAL_M) * 100)}%` }} /></div>
          <p className="hint">
            {status === 'locating'
              ? 'Fijando tu posición original…'
              : accuracy && accuracy > MAX_GPS_ACCURACY_M
                ? `Precisión del GPS baja (±${Math.round(accuracy)} m). Sal a un lugar abierto.`
                : `Camina. GPS ±${Math.round(accuracy ?? 0)} m`}
          </p>
          <IonButton className="btn-ghost" expand="block" onClick={cancel}>
            <IonIcon slot="start" icon={stopCircleOutline} />Detener
          </IonButton>
        </div>
      )}
      {!done && !running && (
        <IonButton className="btn-primary" expand="block" onClick={start}>
          <IonIcon slot="start" icon={locate} />Fijar posición y empezar
        </IonButton>
      )}
      {done && <p className="hint ok">Te moviste más de {DISTANCE_GOAL_M} m desde tu punto de partida.</p>}
      {error && <div className="form-error">{error}</div>}
    </MissionCard>
  );
};

/* ---------- Misión 3: Permanencia activa (acelerómetro + vibración) ---------- */
// Safari en iPhone no tiene API de vibración; la app nativa (Capacitor Haptics) sí vibra
const canVibrate = Capacitor.isNativePlatform() || 'vibrate' in navigator;

const StillMission = () => {
  const { isCompleted, isUnlocked, stillness } = useGame();
  const done = isCompleted(3);
  const { status, elapsed, moved, hasSensor, error, start, cancel } = stillness;
  const running = status === 'running';
  const left = Math.max(0, STILL_SECONDS - elapsed / 1000);
  const pct = (elapsed / (STILL_SECONDS * 1000)) * 100;

  return (
    <MissionCard mission={MISSIONS[2]} completed={done} active={running} locked={!isUnlocked(3)}
      lockedText="Se habilita cuando completes «Movimiento real».">
      {!done && running && (
        <div className={`still ${moved ? 'still--moved' : ''}`}>
          <div className="still__ring" style={{ ['--p' as string]: `${pct}%` }}>
            <strong>{left.toFixed(1)}</strong><span>seg</span>
          </div>
          <p className="hint" role="status">
            {moved ? '¡Te moviste! El conteo vuelve a empezar.' : 'No te muevas…'}
          </p>
          {hasSensor === false && (
            <p className="hint warn">Este dispositivo no reporta acelerómetro: el conteo corre sin verificar movimiento.</p>
          )}
          <IonButton className="btn-ghost" expand="block" onClick={cancel}>
            <IonIcon slot="start" icon={stopCircleOutline} />Cancelar
          </IonButton>
        </div>
      )}
      {!done && !running && (
        <IonButton className="btn-primary" expand="block" onClick={start}>
          <IonIcon slot="start" icon={walk} />Empezar a quedarme quieto
        </IonButton>
      )}
      {done && (
        <p className="hint ok">
          Aguantaste {STILL_SECONDS} segundos quieto.{' '}
          {canVibrate ? 'El celular vibró.' : 'Este navegador no permite vibrar (Safari en iPhone); en la app nativa sí vibra.'}
        </p>
      )}
      {error && <div className="form-error">{error}</div>}
    </MissionCard>
  );
};

const Misiones = () => {
  const { user, logout } = useAuth();
  const { loaded, distance, stillness } = useGame();
  const name = user?.displayName || user?.email?.split('@')[0] || '';

  const handleLogout = async () => {
    distance.cancel();
    stillness.cancel();
    await logout();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="topbar">
          <span className="brand">MISIONES</span>
          <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Cerrar sesión">
            <IonIcon icon={logOutOutline} />
          </button>
        </div>
        <ScoreHeader name={name} />
        {!loaded ? (
          <div className="center-fill pad"><IonSpinner name="crescent" /></div>
        ) : (
          <main className="missions">
            <PhotoMission />
            <MoveMission />
            <StillMission />
          </main>
        )}
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Misiones;
