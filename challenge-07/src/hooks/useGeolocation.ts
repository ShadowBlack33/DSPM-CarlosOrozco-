import { useEffect, useRef, useState } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { friendlyError, support } from '../support';

const useGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<string | null>(null);

  // Una sola lectura del GPS
  const getCurrentPosition = async () => {
    setError(support.needsHttps());
    if (support.needsHttps()) return;
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setPosition(pos);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  // Seguimiento continuo de la posición
  const startWatch = async () => {
    setError(support.needsHttps());
    if (support.needsHttps()) return;
    try {
      watchId.current = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (err) setError(friendlyError(err));
        else if (pos) setPosition(pos);
      });
      setIsWatching(true);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  const stopWatch = async () => {
    if (watchId.current) await Geolocation.clearWatch({ id: watchId.current });
    watchId.current = null;
    setIsWatching(false);
  };

  useEffect(() => () => { if (watchId.current) Geolocation.clearWatch({ id: watchId.current }); }, []);

  return { position, isWatching, error, getCurrentPosition, startWatch, stopWatch };
};

export default useGeolocation;
