import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { IonButton, IonInput, IonSpinner } from '@ionic/react';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ mode }: { mode: 'login' | 'register' }) => {
  const { login, register, isPending, error, clear } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const isRegister = mode === 'register';

  useEffect(() => { clear(); setLocalError(null); }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email.trim() || !password || (isRegister && !name.trim())) return setLocalError('Completa todos los campos.');
    if (password.length < 6) return setLocalError('La contraseña necesita al menos 6 caracteres.');
    // Al quedar la sesión abierta, PublicRoute lleva a /misiones
    if (isRegister) await register(email.trim(), password, name.trim());
    else await login(email.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isRegister && (
        <div className="field">
          <label htmlFor="r-name">Nombre (aparece en el ranking)</label>
          <IonInput id="r-name" autocomplete="name" value={name} placeholder="Carlos"
            onIonInput={(e) => setName(e.detail.value ?? '')} />
        </div>
      )}
      <div className="field">
        <label htmlFor={`${mode}-email`}>Correo</label>
        <IonInput id={`${mode}-email`} type="email" inputmode="email" autocomplete="email" placeholder="tu@correo.com"
          value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} />
      </div>
      <div className="field">
        <label htmlFor={`${mode}-pass`}>Contraseña</label>
        <IonInput id={`${mode}-pass`} type="password" autocomplete={isRegister ? 'new-password' : 'current-password'}
          placeholder={isRegister ? 'Mínimo 6 caracteres' : '••••••'} value={password}
          onIonInput={(e) => setPassword(e.detail.value ?? '')} />
      </div>

      {(localError || error) && <div className="form-error" role="alert">{localError ?? error}</div>}

      <IonButton className="btn-primary" expand="block" type="submit" disabled={isPending}>
        {isPending ? <IonSpinner name="dots" /> : isRegister ? 'Crear cuenta' : 'Entrar'}
      </IonButton>
      <p className="auth__switch">
        {isRegister
          ? <>¿Ya tienes cuenta? <Link to="/login">Entra aquí</Link></>
          : <>¿Primera vez? <Link to="/register">Crea una cuenta</Link></>}
      </p>
    </form>
  );
};

export default AuthForm;
