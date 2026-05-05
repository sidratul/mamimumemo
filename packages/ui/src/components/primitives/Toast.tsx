import { Snackbar } from 'react-native-paper';

export type ToastTone = 'default' | 'success' | 'danger';

export type ToastProps = {
  visible: boolean;
  message: string;
  tone?: ToastTone;
  onDismiss: () => void;
  duration?: number;
};

export function Toast({
  visible,
  message,
  tone = 'default',
  onDismiss,
  duration = 3200,
}: ToastProps) {
  const backgroundColor =
    tone === 'success' ? '#1F9D63' : tone === 'danger' ? '#C6285A' : '#3A1130';

  return (
    <Snackbar
      visible={visible}
      duration={duration}
      onDismiss={onDismiss}
      style={{ backgroundColor }}>
      {message}
    </Snackbar>
  );
}
