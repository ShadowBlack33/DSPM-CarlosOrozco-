import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// En dispositivos sin vibrador las llamadas resuelven sin hacer nada
const useHaptics = () => {
  const impact = (style: ImpactStyle = ImpactStyle.Medium) => Haptics.impact({ style });
  const notification = (type: NotificationType = NotificationType.Success) => Haptics.notification({ type });
  const vibrate = (duration = 300) => Haptics.vibrate({ duration });

  const selection = async () => {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  };

  return { impact, notification, vibrate, selection };
};

export default useHaptics;
