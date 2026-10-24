import { useEffect, useState } from 'react';
import { Device, type BatteryInfo, type DeviceId, type DeviceInfo, type GetLanguageCodeResult } from '@capacitor/device';

const useDevice = () => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [id, setId] = useState<DeviceId | null>(null);
  const [language, setLanguage] = useState<GetLanguageCodeResult | null>(null);

  const load = async () => {
    setInfo(await Device.getInfo());
    setId(await Device.getId());
    setLanguage(await Device.getLanguageCode());
    try {
      setBattery(await Device.getBatteryInfo());
    } catch {
      setBattery(null); // algunos navegadores no exponen la batería
    }
  };

  useEffect(() => { load(); }, []);

  return { info, battery, id, language, refresh: load };
};

export default useDevice;
