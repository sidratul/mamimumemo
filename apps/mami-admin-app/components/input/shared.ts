import { useAppTheme } from '../../theme/theme';

export function useSharedInputProps() {
  const theme = useAppTheme();

  return {
    textColor: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
  };
}
