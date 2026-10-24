import { useEffect, useRef } from 'react';
import { useIonRouter } from '@ionic/react';

/**
 * Redirige UNA sola vez cuando `condition` se cumple.
 *
 * Ionic deja montadas en el fondo las páginas anteriores del stack. Un <Navigate>
 * normal se vuelve a ejecutar cada vez que cambia la ruta, así que una página
 * vieja (p. ej. Login) "secuestraba" la navegación y cerraba /tasks/new.
 * Con este hook la redirección se dispara una vez y se rearma solo cuando
 * la condición vuelve a ser falsa (p. ej. después de un logout).
 *
 * Se navega con dirección 'root': Ionic limpia el stack de páginas, que es lo
 * correcto al entrar o salir de la sesión.
 */
const useRedirectOnce = (condition: boolean, to: string) => {
  const router = useIonRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const done = useRef(false);

  useEffect(() => {
    if (!condition) {
      done.current = false;
      return;
    }
    if (!done.current) {
      done.current = true;
      routerRef.current.push(to, 'root', 'replace');
    }
  }, [condition, to]);
};

export default useRedirectOnce;
