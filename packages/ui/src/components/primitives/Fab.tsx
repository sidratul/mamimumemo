import { Portal, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FabAction = {
  icon: string;
  label: string;
  onPress: () => void;
};

type FabMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: FabAction[];
  visible?: boolean;
};

type FabButtonProps = {
  icon?: string;
  onPress: () => void;
  visible?: boolean;
  bottomOffset?: number;
  rightOffset?: number;
};

export function FabButton({
  icon = 'plus',
  onPress,
  visible = true,
  bottomOffset = 24,
  rightOffset = 16,
}: FabButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <FAB
        icon={icon}
        onPress={onPress}
        customSize={56}
        style={{
          position: 'absolute',
          right: rightOffset,
          bottom: insets.bottom + bottomOffset,
          borderRadius: 999,
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
          shadowOpacity: 0.24,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }}
        color={theme.colors.onPrimary}
      />
    </Portal>
  );
}

export function FabMenu({ open, onOpenChange, actions, visible = true }: FabMenuProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible={visible}
        icon={open ? 'close' : 'plus'}
        color={theme.colors.onPrimary}
        fabStyle={{
          borderRadius: 999,
          backgroundColor: theme.colors.primary,
          marginBottom: insets.bottom + 24,
        }}
        style={{
          paddingRight: 16,
        }}
        onStateChange={({ open: nextOpen }) => onOpenChange(nextOpen)}
        actions={actions.map((action) => ({
          icon: action.icon,
          label: action.label,
          onPress: action.onPress,
        }))}
      />
    </Portal>
  );
}
