import { Modal as RNModal, Pressable, View } from 'react-native';

import { Button } from './Button';
import { TextHeading, TextMuted } from './Typography';
import type { AlertOptions } from './overlay.types';

export type AlertDialogProps = AlertOptions & {
  visible: boolean;
  onClose: () => void;
};

export function AlertDialog({
  visible,
  title,
  description,
  confirmLabel = 'OK',
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
}: AlertDialogProps) {
  async function handleConfirm() {
    await onConfirm?.();
    onClose();
  }

  async function handleCancel() {
    await onCancel?.();
    onClose();
  }

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={() => void handleCancel()}
        style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(58, 17, 48, 0.2)' }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{ gap: 16, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 18 }}>
          <View style={{ gap: 6 }}>
            <TextHeading>{title}</TextHeading>
            {description ? <TextMuted>{description}</TextMuted> : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {cancelLabel ? (
              <View style={{ flex: 1 }}>
                <Button label={cancelLabel} variant="secondary" onPress={() => void handleCancel()} />
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              <Button label={confirmLabel} onPress={() => void handleConfirm()} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
