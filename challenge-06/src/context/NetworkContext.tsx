import { createContext, useContext, type ReactNode } from 'react';
import useNetwork from '../hooks/useNetwork';

type NetworkValue = ReturnType<typeof useNetwork>;

const NetworkContext = createContext<NetworkValue>({ isOnline: true, connectionType: null });

// Un solo listener de red compartido por todas las páginas
export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const network = useNetwork();
  return <NetworkContext.Provider value={network}>{children}</NetworkContext.Provider>;
};

export const useNetworkStatus = () => useContext(NetworkContext);
