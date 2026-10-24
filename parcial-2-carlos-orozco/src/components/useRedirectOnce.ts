import { useEffect, useRef } from 'react';
import { useIonRouter } from '@ionic/react';

/**
 * Redirige UNA sola vez cuando `condition` se cumple. Ionic deja montadas en el
 * fondo las páginas anteriores del stack; un <Navigate> normal se volvería a
 * ejecutar en cada cambio de ruta. Se rearma cuando la condición vuelve a ser falsa.
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
