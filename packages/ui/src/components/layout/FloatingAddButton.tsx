import { FAB, useTheme } from 'react-native-paper';

type FloatingAddButtonProps = {
  onPress: () => void;
};

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  const theme = useTheme();

  return (
    <FAB
      icon="plus"
      onPress={onPress}
      customSize={56}
      style={{
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.24,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
      }}
      color={theme.colors.onPrimary}
    />
  );
}
