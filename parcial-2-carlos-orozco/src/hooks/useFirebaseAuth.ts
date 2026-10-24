import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { emptyProgress } from '../missions';

// Errores de Firebase Auth en español
const traducir = (code: string) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Ese correo ya tiene cuenta. Entra con tu contraseña.';
    case 'auth/invalid-email':
      return 'El correo no es válido.';
    case 'auth/weak-password':
      return 'La contraseña necesita al menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento.';
    case 'auth/network-request-failed':
      return 'Sin conexión. Revisa tu internet.';
    case 'auth/operation-not-allowed':
      return 'Activa Email/Password en Firebase › Authentication › Sign-in method.';
    default:
      return 'No se pudo completar. Intenta de nuevo.';
  }
};

const codeOf = (e: unknown) => (typeof e === 'object' && e && 'code' in e ? String(e.code) : '');

// Custom hook con la sesión de Firebase Auth
const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setIsLoading(false);
      }),
    [],
  );

  const run = async (fn: () => Promise<void>) => {
    setIsPending(true);
    setError(null);
    try {
      await fn();
      return true;
    } catch (e) {
      console.error(e);
      setError(traducir(codeOf(e)));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const login = (email: string, password: string) =>
    run(async () => { await signInWithEmailAndPassword(auth, email, password); });

  const register = (email: string, password: string, name: string) =>
    run(async () => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Documento del usuario: así aparece en el ranking desde el primer momento
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        ...emptyProgress(),
        updatedAt: serverTimestamp(),
      });
      setUser({ ...cred.user, displayName: name } as User);
    });

  const logout = () => signOut(auth);
  const clear = () => setError(null);

  return { user, isLoading, isPending, error, login, register, logout, clear };
};

export default useFirebaseAuth;
