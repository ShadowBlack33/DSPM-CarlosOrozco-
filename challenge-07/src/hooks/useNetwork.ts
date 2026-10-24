import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    };
    checkInitialStatus();

    const listener = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
      setHistory((prev) => [
        `${new Date().toLocaleTimeString()}: ${status.connected ? 'conectado' : 'sin conexión'} (${status.connectionType})`,
        ...prev,
      ]);
    });

    return () => { listener.then((l) => l.remove()); };
  }, []);

  return { isOnline, connectionType, history };
};

export default useNetwork;
