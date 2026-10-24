import type { ReactNode } from 'react';
import { IonIcon } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';

const Notice = ({ children }: { children: ReactNode }) => (
  <div className="notice" role="note">
    <IonIcon icon={informationCircleOutline} aria-hidden="true" />
    <span>{children}</span>
  </div>
);

export default Notice;
