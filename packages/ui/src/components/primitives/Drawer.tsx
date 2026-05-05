import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BottomDrawer } from '../layout/BottomDrawer';
import { Button } from './Button';
import { TextHeading, TextMuted } from './Typography';
import type { DrawerOptions, OverlayAction } from './overlay.types';

export type DrawerProps = DrawerOptions & {
  visible: boolean;
  onClose: () => void;
};

export function Drawer({ visible, title, description, content, actions, onClose }: DrawerProps) {
  async function handleAction(action?: OverlayAction) {
    await action?.onPress?.();
    onClose();
  }

  return (
    <BottomDrawer visible={visible} onDismiss={onClose}>
      <View style={{ gap: 6 }}>
        <TextHeading>{title}</TextHeading>
        {description ? <TextMuted>{description}</TextMuted> : null}
      </View>
      {content}
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
    </BottomDrawer>
  );
}
