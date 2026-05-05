import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, ScrollView, View } from 'react-native';

import { Button } from './Button';
import { TextHeading, TextMuted } from './Typography';
import type { ModalOptions, OverlayAction } from './overlay.types';

export type ModalProps = ModalOptions & {
  visible: boolean;
  onClose: () => void;
};

export function Modal({ visible, title, description, content, actions, dismissible = true, onClose }: ModalProps) {
  async function handleAction(action?: OverlayAction) {
    await action?.onPress?.();
    onClose();
  }

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={dismissible ? onClose : undefined}
        style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(58, 17, 48, 0.2)' }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{ maxHeight: '85%', borderRadius: 18, backgroundColor: '#FFFFFF', padding: 16, gap: 12 }}>
          <View style={{ gap: 6 }}>
            <TextHeading>{title}</TextHeading>
            {description ? <TextMuted>{description}</TextMuted> : null}
          </View>
          {content ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : null}
          <View style={{ gap: 10 }}>
            {(actions?.length ? actions : [{ label: 'Tutup', variant: 'secondary' as const }]).map((action) => (
              <Button
                key={action.label}
                label={action.label}
                variant={action.variant ?? 'secondary'}
                onPress={() => void handleAction(action)}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
