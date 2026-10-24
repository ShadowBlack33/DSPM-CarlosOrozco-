import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Mensajes de Supabase Auth en español
const traducir = (msg: string) => {
  if (/invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
  if (/email address .* is invalid/i.test(msg))
    return 'Supabase rechazó ese correo. Desactiva "Confirm email" en Authentication › Sign In / Providers › Email, o usa un correo real.';
  if (/not authorized/i.test(msg)) return 'Supabase no puede enviar correo a esa dirección. Desactiva "Confirm email" en el panel.';
  if (/already registered/i.test(msg)) return 'Ese correo ya tiene cuenta. Entra con tu contraseña.';
  if (/email not confirmed/i.test(msg)) return 'Confirma tu correo antes de entrar (revisa tu bandeja), o desactiva "Confirm email" en el panel.';
  if (/rate limit/i.test(msg)) return 'Demasiados intentos seguidos. Espera un minuto y vuelve a intentar.';
  if (/password should be at least/i.test(msg)) return 'La contraseña necesita al menos 6 caracteres.';
  return msg;
};

// Custom hook con la lógica de autenticación de Supabase
const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Sesión guardada localmente
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // Escucha login / logout / refresco de token / cambios de metadatos
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const run = async (fn: () => Promise<{ error: { message: string } | null }>) => {
    setIsPending(true);
    setError(null);
    setMessage(null);
    const { error } = await fn();
    setIsPending(false);
    if (error) {
      setError(traducir(error.message));
      return false;
    }
    return true;
  };

  const login = (email: string, password: string) =>
    run(() => supabase.auth.signInWithPassword({ email, password }));

  const register = async (email: string, password: string, nombre: string) => {
    let needsConfirmation = false;
    const ok = await run(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { nombre }, // metadatos del usuario
        },
      });
      needsConfirmation = !error && !data.session;
      return { error };
    });
    if (ok && needsConfirmation) setMessage('Revisa tu correo para confirmar la cuenta');
    return ok;
  };

  const logout = () => supabase.auth.signOut();

  const updateMetadata = (data: Record<string, unknown>) => run(() => supabase.auth.updateUser({ data }));

  const clear = () => { setError(null); setMessage(null); };

  const user: User | null = session?.user ?? null;

  return { session, user, isLoading, isPending, error, message, login, register, logout, updateMetadata, clear };
};

export default useSupabaseAuth;
