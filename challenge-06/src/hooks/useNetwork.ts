import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

// Detecta si el dispositivo tiene conexión y de qué tipo
const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setConnectionType(status.connectionType); // wifi | cellular | none | unknown
    };

    checkInitialStatus();

    const listener = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, []);

  return { isOnline, connectionType };
};

export default useNetwork;
