import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirige UNA sola vez cuando `condition` se cumple.
 *
 * Ionic deja montadas en el fondo las páginas anteriores del stack. Un <Navigate>
 * normal se vuelve a ejecutar cada vez que cambia la ruta, así que una página
 * vieja (p. ej. Login) "secuestraba" la navegación y cerraba /tasks/new.
 * Con este hook la redirección se dispara una vez y se rearma solo cuando
 * la condición vuelve a ser falsa (p. ej. después de un logout).
 */
const useRedirectOnce = (condition: boolean, to: string) => {
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (!condition) {
      done.current = false;
      return;
    }
    if (!done.current) {
      done.current = true;
      navigate(to, { replace: true });
    }
  }, [condition, to, navigate]);
};

export default useRedirectOnce;
