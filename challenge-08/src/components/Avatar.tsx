import { IonAvatar } from '@ionic/react';

// Foto de perfil o, si no hay, la inicial del nombre
const Avatar = ({ url, name, size = 36 }: { url?: string | null; name?: string; size?: number }) =>
  url ? (
    <IonAvatar style={{ width: size, height: size }}>
      <img src={url} alt="Tu foto de perfil" />
    </IonAvatar>
  ) : (
    <span
      aria-label="Tu perfil"
      style={{
        width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: 'var(--violet-soft)', color: 'var(--violet)', fontWeight: 800, fontSize: size * 0.42,
      }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );

export default Avatar;
