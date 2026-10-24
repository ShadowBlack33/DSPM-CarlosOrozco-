import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { IonButton, IonInput, IonSpinner } from '@ionic/react';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ mode }: { mode: 'login' | 'register' }) => {
  const { login, register, isPending, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const isRegister = mode === 'register';

  useEffect(() => {
    clearError();
    setLocalError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) return setLocalError('Escribe tu correo y tu contraseña.');
    if (isRegister && password.length < 6) return setLocalError('La contraseña necesita al menos 6 caracteres.');
    if (isRegister && password !== confirm) return setLocalError('Las contraseñas no coinciden.');
    // Al tener éxito, onAuthStateChanged actualiza el usuario y PublicRoute lleva a /home
    if (isRegister) await register(email, password);
    else await login(email, password);
  };

  const message = localError ?? error;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${mode}-email`}>Correo</label>
        <IonInput id={`${mode}-email`} type="email" inputmode="email" autocomplete="email"
          placeholder="tu@correo.com" value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} />
      </div>
      <div className="field">
        <label htmlFor={`${mode}-pass`}>Contraseña</label>
        <IonInput id={`${mode}-pass`} type="password" autocomplete={isRegister ? 'new-password' : 'current-password'}
          placeholder={isRegister ? 'Mínimo 6 caracteres' : '••••••'} value={password}
          onIonInput={(e) => setPassword(e.detail.value ?? '')} />
      </div>
      {isRegister && (
        <div className="field">
          <label htmlFor="register-confirm">Repite la contraseña</label>
          <IonInput id="register-confirm" type="password" autocomplete="new-password" value={confirm}
            onIonInput={(e) => setConfirm(e.detail.value ?? '')} />
        </div>
      )}

      {message && <div className="form-error" role="alert">{message}</div>}

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
